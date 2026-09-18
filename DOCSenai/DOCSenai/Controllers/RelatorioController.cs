using DOCSenai.Data;
using DOCSenai.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace DOCSenai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RelatorioController : ControllerBase
    {
        private readonly DOCSenaiContext _context;
        private readonly IWebHostEnvironment _environment;

        public RelatorioController(
            DOCSenaiContext context,
            IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }


        // =========================================================
        // VERIFICAR SUPERVISÃO
        // =========================================================

        private async Task<(bool autorizado, int idUsuario)> VerificarSupervisao()
        {
            var idLogadoString =
                HttpContext.Session.GetString("IdLogado");

            if (string.IsNullOrEmpty(idLogadoString))
            {
                return (false, 0);
            }

            if (!int.TryParse(idLogadoString, out int idLogado))
            {
                return (false, 0);
            }

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u =>
                    u.Id_Usuario == idLogado);

            if (usuario == null)
            {
                return (false, 0);
            }

            var cargoValido =
                usuario.Cargo == "Supervisão" ||
                usuario.Cargo == "Supervisao" ||
                usuario.Cargo == "Supervisor" ||
                usuario.Cargo == "Supervisora";

            if (!cargoValido)
            {
                return (false, 0);
            }

            return (true, idLogado);
        }


        // =========================================================
        // LISTAR RELATÓRIOS GERADOS
        // =========================================================

        [HttpGet("listar")]
        public async Task<IActionResult> ListarRelatorios()
        {
            var verificacao =
                await VerificarSupervisao();

            if (!verificacao.autorizado)
            {
                return Unauthorized(new
                {
                    mensagem =
                        "Usuário não está autorizado."
                });
            }


            // -----------------------------------------------------
            // BUSCAR RELATÓRIOS
            // -----------------------------------------------------

            var relatorios =
                await _context.Relatorios
                    .OrderByDescending(r =>
                        r.Data_Criacao)
                    .ToListAsync();


            // -----------------------------------------------------
            // MONTAR RESULTADO
            // -----------------------------------------------------

            var resultado =
                new List<object>();


            foreach (var relatorio in relatorios)
            {
                // -----------------------------------------------
                // RESPONSÁVEL
                // -----------------------------------------------

                var usuario =
                    await _context.Usuarios
                        .FirstOrDefaultAsync(u =>
                            u.Id_Usuario ==
                            relatorio.Fk_Usuario_Id_Usuario);


                // -----------------------------------------------
                // ATIVIDADES DO RELATÓRIO
                // -----------------------------------------------

                var idsAtividades =
                    await _context.Relatorios_Atividades
                        .Where(ra =>
                            ra.Fk_Relatorio_Id_Relatorio ==
                            relatorio.Id_Relatorio)
                        .Select(ra =>
                            ra.Fk_Atividade_Id_Atividade)
                        .ToListAsync();


                // -----------------------------------------------
                // QUANTIDADE DE ATIVIDADES
                // -----------------------------------------------

                var quantidadeAtividades =
                    idsAtividades.Count;


                // -----------------------------------------------
                // BUSCAR CURSOS DAS ATIVIDADES
                // -----------------------------------------------

                var dadosTurmas =
                    await (
                        from atividade in _context.Atividades

                        join turma in _context.Turmas
                            on atividade.Fk_Turma_Id_Turma
                            equals turma.Id_Turma

                        where idsAtividades.Contains(
                            atividade.Id_Atividade)

                        select new
                        {
                            turma.Id_Turma,
                            turma.Nome_Turma,
                            turma.Curso,
                            turma.Periodo,
                            atividade.Data_Atividade
                        }
                    )
                    .ToListAsync();


                // -----------------------------------------------
                // CURSOS
                // -----------------------------------------------

                var cursos =
                    dadosTurmas
                        .Select(t =>
                            t.Curso)
                        .Where(c =>
                            !string.IsNullOrWhiteSpace(c))
                        .Distinct()
                        .OrderBy(c =>
                            c)
                        .ToList();


                // -----------------------------------------------
                // TURMAS
                // -----------------------------------------------

                var turmas =
                    dadosTurmas
                        .Select(t =>
                            t.Nome_Turma)
                        .Where(t =>
                            !string.IsNullOrWhiteSpace(t))
                        .Distinct()
                        .OrderBy(t =>
                            t)
                        .ToList();


                // -----------------------------------------------
                // PERÍODO REAL DAS ATIVIDADES
                // -----------------------------------------------

                DateTime? periodoInicio = null;
                DateTime? periodoFim = null;


                if (dadosTurmas.Count > 0)
                {
                    periodoInicio =
                        dadosTurmas
                            .Min(t =>
                                t.Data_Atividade);

                    periodoFim =
                        dadosTurmas
                            .Max(t =>
                                t.Data_Atividade);
                }


                // -----------------------------------------------
                // ADICIONAR AO RESULTADO
                // -----------------------------------------------

                resultado.Add(new
                {
                    id =
                        relatorio.Id_Relatorio,

                    titulo =
                        relatorio.Titulo_Pdf,

                    periodo_inicio =
                        periodoInicio.HasValue
                            ? periodoInicio.Value
                                .ToString("dd/MM/yyyy")
                            : null,

                    periodo_fim =
                        periodoFim.HasValue
                            ? periodoFim.Value
                                .ToString("dd/MM/yyyy")
                            : relatorio.Periodo_Fim
                                .ToString("dd/MM/yyyy"),

                    data_criacao =
                        relatorio.Data_Criacao
                            .ToString("dd/MM/yyyy HH:mm"),

                    descricao =
                        relatorio.Descricao,

                    responsavel =
                        usuario != null
                            ? usuario.Nome
                            : "Não informado",

                    quantidade_atividades =
                        quantidadeAtividades,

                    curso =
                        cursos.Count > 0
                            ? string.Join(", ", cursos)
                            : null,

                    cursos =
                        cursos,

                    turmas =
                        turmas
                });
            }


            return Ok(resultado);
        }


        // =========================================================
        // GERAR RELATÓRIO
        // =========================================================

        [HttpPost("gerar")]
        public async Task<IActionResult> GerarRelatorio(
            [FromBody] GerarRelatorioRequest request)
        {
            try
            {
                // -------------------------------------------------
                // VERIFICAR SUPERVISÃO
                // -------------------------------------------------

                var verificacao =
                    await VerificarSupervisao();

                if (!verificacao.autorizado)
                {
                    return Unauthorized(new
                    {
                        mensagem =
                            "Usuário não está autorizado."
                    });
                }


                // -------------------------------------------------
                // VALIDAR REQUEST
                // -------------------------------------------------

                if (request == null)
                {
                    return BadRequest(new
                    {
                        mensagem =
                            "Dados do relatório não foram enviados."
                    });
                }

                if (string.IsNullOrWhiteSpace(request.Titulo))
                {
                    return BadRequest(new
                    {
                        mensagem =
                            "Informe o título do relatório."
                    });
                }

                if (request.Atividades == null ||
                    request.Atividades.Count == 0)
                {
                    return BadRequest(new
                    {
                        mensagem =
                            "Selecione pelo menos uma atividade."
                    });
                }

                if (request.PeriodoInicio.Date >
                    request.PeriodoFim.Date)
                {
                    return BadRequest(new
                    {
                        mensagem =
                            "A data inicial não pode ser maior que a data final."
                    });
                }


                // -------------------------------------------------
                // IDS DAS ATIVIDADES
                // -------------------------------------------------

                var idsAtividades =
                    request.Atividades
                        .Distinct()
                        .ToList();


                // -------------------------------------------------
                // BUSCAR ATIVIDADES
                // -------------------------------------------------

                var atividades =
                    await _context.Atividades
                        .Where(a =>
                            idsAtividades.Contains(
                                a.Id_Atividade))
                        .OrderBy(a =>
                            a.Data_Atividade)
                        .ToListAsync();


                if (atividades.Count == 0)
                {
                    return NotFound(new
                    {
                        mensagem =
                            "Nenhuma atividade encontrada."
                    });
                }


                // -------------------------------------------------
                // VERIFICAR SE TODAS EXISTEM
                // -------------------------------------------------

                if (atividades.Count !=
                    idsAtividades.Count)
                {
                    return BadRequest(new
                    {
                        mensagem =
                            "Uma ou mais atividades selecionadas não foram encontradas."
                    });
                }


                // -------------------------------------------------
                // VERIFICAR PERÍODO
                // -------------------------------------------------

                var periodoInicio =
                    request.PeriodoInicio.Date;

                var periodoFim =
                    request.PeriodoFim.Date;


                var atividadeForaPeriodo =
                    atividades.Any(a =>
                        a.Data_Atividade.Date <
                            periodoInicio ||
                        a.Data_Atividade.Date >
                            periodoFim);


                if (atividadeForaPeriodo)
                {
                    return BadRequest(new
                    {
                        mensagem =
                            "Uma ou mais atividades estão fora do período selecionado."
                    });
                }


                // -------------------------------------------------
                // VERIFICAR PROFESSOR
                // -------------------------------------------------

                if (request.Professor.HasValue)
                {
                    var professor =
                        await _context.Usuarios
                            .FirstOrDefaultAsync(u =>
                                u.Id_Usuario ==
                                request.Professor.Value &&
                                (
                                    u.Cargo == "Professor" ||
                                    u.Cargo == "Professora"
                                ));

                    if (professor == null)
                    {
                        return NotFound(new
                        {
                            mensagem =
                                "Professor não encontrado."
                        });
                    }


                    var atividadeProfessorDiferente =
                        atividades.Any(a =>
                            a.Fk_Usuario_Id_Usuario !=
                            request.Professor.Value);


                    if (atividadeProfessorDiferente)
                    {
                        return BadRequest(new
                        {
                            mensagem =
                                "Existe uma atividade selecionada que pertence a outro professor."
                        });
                    }
                }


                // -------------------------------------------------
                // VERIFICAR TURMA
                // -------------------------------------------------

                if (request.Turma.HasValue)
                {
                    var turma =
                        await _context.Turmas
                            .FirstOrDefaultAsync(t =>
                                t.Id_Turma ==
                                request.Turma.Value);

                    if (turma == null)
                    {
                        return NotFound(new
                        {
                            mensagem =
                                "Turma não encontrada."
                        });
                    }


                    var atividadeTurmaDiferente =
                        atividades.Any(a =>
                            a.Fk_Turma_Id_Turma !=
                            request.Turma.Value);


                    if (atividadeTurmaDiferente)
                    {
                        return BadRequest(new
                        {
                            mensagem =
                                "Existe uma atividade selecionada que pertence a outra turma."
                        });
                    }
                }


                // -------------------------------------------------
                // VERIFICAR CURSO
                // -------------------------------------------------

                if (!string.IsNullOrWhiteSpace(request.Curso))
                {
                    var turmasCurso =
                        await _context.Turmas
                            .Where(t =>
                                t.Curso ==
                                request.Curso)
                            .Select(t =>
                                t.Id_Turma)
                            .ToListAsync();


                    if (turmasCurso.Count == 0)
                    {
                        return NotFound(new
                        {
                            mensagem =
                                "Curso não encontrado."
                        });
                    }


                    var atividadeCursoDiferente =
                        atividades.Any(a =>
                            !turmasCurso.Contains(
                                a.Fk_Turma_Id_Turma));


                    if (atividadeCursoDiferente)
                    {
                        return BadRequest(new
                        {
                            mensagem =
                                "Existe uma atividade selecionada que pertence a outro curso."
                        });
                    }
                }


                // =================================================
                // BUSCAR DADOS COMPLETOS
                // =================================================

                var dadosAtividades =
                    await (
                        from atividade in _context.Atividades

                        join usuario in _context.Usuarios
                            on atividade.Fk_Usuario_Id_Usuario
                            equals usuario.Id_Usuario

                        join turma in _context.Turmas
                            on atividade.Fk_Turma_Id_Turma
                            equals turma.Id_Turma

                        where idsAtividades.Contains(
                            atividade.Id_Atividade)

                        orderby atividade.Data_Atividade

                        select new RelatorioAtividadeDto
                        {
                            Id =
                                atividade.Id_Atividade,

                            Data =
                                atividade.Data_Atividade,

                            Descricao =
                                atividade.Descricao_Atividade,

                            Observacao =
                                atividade.Observacao,

                            Professor =
                                usuario.Nome,

                            Turma =
                                turma.Nome_Turma,

                            Curso =
                                turma.Curso
                        }
                    )
                    .ToListAsync();


                if (dadosAtividades.Count == 0)
                {
                    return NotFound(new
                    {
                        mensagem =
                            "Não foi possível obter os dados das atividades."
                    });
                }


                // =================================================
                // BUSCAR USUÁRIO RESPONSÁVEL
                // =================================================

                var usuarioResponsavel =
                    await _context.Usuarios
                        .FirstOrDefaultAsync(u =>
                            u.Id_Usuario ==
                            verificacao.idUsuario);


                if (usuarioResponsavel == null)
                {
                    return NotFound(new
                    {
                        mensagem =
                            "Usuário responsável não encontrado."
                    });
                }


                // =================================================
                // CONFIGURAR QUESTPDF
                // =================================================

                QuestPDF.Settings.License =
                    LicenseType.Community;


                // =================================================
                // CRIAR PASTA
                // =================================================

                var pastaRelatorios =
                    Path.Combine(
                        _environment.WebRootPath,
                        "relatorios");


                if (!Directory.Exists(
                    pastaRelatorios))
                {
                    Directory.CreateDirectory(
                        pastaRelatorios);
                }


                // =================================================
                // CRIAR RELATÓRIO
                // =================================================

                var relatorio =
                    new Relatorio
                    {
                        Titulo_Pdf =
                            request.Titulo.Trim(),

                        Periodo_Fim =
                            request.PeriodoFim.Date,

                        Data_Criacao =
                            DateTime.Now,

                        Descricao =
                            $"Relatório gerado com " +
                            $"{dadosAtividades.Count} atividade(s), " +
                            $"no período de " +
                            $"{request.PeriodoInicio:dd/MM/yyyy} " +
                            $"a " +
                            $"{request.PeriodoFim:dd/MM/yyyy}.",

                        Fk_Usuario_Id_Usuario =
                            verificacao.idUsuario
                    };


                _context.Relatorios.Add(
                    relatorio);


                await _context.SaveChangesAsync();


                // =================================================
                // RELACIONAR ATIVIDADES
                // =================================================

                foreach (var atividade in atividades)
                {
                    _context.Relatorios_Atividades.Add(
                        new Relatorio_Atividade
                        {
                            Fk_Atividade_Id_Atividade =
                                atividade.Id_Atividade,

                            Fk_Relatorio_Id_Relatorio =
                                relatorio.Id_Relatorio
                        });
                }


                await _context.SaveChangesAsync();


                // =================================================
                // NOME DO PDF
                // =================================================

                var nomeArquivo =
                    $"relatorio_{relatorio.Id_Relatorio}_" +
                    $"{DateTime.Now:yyyyMMddHHmmssfff}.pdf";


                var caminhoArquivo =
                    Path.Combine(
                        pastaRelatorios,
                        nomeArquivo);


                // =================================================
                // GERAR PDF
                // =================================================

                Document.Create(document =>
                {
                    document.Page(page =>
                    {
                        page.Size(PageSizes.A4);

                        page.Margin(40);

                        page.DefaultTextStyle(
                            x => x.FontSize(10));


                        // -----------------------------------------
                        // CABEÇALHO
                        // -----------------------------------------

                        page.Header()
                            .Column(column =>
                            {
                                column.Item()
                                    .Text("DOC SENAI")
                                    .FontSize(22)
                                    .Bold()
                                    .FontColor("#192E75");


                                column.Item()
                                    .PaddingTop(5)
                                    .Text(
                                        request.Titulo.Trim())
                                    .FontSize(17)
                                    .Bold()
                                    .FontColor("#192E75");


                                column.Item()
                                    .PaddingTop(5)
                                    .Text(
                                        $"Período: " +
                                        $"{request.PeriodoInicio:dd/MM/yyyy} " +
                                        $"até " +
                                        $"{request.PeriodoFim:dd/MM/yyyy}")
                                    .FontSize(10)
                                    .FontColor("#666666");


                                column.Item()
                                    .PaddingTop(12)
                                    .LineHorizontal(1)
                                    .LineColor("#D9DFEB");
                            });


                        // -----------------------------------------
                        // CONTEÚDO
                        // -----------------------------------------

                        page.Content()
                            .PaddingTop(20)
                            .Column(column =>
                            {
                                // RESUMO

                                column.Item()
                                    .Background("#F5F6FA")
                                    .Padding(15)
                                    .Column(resumo =>
                                    {
                                        resumo.Item()
                                            .Text(
                                                "Resumo do relatório")
                                            .FontSize(12)
                                            .Bold()
                                            .FontColor("#192E75");


                                        resumo.Item()
                                            .PaddingTop(6)
                                            .Text(
                                                $"Quantidade de atividades: " +
                                                $"{dadosAtividades.Count}")
                                            .FontSize(10);


                                        resumo.Item()
                                            .PaddingTop(3)
                                            .Text(
                                                $"Data de geração: " +
                                                $"{DateTime.Now:dd/MM/yyyy HH:mm}")
                                            .FontSize(10);
                                    });


                                // INFORMAÇÕES

                                column.Item()
                                    .PaddingTop(18)
                                    .Text("Informações")
                                    .FontSize(12)
                                    .Bold()
                                    .FontColor("#192E75");


                                var professores =
                                    dadosAtividades
                                        .Select(a =>
                                            a.Professor)
                                        .Distinct()
                                        .ToList();


                                var turmas =
                                    dadosAtividades
                                        .Select(a =>
                                            a.Turma)
                                        .Distinct()
                                        .ToList();


                                var cursos =
                                    dadosAtividades
                                        .Select(a =>
                                            a.Curso)
                                        .Distinct()
                                        .ToList();


                                column.Item()
                                    .PaddingTop(8)
                                    .Text(
                                        $"Professor(es): " +
                                        $"{string.Join(", ", professores)}")
                                    .FontSize(10)
                                    .FontColor("#555555");


                                column.Item()
                                    .PaddingTop(3)
                                    .Text(
                                        $"Turma(s): " +
                                        $"{string.Join(", ", turmas)}")
                                    .FontSize(10)
                                    .FontColor("#555555");


                                column.Item()
                                    .PaddingTop(3)
                                    .Text(
                                        $"Curso(s): " +
                                        $"{string.Join(", ", cursos)}")
                                    .FontSize(10)
                                    .FontColor("#555555");


                                // ATIVIDADES

                                column.Item()
                                    .PaddingTop(20)
                                    .Text("Atividades")
                                    .FontSize(13)
                                    .Bold()
                                    .FontColor("#192E75");


                                foreach (
                                    var item in dadosAtividades)
                                {
                                    column.Item()
                                        .PaddingTop(12)
                                        .Border(1)
                                        .BorderColor("#E7EAF1")
                                        .Padding(12)
                                        .Column(
                                            atividadeColumn =>
                                            {
                                                atividadeColumn.Item()
                                                    .Text(
                                                        item.Data
                                                            .ToString(
                                                                "dd/MM/yyyy"))
                                                    .FontSize(10)
                                                    .Bold()
                                                    .FontColor("#EA632C");


                                                atividadeColumn.Item()
                                                    .PaddingTop(4)
                                                    .Text(
                                                        item.Professor)
                                                    .FontSize(11)
                                                    .Bold()
                                                    .FontColor("#192E75");


                                                atividadeColumn.Item()
                                                    .PaddingTop(3)
                                                    .Text(
                                                        $"{item.Turma} • " +
                                                        $"{item.Curso}")
                                                    .FontSize(9)
                                                    .FontColor("#666666");


                                                atividadeColumn.Item()
                                                    .PaddingTop(8)
                                                    .Text(
                                                        item.Descricao)
                                                    .FontSize(10);


                                                if (
                                                    !string.IsNullOrWhiteSpace(
                                                        item.Observacao))
                                                {
                                                    atividadeColumn.Item()
                                                        .PaddingTop(6)
                                                        .Text(
                                                            $"Observação: " +
                                                            $"{item.Observacao}")
                                                        .FontSize(9)
                                                        .Italic()
                                                        .FontColor(
                                                            "#666666");
                                                }
                                            });
                                }
                            });


                        // -----------------------------------------
                        // RODAPÉ
                        // -----------------------------------------

                        page.Footer()
                            .AlignCenter()
                            .Text(text =>
                            {
                                text.Span(
                                    "DOC SENAI • Relatório de atividades • ");

                                text.CurrentPageNumber();
                            });
                    });
                })
                .GeneratePdf(caminhoArquivo);


                // =================================================
                // VERIFICAR PDF
                // =================================================

                if (!System.IO.File.Exists(
                    caminhoArquivo))
                {
                    return StatusCode(
                        500,
                        new
                        {
                            mensagem =
                                "O relatório foi criado, mas o arquivo PDF não foi encontrado."
                        });
                }


                var informacoesArquivo =
                    new FileInfo(caminhoArquivo);


                if (informacoesArquivo.Length == 0)
                {
                    return StatusCode(
                        500,
                        new
                        {
                            mensagem =
                                "O arquivo PDF foi criado vazio."
                        });
                }


                // =================================================
                // URL DO PDF
                // =================================================

                var urlPdf =
                    $"{Request.Scheme}://{Request.Host}" +
                    $"/relatorios/{nomeArquivo}";


                // =================================================
                // RESPOSTA
                // =================================================

                return Ok(
                    new
                    {
                        mensagem =
                            "Relatório gerado com sucesso.",

                        id_relatorio =
                            relatorio.Id_Relatorio,

                        titulo =
                            relatorio.Titulo_Pdf,

                        periodo_inicio =
                            request.PeriodoInicio
                                .ToString("dd/MM/yyyy"),

                        periodo_fim =
                            request.PeriodoFim
                                .ToString("dd/MM/yyyy"),

                        quantidade_atividades =
                            dadosAtividades.Count,

                        arquivo =
                            nomeArquivo,

                        url =
                            urlPdf
                    });
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    "====================================");

                Console.WriteLine(
                    "ERRO AO GERAR RELATÓRIO:");

                Console.WriteLine(
                    ex.ToString());

                Console.WriteLine(
                    "====================================");


                return StatusCode(
                    500,
                    new
                    {
                        mensagem =
                            "Ocorreu um erro ao gerar o relatório.",

                        erro =
                            ex.Message
                    });
            }
        }


        // =========================================================
        // VISUALIZAR PDF
        // =========================================================

        [HttpGet("pdf/{id:int}")]
        public async Task<IActionResult> VisualizarPdf(
            int id)
        {
            var verificacao =
                await VerificarSupervisao();

            if (!verificacao.autorizado)
            {
                return Unauthorized(new
                {
                    mensagem =
                        "Usuário não está autorizado."
                });
            }


            // -----------------------------------------------------
            // BUSCAR RELATÓRIO
            // -----------------------------------------------------

            var relatorio =
                await _context.Relatorios
                    .FirstOrDefaultAsync(r =>
                        r.Id_Relatorio == id);


            if (relatorio == null)
            {
                return NotFound(new
                {
                    mensagem =
                        "Relatório não encontrado."
                });
            }


            // -----------------------------------------------------
            // PASTA DOS RELATÓRIOS
            // -----------------------------------------------------

            var pastaRelatorios =
                Path.Combine(
                    _environment.WebRootPath,
                    "relatorios");


            if (!Directory.Exists(
                pastaRelatorios))
            {
                return NotFound(new
                {
                    mensagem =
                        "Pasta de relatórios não encontrada."
                });
            }


            // -----------------------------------------------------
            // PROCURAR PDF
            // -----------------------------------------------------

            var arquivos =
                Directory.GetFiles(
                    pastaRelatorios,
                    $"relatorio_{id}_*.pdf");


            if (arquivos.Length == 0)
            {
                return NotFound(new
                {
                    mensagem =
                        "Arquivo PDF não encontrado."
                });
            }


            // -----------------------------------------------------
            // PEGAR PDF MAIS RECENTE
            // -----------------------------------------------------

            var caminhoArquivo =
                arquivos
                    .OrderByDescending(
                        arquivo =>
                            System.IO.File.GetCreationTime(
                                arquivo))
                    .First();


            // -----------------------------------------------------
            // LER PDF
            // -----------------------------------------------------

            var arquivo =
                await System.IO.File.ReadAllBytesAsync(
                    caminhoArquivo);


            // -----------------------------------------------------
            // RETORNAR PDF
            // -----------------------------------------------------

            return File(
                arquivo,
                "application/pdf");
        }
    }


    // =============================================================
    // DTO DO RELATÓRIO
    // =============================================================

    public class RelatorioAtividadeDto
    {
        public int Id { get; set; }

        public DateTime Data { get; set; }

        public string Descricao { get; set; } =
            string.Empty;

        public string? Observacao { get; set; }

        public string Professor { get; set; } =
            string.Empty;

        public string Turma { get; set; } =
            string.Empty;

        public string Curso { get; set; } =
            string.Empty;
    }


    // =============================================================
    // REQUEST PARA GERAR RELATÓRIO
    // =============================================================

    public class GerarRelatorioRequest
    {
        public string Titulo { get; set; } =
            string.Empty;

        public int? Professor { get; set; }

        public int? Turma { get; set; }

        public string? Curso { get; set; }

        public DateTime PeriodoInicio { get; set; }

        public DateTime PeriodoFim { get; set; }

        public List<int> Atividades { get; set; } =
            new List<int>();
    }
}