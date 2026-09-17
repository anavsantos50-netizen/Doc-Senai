using DOCSenai.Data;
using DOCSenai.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace DOCSenai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AtividadeController : ControllerBase
    {
        private readonly DOCSenaiContext _context;
        private readonly IWebHostEnvironment _environment;

        public AtividadeController(
            DOCSenaiContext context,
            IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }


        // =========================================================
        // GET - TURMAS DO PROFESSOR
        // =========================================================

        [HttpGet("turmas")]
        public async Task<IActionResult> ListarTurmas()
        {
            var idLogado =
                HttpContext.Session.GetString("IdLogado");

            if (string.IsNullOrEmpty(idLogado))
            {
                return Unauthorized(new
                {
                    mensagem = "Sua sessão expirou."
                });
            }

            if (!int.TryParse(idLogado, out int idProfessor))
            {
                return Unauthorized(new
                {
                    mensagem = "Sessão inválida."
                });
            }

            var turmas = await _context.Professor_Turmas
                .Where(pt =>
                    pt.Fk_Professor_Id_Usuario == idProfessor)
                .Include(pt => pt.Turma)
                .Select(pt => new
                {
                    id_turma = pt.Turma.Id_Turma,
                    nome_turma = pt.Turma.Nome_Turma,
                    curso = pt.Turma.Curso,
                    periodo = pt.Turma.Periodo,
                    turno = pt.Turma.Turno
                })
                .ToListAsync();

            return Ok(turmas);
        }


        // =========================================================
        // GET - MINHAS ATIVIDADES
        // =========================================================

        [HttpGet("minhas")]
        public async Task<IActionResult> MinhasAtividades()
        {
            try
            {
                var idLogado =
                    HttpContext.Session.GetString("IdLogado");

                if (string.IsNullOrEmpty(idLogado))
                {
                    return Unauthorized(new
                    {
                        mensagem =
                            "Sua sessão expirou. Faça login novamente."
                    });
                }

                if (!int.TryParse(
                    idLogado,
                    out int idProfessor))
                {
                    return Unauthorized(new
                    {
                        mensagem = "Sessão inválida."
                    });
                }

                var atividades =
                    await _context.Atividades
                        .Where(a =>
                            a.Fk_Usuario_Id_Usuario ==
                            idProfessor)
                        .OrderByDescending(
                            a => a.Data_Atividade)
                        .ToListAsync();


                var resultado = new List<object>();


                foreach (var atividade in atividades)
                {
                    var turma =
                        await _context.Turmas
                            .FirstOrDefaultAsync(t =>
                                t.Id_Turma ==
                                atividade.Fk_Turma_Id_Turma);


                    var fotos =
                        await _context.Fotos
                            .Where(f =>
                                f.Fk_Atividade_Id_Atividade ==
                                atividade.Id_Atividade)
                            .Select(f => new
                            {
                                id = f.Id_Foto,
                                nome_arquivo =
                                    f.Nome_Arquivo,
                                url =
                                    "/uploads/" +
                                    f.Nome_Arquivo
                            })
                            .ToListAsync();


                    resultado.Add(new
                    {
                        id =
                            atividade.Id_Atividade,

                        descricao =
                            atividade.Descricao_Atividade,

                        observacao =
                            atividade.Observacao,

                        data =
                            atividade.Data_Atividade
                                .ToString(
                                    "dd/MM/yyyy"),

                        turma =
                            turma != null
                                ? turma.Nome_Turma
                                : "Turma não encontrada",

                        periodo =
                            turma != null
                                ? turma.Periodo
                                    .ToString(
                                        "MMMM 'de' yyyy",
                                        new CultureInfo(
                                            "pt-BR"))
                                : "—",

                        fotos = fotos
                    });
                }


                return Ok(resultado);
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    "ERRO AO LISTAR ATIVIDADES:");

                Console.WriteLine(
                    ex.Message);

                return StatusCode(
                    500,
                    new
                    {
                        mensagem =
                            "Erro ao carregar atividades.",
                        erro =
                            ex.Message
                    });
            }
        }


        // =========================================================
        // GET - MINHAS TURMAS
        // =========================================================

        [HttpGet("minhas-turmas")]
        public async Task<IActionResult> MinhasTurmas()
        {
            try
            {
                var idLogado =
                    HttpContext.Session.GetString("IdLogado");

                if (string.IsNullOrEmpty(idLogado))
                {
                    return Unauthorized(new
                    {
                        mensagem =
                            "Sua sessão expirou."
                    });
                }

                if (!int.TryParse(
                    idLogado,
                    out int idProfessor))
                {
                    return Unauthorized(new
                    {
                        mensagem =
                            "Sessão inválida."
                    });
                }


                var turmas =
                    await _context.Professor_Turmas
                        .Where(pt =>
                            pt.Fk_Professor_Id_Usuario ==
                            idProfessor)
                        .Include(pt => pt.Turma)
                        .Select(pt => new
                        {
                            id_professor_turma =
                                pt.Id_Professor_Turma,

                            id_turma =
                                pt.Turma.Id_Turma,

                            nome_turma =
                                pt.Turma.Nome_Turma,

                            curso =
                                pt.Turma.Curso,

                            periodo =
                                pt.Turma.Periodo,

                            turno =
                                pt.Turma.Turno,

                            quantidade_atividades =
                                _context.Atividades.Count(a =>
                                    a.Fk_Usuario_Id_Usuario ==
                                    idProfessor &&
                                    a.Fk_Turma_Id_Turma ==
                                    pt.Fk_Turma_Id_Turma)
                        })
                        .ToListAsync();


                return Ok(turmas);
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    "ERRO AO LISTAR TURMAS:");

                Console.WriteLine(
                    ex.Message);

                return StatusCode(
                    500,
                    new
                    {
                        mensagem =
                            "Erro ao carregar turmas.",
                        erro =
                            ex.Message
                    });
            }
        }


        // =========================================================
        // GET - BUSCAR UMA ATIVIDADE
        // =========================================================

        [HttpGet("{id:int}")]
        public async Task<IActionResult> BuscarAtividade(int id)
        {
            try
            {
                var idLogado =
                    HttpContext.Session.GetString("IdLogado");

                if (string.IsNullOrEmpty(idLogado))
                {
                    return Unauthorized(new
                    {
                        mensagem =
                            "Sua sessão expirou. Faça login novamente."
                    });
                }

                if (!int.TryParse(
                    idLogado,
                    out int idProfessor))
                {
                    return Unauthorized(new
                    {
                        mensagem =
                            "Sessão inválida."
                    });
                }


                // ---------------------------------------------
                // BUSCAR ATIVIDADE
                // ---------------------------------------------

                var atividade =
                    await _context.Atividades
                        .FirstOrDefaultAsync(a =>
                            a.Id_Atividade == id &&
                            a.Fk_Usuario_Id_Usuario ==
                            idProfessor);


                if (atividade == null)
                {
                    return NotFound(new
                    {
                        mensagem =
                            "Atividade não encontrada."
                    });
                }


                // ---------------------------------------------
                // BUSCAR TURMA
                // ---------------------------------------------

                var turma =
                    await _context.Turmas
                        .FirstOrDefaultAsync(t =>
                            t.Id_Turma ==
                            atividade.Fk_Turma_Id_Turma);


                // ---------------------------------------------
                // BUSCAR FOTOS
                // ---------------------------------------------

                var fotos =
                    await _context.Fotos
                        .Where(f =>
                            f.Fk_Atividade_Id_Atividade ==
                            atividade.Id_Atividade)
                        .Select(f => new
                        {
                            id = f.Id_Foto,

                            nome_arquivo =
                                f.Nome_Arquivo,

                            url =
                                "/uploads/" +
                                f.Nome_Arquivo
                        })
                        .ToListAsync();


                // ---------------------------------------------
                // RETORNO
                // ---------------------------------------------

                return Ok(new
                {
                    id =
                        atividade.Id_Atividade,

                    descricao =
                        atividade.Descricao_Atividade,

                    observacao =
                        atividade.Observacao,

                    data =
                        atividade.Data_Atividade
                            .ToString(
                                "dd/MM/yyyy"),


                    turma =
                        turma == null
                            ? null
                            : new
                            {
                                id =
                                    turma.Id_Turma,

                                nome =
                                    turma.Nome_Turma,

                                curso =
                                    turma.Curso,

                                periodo =
                                    turma.Periodo,

                                turno =
                                    turma.Turno
                            },


                    fotos =
                        fotos
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    "================================");

                Console.WriteLine(
                    "ERRO AO BUSCAR ATIVIDADE");

                Console.WriteLine(
                    ex.Message);

                Console.WriteLine(
                    "================================");

                return StatusCode(
                    500,
                    new
                    {
                        mensagem =
                            "Erro ao buscar atividade.",
                        erro =
                            ex.Message
                    });
            }
        }


        // =========================================================
        // POST - REGISTRAR ATIVIDADE
        // =========================================================

        [HttpPost("registrar")]
        public async Task<IActionResult> RegistrarAtividade(
            [FromForm] AtividadeRequest request)
        {
            try
            {
                var idLogado =
                    HttpContext.Session.GetString("IdLogado");

                if (string.IsNullOrEmpty(idLogado))
                {
                    return Unauthorized(new
                    {
                        mensagem =
                            "Sua sessão expirou. Faça login novamente."
                    });
                }

                if (!int.TryParse(
                    idLogado,
                    out int idProfessor))
                {
                    return Unauthorized(new
                    {
                        mensagem =
                            "Sessão inválida."
                    });
                }


                if (request == null)
                {
                    return BadRequest(new
                    {
                        mensagem =
                            "Dados inválidos."
                    });
                }


                if (request.Fk_Turma_Id_Turma <= 0)
                {
                    return BadRequest(new
                    {
                        mensagem =
                            "Selecione uma turma."
                    });
                }


                if (request.Data_Atividade == default)
                {
                    return BadRequest(new
                    {
                        mensagem =
                            "Informe a data da atividade."
                    });
                }


                if (string.IsNullOrWhiteSpace(
                    request.Descricao_Atividade))
                {
                    return BadRequest(new
                    {
                        mensagem =
                            "Informe a descrição da atividade."
                    });
                }


                // ---------------------------------------------
                // VERIFICAR TURMA
                // ---------------------------------------------

                var vinculo =
                    await _context.Professor_Turmas
                        .FirstOrDefaultAsync(pt =>
                            pt.Fk_Professor_Id_Usuario ==
                            idProfessor &&
                            pt.Fk_Turma_Id_Turma ==
                            request.Fk_Turma_Id_Turma);


                if (vinculo == null)
                {
                    return BadRequest(new
                    {
                        mensagem =
                            "Você não está vinculado a esta turma."
                    });
                }


                // ---------------------------------------------
                // FOTOS
                // ---------------------------------------------

                if (request.Fotos == null ||
                    request.Fotos.Count == 0)
                {
                    return BadRequest(new
                    {
                        mensagem =
                            "Adicione pelo menos uma foto."
                    });
                }


                var pastaUploads =
                    Path.Combine(
                        _environment.ContentRootPath,
                        "wwwroot",
                        "uploads");


                if (!Directory.Exists(
                    pastaUploads))
                {
                    Directory.CreateDirectory(
                        pastaUploads);
                }


                // ---------------------------------------------
                // CRIAR ATIVIDADE
                // ---------------------------------------------

                var atividade =
                    new Atividade
                    {
                        Descricao_Atividade =
                            request.Descricao_Atividade,

                        Observacao =
                            request.Observacao,

                        Data_Atividade =
                            request.Data_Atividade,

                        Fk_Usuario_Id_Usuario =
                            idProfessor,

                        Fk_Turma_Id_Turma =
                            request.Fk_Turma_Id_Turma
                    };


                _context.Atividades.Add(
                    atividade);

                await _context.SaveChangesAsync();


                // ---------------------------------------------
                // SALVAR FOTOS
                // ---------------------------------------------

                foreach (var arquivo
                    in request.Fotos)
                {
                    if (arquivo == null ||
                        arquivo.Length == 0)
                    {
                        continue;
                    }


                    if (arquivo.Length >
                        10 * 1024 * 1024)
                    {
                        continue;
                    }


                    var extensao =
                        Path.GetExtension(
                            arquivo.FileName)
                            .ToLowerInvariant();


                    var extensoesPermitidas =
                        new[]
                        {
                            ".jpg",
                            ".jpeg",
                            ".png"
                        };


                    if (!extensoesPermitidas
                        .Contains(extensao))
                    {
                        continue;
                    }


                    var nomeArquivo =
                        $"{Guid.NewGuid()}{extensao}";


                    var caminho =
                        Path.Combine(
                            pastaUploads,
                            nomeArquivo);


                    using (
                        var stream =
                            new FileStream(
                                caminho,
                                FileMode.Create))
                    {
                        await arquivo.CopyToAsync(
                            stream);
                    }


                    var foto =
                        new Foto
                        {
                            Nome_Arquivo =
                                nomeArquivo,

                            Data_Envio =
                                DateTime.Now,

                            Fk_Atividade_Id_Atividade =
                                atividade.Id_Atividade
                        };


                    _context.Fotos.Add(
                        foto);
                }


                await _context.SaveChangesAsync();


                return Ok(new
                {
                    mensagem =
                        "Atividade registrada com sucesso.",

                    id =
                        atividade.Id_Atividade
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    "ERRO AO REGISTRAR ATIVIDADE:");

                Console.WriteLine(
                    ex.Message);

                return StatusCode(
                    500,
                    new
                    {
                        mensagem =
                            "Erro ao registrar atividade.",
                        erro =
                            ex.Message
                    });
            }
        }


        // =========================================================
        // PUT - EDITAR ATIVIDADE
        // =========================================================

        [HttpPut("{id:int}")]
        public async Task<IActionResult> AtualizarAtividade(
            int id,
            [FromForm] AtividadeRequest request)
        {
            try
            {
                var idLogado =
                    HttpContext.Session.GetString("IdLogado");

                if (string.IsNullOrEmpty(idLogado))
                {
                    return Unauthorized(new
                    {
                        mensagem =
                            "Sua sessão expirou. Faça login novamente."
                    });
                }

                if (!int.TryParse(
                    idLogado,
                    out int idProfessor))
                {
                    return Unauthorized(new
                    {
                        mensagem =
                            "Sessão inválida."
                    });
                }


                var atividade =
                    await _context.Atividades
                        .FirstOrDefaultAsync(a =>
                            a.Id_Atividade == id &&
                            a.Fk_Usuario_Id_Usuario ==
                            idProfessor);


                if (atividade == null)
                {
                    return NotFound(new
                    {
                        mensagem =
                            "Atividade não encontrada."
                    });
                }


                // ---------------------------------------------
                // VERIFICAR TURMA
                // ---------------------------------------------

                var vinculo =
                    await _context.Professor_Turmas
                        .AnyAsync(pt =>
                            pt.Fk_Professor_Id_Usuario ==
                            idProfessor &&
                            pt.Fk_Turma_Id_Turma ==
                            request.Fk_Turma_Id_Turma);


                if (!vinculo)
                {
                    return BadRequest(new
                    {
                        mensagem =
                            "Você não está vinculado a esta turma."
                    });
                }


                // ---------------------------------------------
                // ATUALIZAR DADOS
                // ---------------------------------------------

                atividade.Fk_Turma_Id_Turma =
                    request.Fk_Turma_Id_Turma;

                atividade.Data_Atividade =
                    request.Data_Atividade;

                atividade.Descricao_Atividade =
                    request.Descricao_Atividade;

                atividade.Observacao =
                    request.Observacao;


                // ---------------------------------------------
                // NOVAS FOTOS
                // ---------------------------------------------

                if (request.Fotos != null &&
                    request.Fotos.Count > 0)
                {
                    var pastaUploads =
                        Path.Combine(
                            _environment.ContentRootPath,
                            "wwwroot",
                            "uploads");


                    if (!Directory.Exists(
                        pastaUploads))
                    {
                        Directory.CreateDirectory(
                            pastaUploads);
                    }


                    foreach (var arquivo
                        in request.Fotos)
                    {
                        if (arquivo == null ||
                            arquivo.Length == 0)
                        {
                            continue;
                        }


                        if (arquivo.Length >
                            10 * 1024 * 1024)
                        {
                            continue;
                        }


                        var extensao =
                            Path.GetExtension(
                                arquivo.FileName)
                                .ToLowerInvariant();


                        var extensoesPermitidas =
                            new[]
                            {
                                ".jpg",
                                ".jpeg",
                                ".png"
                            };


                        if (!extensoesPermitidas
                            .Contains(extensao))
                        {
                            continue;
                        }


                        var nomeArquivo =
                            $"{Guid.NewGuid()}{extensao}";


                        var caminho =
                            Path.Combine(
                                pastaUploads,
                                nomeArquivo);


                        using (
                            var stream =
                                new FileStream(
                                    caminho,
                                    FileMode.Create))
                        {
                            await arquivo.CopyToAsync(
                                stream);
                        }


                        var foto =
                            new Foto
                            {
                                Nome_Arquivo =
                                    nomeArquivo,

                                Data_Envio =
                                    DateTime.Now,

                                Fk_Atividade_Id_Atividade =
                                    atividade.Id_Atividade
                            };


                        _context.Fotos.Add(
                            foto);
                    }
                }


                await _context.SaveChangesAsync();


                return Ok(new
                {
                    mensagem =
                        "Atividade atualizada com sucesso."
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    "ERRO AO ATUALIZAR ATIVIDADE:");

                Console.WriteLine(
                    ex.Message);

                return StatusCode(
                    500,
                    new
                    {
                        mensagem =
                            "Erro ao atualizar atividade.",
                        erro =
                            ex.Message
                    });
            }
        }


        [HttpDelete("{id:int}")]
        public async Task<IActionResult> ExcluirAtividade(int id)
        {
            try
            {
                var idLogado = HttpContext.Session.GetString("IdLogado");

                if (string.IsNullOrEmpty(idLogado))
                {
                    return Unauthorized(new
                    {
                        mensagem = "Sua sessão expirou. Faça login novamente."
                    });
                }

                if (!int.TryParse(idLogado, out int idProfessor))
                {
                    return Unauthorized(new
                    {
                        mensagem = "Sessão inválida."
                    });
                }

                // =========================================================
                // BUSCAR A ATIVIDADE
                // =========================================================

                var atividade = await _context.Atividades
                    .FirstOrDefaultAsync(a =>
                        a.Id_Atividade == id &&
                        a.Fk_Usuario_Id_Usuario == idProfessor);

                if (atividade == null)
                {
                    return NotFound(new
                    {
                        mensagem = "Atividade não encontrada."
                    });
                }

                // =========================================================
                // VERIFICAR SE ESTÁ VINCULADA A UM RELATÓRIO
                // =========================================================

                var relacoesRelatorio = await _context.Relatorios_Atividades
                    .Where(ra =>
                        ra.Fk_Atividade_Id_Atividade ==
                        atividade.Id_Atividade)
                    .ToListAsync();

                if (relacoesRelatorio.Count > 0)
                {
                    return Conflict(new
                    {
                        mensagem =
                            "Esta atividade já está vinculada a um relatório e não pode ser excluída."
                    });
                }

                // =========================================================
                // BUSCAR AS FOTOS
                // =========================================================

                var fotos = await _context.Fotos
                    .Where(f =>
                        f.Fk_Atividade_Id_Atividade ==
                        atividade.Id_Atividade)
                    .ToListAsync();

                // Guardar os nomes antes de apagar os registros
                var nomesArquivos = fotos
                    .Select(f => f.Nome_Arquivo)
                    .ToList();

                // =========================================================
                // 1º - EXCLUIR AS FOTOS DO BANCO
                // =========================================================

                if (fotos.Count > 0)
                {
                    _context.Fotos.RemoveRange(fotos);

                    await _context.SaveChangesAsync();
                }

                // =========================================================
                // 2º - EXCLUIR A ATIVIDADE DO BANCO
                // =========================================================

                _context.Atividades.Remove(atividade);

                await _context.SaveChangesAsync();

                // =========================================================
                // 3º - EXCLUIR OS ARQUIVOS FÍSICOS
                // =========================================================

                var pastaUploads = Path.Combine(
                    _environment.ContentRootPath,
                    "wwwroot",
                    "uploads");

                foreach (var nomeArquivo in nomesArquivos)
                {
                    if (string.IsNullOrWhiteSpace(nomeArquivo))
                    {
                        continue;
                    }

                    var caminhoArquivo = Path.Combine(
                        pastaUploads,
                        nomeArquivo);

                    if (System.IO.File.Exists(caminhoArquivo))
                    {
                        try
                        {
                            System.IO.File.Delete(caminhoArquivo);
                        }
                        catch
                        {
                            // Se o arquivo físico não puder ser excluído,
                            // a atividade continua excluída do banco.
                        }
                    }
                }

                // =========================================================
                // SUCESSO
                // =========================================================

                return Ok(new
                {
                    mensagem = "Atividade excluída com sucesso."
                });
            }
            catch (DbUpdateException ex)
            {
                var erro = ex.InnerException?.Message ?? ex.Message;

                Console.WriteLine("========================================");
                Console.WriteLine("ERRO SQL AO EXCLUIR ATIVIDADE");
                Console.WriteLine(erro);
                Console.WriteLine("========================================");

                return StatusCode(500, new
                {
                    mensagem = "Não foi possível excluir a atividade.",
                    erro = erro
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("========================================");
                Console.WriteLine("ERRO AO EXCLUIR ATIVIDADE");
                Console.WriteLine(ex.Message);
                Console.WriteLine("========================================");

                return StatusCode(500, new
                {
                    mensagem = "Erro ao excluir atividade.",
                    erro = ex.Message
                });
            }
        }

        // =========================================================
        // REQUEST
        // =========================================================

        public class AtividadeRequest
        {
            public int Fk_Turma_Id_Turma { get; set; }

            public DateTime Data_Atividade { get; set; }

            public string Descricao_Atividade { get; set; } = string.Empty;

            public string? Observacao { get; set; }

            public List<IFormFile>? Fotos { get; set; }
        }
    }
}