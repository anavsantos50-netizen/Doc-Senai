using DOCSenai.Data;
using DOCSenai.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DOCSenai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfessorTurmaController : ControllerBase
    {
        private readonly DOCSenaiContext _context;

        public ProfessorTurmaController(DOCSenaiContext context)
        {
            _context = context;
        }


        // =====================================================
        // LISTAR PROFESSORES
        // =====================================================

        [HttpGet("professores")]
        public async Task<IActionResult> ListarProfessores()
        {
            var professores = await _context.Usuarios
                .Where(u => u.Cargo == "Professor" || u.Cargo == "Professora")
                .Select(u => new
                {
                    id_usuario = u.Id_Usuario,
                    nome = u.Nome,
                    email = u.Email
                })
                .ToListAsync();

            return Ok(professores);
        }


        // =====================================================
        // LISTAR TURMAS
        // =====================================================

        [HttpGet("turmas")]
        public async Task<IActionResult> ListarTurmas()
        {
            var turmas = await _context.Turmas
                .Select(t => new
                {
                    id_turma = t.Id_Turma,
                    nome_turma = t.Nome_Turma,
                    curso = t.Curso,
                    periodo = t.Periodo,
                    turno = t.Turno
                })
                .ToListAsync();

            return Ok(turmas);
        }


        // =====================================================
        // CADASTRAR VÍNCULO PROFESSOR x TURMA
        // =====================================================

        [HttpPost]
        public async Task<IActionResult> CadastrarVinculo(
            [FromBody] ProfessorTurmaRequest request)
        {
            if (request == null)
            {
                return BadRequest(new
                {
                    mensagem = "Dados inválidos."
                });
            }


            // Verifica se o professor existe

            var professor = await _context.Usuarios
                .FirstOrDefaultAsync(u =>
                    u.Id_Usuario == request.Fk_Professor_Id_Usuario &&
                    (u.Cargo == "Professor" || u.Cargo == "Professora"));

            if (professor == null)
            {
                return NotFound(new
                {
                    mensagem = "Professor não encontrado."
                });
            }


            // Verifica se a turma existe

            var turma = await _context.Turmas
                .FirstOrDefaultAsync(t =>
                    t.Id_Turma == request.Fk_Turma_Id_Turma);

            if (turma == null)
            {
                return NotFound(new
                {
                    mensagem = "Turma não encontrada."
                });
            }


            // Verifica se o vínculo já existe

            var vinculoExistente = await _context.Professor_Turmas
                .AnyAsync(pt =>
                    pt.Fk_Professor_Id_Usuario == request.Fk_Professor_Id_Usuario &&
                    pt.Fk_Turma_Id_Turma == request.Fk_Turma_Id_Turma);

            if (vinculoExistente)
            {
                return Conflict(new
                {
                    mensagem = "Este professor já está vinculado a esta turma."
                });
            }


            // Cria o vínculo

            var professorTurma = new Professor_Turma
            {
                Fk_Professor_Id_Usuario = request.Fk_Professor_Id_Usuario,
                Fk_Turma_Id_Turma = request.Fk_Turma_Id_Turma
            };


            _context.Professor_Turmas.Add(professorTurma);

            await _context.SaveChangesAsync();


            return Ok(new
            {
                mensagem = "Turma cadastrada para o professor com sucesso.",
                id_professor_turma = professorTurma.Id_Professor_Turma
            });
        }


        // =====================================================
        // LISTAR TURMAS DE UM PROFESSOR
        // =====================================================

        [HttpGet("professor/{id}")]
        public async Task<IActionResult> ListarTurmasProfessor(int id)
        {
            var turmas = await _context.Professor_Turmas
                .Where(pt => pt.Fk_Professor_Id_Usuario == id)
                .Include(pt => pt.Turma)
                .Select(pt => new
                {
                    id_professor_turma = pt.Id_Professor_Turma,

                    id_turma = pt.Turma.Id_Turma,

                    nome_turma = pt.Turma.Nome_Turma,

                    curso = pt.Turma.Curso,

                    periodo = pt.Turma.Periodo,

                    turno = pt.Turma.Turno
                })
                .ToListAsync();

            return Ok(turmas);
        }


        // =====================================================
        // EXCLUIR VÍNCULO
        // =====================================================

        [HttpDelete("{id}")]
        public async Task<IActionResult> ExcluirVinculo(int id)
        {
            var vinculo = await _context.Professor_Turmas
                .FirstOrDefaultAsync(pt =>
                    pt.Id_Professor_Turma == id);

            if (vinculo == null)
            {
                return NotFound(new
                {
                    mensagem = "Vínculo não encontrado."
                });
            }


            _context.Professor_Turmas.Remove(vinculo);

            await _context.SaveChangesAsync();


            return Ok(new
            {
                mensagem = "Vínculo removido com sucesso."
            });
        }
    }


    // =========================================================
    // MODELO PARA RECEBER O POST
    // =========================================================

    public class ProfessorTurmaRequest
    {
        public int Fk_Professor_Id_Usuario { get; set; }

        public int Fk_Turma_Id_Turma { get; set; }
    }
}