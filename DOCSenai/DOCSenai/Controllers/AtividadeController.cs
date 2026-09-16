using DOCSenai.Data;
using DOCSenai.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        // LISTAR TURMAS DO PROFESSOR LOGADO
        // =========================================================

        [HttpGet("turmas")]
        public async Task<IActionResult> ListarTurmasDoProfessor()
        {
            var idLogado = HttpContext.Session.GetString("IdLogado");

            if (string.IsNullOrEmpty(idLogado))
            {
                return Unauthorized(new
                {
                    mensagem = "Sua sessão expirou. Faça login novamente."
                });
            }

            int idProfessor = int.Parse(idLogado);

            var turmas = await _context.Professor_Turmas
                .Where(pt => pt.Fk_Professor_Id_Usuario == idProfessor)
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
        // REGISTRAR ATIVIDADE
        // =========================================================

        [HttpPost("registrar")]
        public async Task<IActionResult> RegistrarAtividade(
            [FromForm] AtividadeRequest request)
        {
            // -----------------------------------------------------
            // VERIFICA LOGIN
            // -----------------------------------------------------

            var idLogado = HttpContext.Session.GetString("IdLogado");

            if (string.IsNullOrEmpty(idLogado))
            {
                return Unauthorized(new
                {
                    mensagem = "Sua sessão expirou. Faça login novamente."
                });
            }

            int idProfessor = int.Parse(idLogado);


            // -----------------------------------------------------
            // VALIDA TURMA
            // -----------------------------------------------------

            if (request.Fk_Turma_Id_Turma <= 0)
            {
                return BadRequest(new
                {
                    mensagem = "Selecione uma turma."
                });
            }


            // -----------------------------------------------------
            // VALIDA DATA
            // -----------------------------------------------------

            if (request.Data_Atividade == default)
            {
                return BadRequest(new
                {
                    mensagem = "Informe a data da atividade."
                });
            }


            // -----------------------------------------------------
            // VALIDA DESCRIÇÃO
            // -----------------------------------------------------

            if (string.IsNullOrWhiteSpace(request.Descricao_Atividade))
            {
                return BadRequest(new
                {
                    mensagem = "Informe a descrição da atividade."
                });
            }

            if (request.Descricao_Atividade.Trim().Length < 10)
            {
                return BadRequest(new
                {
                    mensagem =
                        "A descrição deve possuir pelo menos 10 caracteres."
                });
            }


            // -----------------------------------------------------
            // VERIFICA SE PROFESSOR PERTENCE À TURMA
            // -----------------------------------------------------

            var professorTemTurma =
                await _context.Professor_Turmas
                    .AnyAsync(pt =>
                        pt.Fk_Professor_Id_Usuario == idProfessor &&
                        pt.Fk_Turma_Id_Turma ==
                        request.Fk_Turma_Id_Turma);

            if (!professorTemTurma)
            {
                return BadRequest(new
                {
                    mensagem = "Você não possui acesso a esta turma."
                });
            }


            // -----------------------------------------------------
            // VALIDA FOTOS
            // -----------------------------------------------------

            if (request.Fotos == null ||
                request.Fotos.Count == 0)
            {
                return BadRequest(new
                {
                    mensagem =
                        "Adicione pelo menos uma fotografia."
                });
            }


            const long tamanhoMaximo =
                10 * 1024 * 1024;

            var extensoesPermitidas =
                new[]
                {
                    ".jpg",
                    ".jpeg",
                    ".png"
                };


            foreach (var foto in request.Fotos)
            {
                if (foto == null || foto.Length == 0)
                {
                    return BadRequest(new
                    {
                        mensagem =
                            "Uma das fotografias está vazia."
                    });
                }

                if (foto.Length > tamanhoMaximo)
                {
                    return BadRequest(new
                    {
                        mensagem =
                            $"A fotografia '{foto.FileName}' " +
                            "ultrapassa o limite de 10 MB."
                    });
                }

                var extensao =
                    Path.GetExtension(foto.FileName)
                        .ToLowerInvariant();

                if (!extensoesPermitidas.Contains(extensao))
                {
                    return BadRequest(new
                    {
                        mensagem =
                            $"A fotografia '{foto.FileName}' " +
                            "possui um formato inválido."
                    });
                }
            }


            // -----------------------------------------------------
            // CRIA PASTA UPLOADS
            // -----------------------------------------------------

            var pastaUploads =
                Path.Combine(
                    _environment.ContentRootPath,
                    "wwwroot",
                    "uploads"
                );

            if (!Directory.Exists(pastaUploads))
            {
                Directory.CreateDirectory(pastaUploads);
            }


            // -----------------------------------------------------
            // CRIA ATIVIDADE
            // -----------------------------------------------------

            var atividade = new Atividade
            {
                Descricao_Atividade =
                    request.Descricao_Atividade.Trim(),

                Observacao =
                    string.IsNullOrWhiteSpace(request.Observacao)
                        ? ""
                        : request.Observacao.Trim(),

                Data_Atividade =
                    request.Data_Atividade,

                Fk_Usuario_Id_Usuario =
                    idProfessor,

                Fk_Turma_Id_Turma =
                    request.Fk_Turma_Id_Turma
            };

            _context.Atividades.Add(atividade);

            await _context.SaveChangesAsync();


            // -----------------------------------------------------
            // SALVA FOTOS
            // -----------------------------------------------------

            foreach (var foto in request.Fotos)
            {
                var extensao =
                    Path.GetExtension(foto.FileName)
                        .ToLowerInvariant();

                var nomeArquivo =
                    $"{Guid.NewGuid()}{extensao}";

                var caminhoArquivo =
                    Path.Combine(
                        pastaUploads,
                        nomeArquivo
                    );


                using (var stream =
                    new FileStream(
                        caminhoArquivo,
                        FileMode.Create))
                {
                    await foto.CopyToAsync(stream);
                }


                var registroFoto = new Foto
                {
                    Nome_Arquivo = nomeArquivo,

                    Data_Envio = DateTime.Now,

                    Fk_Atividade_Id_Atividade =
                        atividade.Id_Atividade
                };

                _context.Fotos.Add(registroFoto);
            }


            await _context.SaveChangesAsync();


            // -----------------------------------------------------
            // RESPOSTA
            // -----------------------------------------------------

            return Ok(new
            {
                mensagem =
                    "Atividade registrada com sucesso.",

                id_atividade =
                    atividade.Id_Atividade
            });
        }
    }


    // =============================================================
    // REQUEST
    // =============================================================

    public class AtividadeRequest
    {
        public int Fk_Turma_Id_Turma { get; set; }

        public DateTime Data_Atividade { get; set; }

        public string Descricao_Atividade { get; set; }

        public string Observacao { get; set; }

        public List<IFormFile> Fotos { get; set; }
    }
}