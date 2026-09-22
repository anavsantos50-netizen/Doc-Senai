using DOCSenai.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DOCSenai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupervisaoController : ControllerBase
    {
        private readonly DOCSenaiContext _context;

        public SupervisaoController(DOCSenaiContext context)
        {
            _context = context;
        }

        // =========================================================
        // VERIFICAR USUÁRIO LOGADO
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


        [HttpGet("dashboard")]
        public async Task<IActionResult> Dashboard()
        {
            var verificacao = await VerificarSupervisao();

            if (!verificacao.autorizado)
            {
                return Unauthorized(new
                {
                    mensagem = "Usuário não está autorizado."
                });
            }


            // ======================================================
            // USUÁRIO LOGADO
            // ======================================================

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u =>
                    u.Id_Usuario == verificacao.idUsuario);

            if (usuario == null)
            {
                return NotFound(new
                {
                    mensagem = "Usuário não encontrado."
                });
            }


            // ======================================================
            // TOTAIS
            // ======================================================

            var totalAtividades =
                await _context.Atividades.CountAsync();

            var totalTurmas =
                await _context.Turmas.CountAsync();

            var totalProfessores =
                await _context.Usuarios.CountAsync(u =>
                    u.Cargo == "Professor" ||
                    u.Cargo == "Professora");

            var totalRelatorios =
                await _context.Relatorios.CountAsync();


            // ======================================================
            // ÚLTIMOS 30 DIAS
            // ======================================================

            var hoje = DateTime.Today;

            var dataInicio =
                hoje.AddDays(-29);

            var dataFim =
                hoje.AddDays(1);


            // ======================================================
            // ATIVIDADES DOS ÚLTIMOS 30 DIAS
            // ======================================================

            var atividadesUltimos30Dias =
                await _context.Atividades
                    .Where(a =>
                        a.Data_Atividade >= dataInicio &&
                        a.Data_Atividade < dataFim)
                    .Select(a => new
                    {
                        a.Id_Atividade,
                        a.Data_Atividade
                    })
                    .ToListAsync();


            // ======================================================
            // DADOS DO GRÁFICO
            // ======================================================

            // ======================================================
            // DADOS DO GRÁFICO - POR SEMANA
            // ======================================================

            var grafico = new List<object>();


            // ------------------------------------------------------
            // DIVIDIR OS ÚLTIMOS 30 DIAS EM PERÍODOS DE 7 DIAS
            // ------------------------------------------------------

            var inicioPeriodo = dataInicio;

            while (inicioPeriodo <= hoje)
            {
                var fimPeriodo =
                    inicioPeriodo.AddDays(6);


                // Não ultrapassar o dia atual
                if (fimPeriodo > hoje)
                {
                    fimPeriodo = hoje;
                }


                var quantidade =
                    atividadesUltimos30Dias.Count(a =>
                        a.Data_Atividade.Date >= inicioPeriodo.Date &&
                        a.Data_Atividade.Date <= fimPeriodo.Date
                    );


                grafico.Add(new
                {
                    inicio = inicioPeriodo.ToString("dd/MM"),

                    fim = fimPeriodo.ToString("dd/MM"),

                    periodo =
                        inicioPeriodo.Date == fimPeriodo.Date
                            ? inicioPeriodo.ToString("dd/MM")
                            : $"{inicioPeriodo:dd/MM} - {fimPeriodo:dd/MM}",

                    quantidade = quantidade
                });


                inicioPeriodo =
                    fimPeriodo.AddDays(1);
            }


            // ======================================================
            // ATIVIDADES RECENTES
            // ======================================================

            var atividadesRecentes =
                await (
                    from atividade in _context.Atividades

                    join professor in _context.Usuarios
                        on atividade.Fk_Usuario_Id_Usuario
                        equals professor.Id_Usuario

                    join turma in _context.Turmas
                        on atividade.Fk_Turma_Id_Turma
                        equals turma.Id_Turma

                    orderby atividade.Data_Atividade descending

                    select new
                    {
                        id = atividade.Id_Atividade,

                        data = atividade.Data_Atividade
                            .ToString("dd/MM/yyyy"),

                        dia = atividade.Data_Atividade.Day,

                        mes = atividade.Data_Atividade
                            .ToString("MMM")
                            .ToUpper(),

                        professor = professor.Nome,

                        turma = turma.Nome_Turma,

                        curso = turma.Curso,

                        descricao =
                            atividade.Descricao_Atividade
                    }
                )
                .Take(5)
                .ToListAsync();


            // ======================================================
            // RETORNO
            // ======================================================

            return Ok(new
            {
                nome = usuario.Nome,

                totalAtividades = totalAtividades,

                totalTurmas = totalTurmas,

                totalProfessores = totalProfessores,

                totalRelatorios = totalRelatorios,

                grafico = grafico,

                atividadesRecentes = atividadesRecentes
            });
        }

        // =========================================================
        // PROFESSORES PARA O FILTRO
        // =========================================================

        [HttpGet("professores")]
        public async Task<IActionResult> ListarProfessores()
        {
            var verificacao = await VerificarSupervisao();

            if (!verificacao.autorizado)
            {
                return Unauthorized(new
                {
                    mensagem = "Usuário não está autorizado."
                });
            }

            var professores = await _context.Usuarios
                .Where(u =>
                    u.Cargo == "Professor" ||
                    u.Cargo == "Professora")
                .OrderBy(u => u.Nome)
                .Select(u => new
                {
                    id = u.Id_Usuario,
                    nome = u.Nome
                })
                .ToListAsync();

            return Ok(professores);
        }


        // =========================================================
        // TURMAS PARA O FILTRO
        // =========================================================

        [HttpGet("turmas")]
        public async Task<IActionResult> ListarTurmas()
        {
            var verificacao = await VerificarSupervisao();

            if (!verificacao.autorizado)
            {
                return Unauthorized(new
                {
                    mensagem = "Usuário não está autorizado."
                });
            }

            var turmas = await _context.Turmas
                .OrderBy(t => t.Nome_Turma)
                .Select(t => new
                {
                    id = t.Id_Turma,
                    nome = t.Nome_Turma,
                    curso = t.Curso,
                    periodo = t.Periodo,
                    turno = t.Turno
                })
                .ToListAsync();

            return Ok(turmas);
        }


        // =========================================================
        // CURSOS PARA O FILTRO
        // =========================================================

        [HttpGet("cursos")]
        public async Task<IActionResult> ListarCursos()
        {
            var verificacao = await VerificarSupervisao();

            if (!verificacao.autorizado)
            {
                return Unauthorized(new
                {
                    mensagem = "Usuário não está autorizado."
                });
            }

            var cursos = await _context.Turmas
                .Select(t => t.Curso)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(cursos);
        }


        // =========================================================
        // PESQUISAR REGISTROS
        // =========================================================

        [HttpGet("registros")]
        public async Task<IActionResult> PesquisarRegistros(
            [FromQuery] int? professor,
            [FromQuery] int? turma,
            [FromQuery] string? curso,
            [FromQuery] DateTime? dataInicial,
            [FromQuery] DateTime? dataFinal)
        {
            var verificacao = await VerificarSupervisao();

            if (!verificacao.autorizado)
            {
                return Unauthorized(new
                {
                    mensagem = "Usuário não está autorizado."
                });
            }

            var query =
                from atividade in _context.Atividades

                join usuario in _context.Usuarios
                    on atividade.Fk_Usuario_Id_Usuario
                    equals usuario.Id_Usuario

                join turmaDb in _context.Turmas
                    on atividade.Fk_Turma_Id_Turma
                    equals turmaDb.Id_Turma

                select new
                {
                    atividade,
                    usuario,
                    turma = turmaDb
                };


            // =====================================================
            // FILTRO PROFESSOR
            // =====================================================

            if (professor.HasValue)
            {
                query = query.Where(x =>
                    x.atividade.Fk_Usuario_Id_Usuario ==
                    professor.Value);
            }


            // =====================================================
            // FILTRO TURMA
            // =====================================================

            if (turma.HasValue)
            {
                query = query.Where(x =>
                    x.atividade.Fk_Turma_Id_Turma ==
                    turma.Value);
            }


            // =====================================================
            // FILTRO CURSO
            // =====================================================

            if (!string.IsNullOrWhiteSpace(curso))
            {
                query = query.Where(x =>
                    x.turma.Curso == curso);
            }


            // =====================================================
            // DATA INICIAL
            // =====================================================

            if (dataInicial.HasValue)
            {
                var inicio = dataInicial.Value.Date;

                query = query.Where(x =>
                    x.atividade.Data_Atividade >= inicio);
            }


            // =====================================================
            // DATA FINAL
            // =====================================================

            if (dataFinal.HasValue)
            {
                var fim = dataFinal.Value.Date.AddDays(1);

                query = query.Where(x =>
                    x.atividade.Data_Atividade < fim);
            }


            var registros = await query
                .OrderByDescending(x =>
                    x.atividade.Data_Atividade)
                .Select(x => new
                {
                    id = x.atividade.Id_Atividade,

                    descricao =
                        x.atividade.Descricao_Atividade,

                    observacao =
                        x.atividade.Observacao,

                    data =
                        x.atividade.Data_Atividade
                            .ToString("dd/MM/yyyy"),

                    professor = new
                    {
                        id = x.usuario.Id_Usuario,
                        nome = x.usuario.Nome
                    },

                    turma = new
                    {
                        id = x.turma.Id_Turma,
                        nome = x.turma.Nome_Turma,
                        curso = x.turma.Curso,
                        periodo = x.turma.Periodo,
                        turno = x.turma.Turno
                    },

                    fotos = _context.Fotos
                        .Where(f =>
                            f.Fk_Atividade_Id_Atividade ==
                            x.atividade.Id_Atividade)
                        .Select(f => new
                        {
                            id = f.Id_Foto,
                            nome_arquivo = f.Nome_Arquivo,
                            url = "/uploads/" +
                                  f.Nome_Arquivo
                        })
                        .ToList()
                })
                .ToListAsync();


            return Ok(registros);
        }
    }
}