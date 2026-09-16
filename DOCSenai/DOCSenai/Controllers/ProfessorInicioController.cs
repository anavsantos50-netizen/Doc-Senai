using DOCSenai.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DOCSenai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfessorInicioController : ControllerBase
    {
        private readonly DOCSenaiContext _context;

        public ProfessorInicioController(DOCSenaiContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> BuscarInicio()
        {
            // Pega o ID do usuário que fez login
            var idLogadoString = HttpContext.Session.GetString("IdLogado");

            // Verifica se existe usuário logado
            if (string.IsNullOrEmpty(idLogadoString))
            {
                return Unauthorized(new
                {
                    mensagem = "Usuário não está logado."
                });
            }

            // Converte o ID para inteiro
            if (!int.TryParse(idLogadoString, out int idProfessor))
            {
                return Unauthorized(new
                {
                    mensagem = "ID do usuário inválido."
                });
            }

            // Busca o professor
            var professor = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Id_Usuario == idProfessor);

            if (professor == null)
            {
                return NotFound(new
                {
                    mensagem = "Professor não encontrado."
                });
            }

            // Verifica se realmente é professor
            if (professor.Cargo.Trim() != "Professor" &&
                professor.Cargo.Trim() != "Professora")
            {
                return Forbid();
            }

            // Data atual
            var hoje = DateTime.Now;

            var inicioMes = new DateTime(
                hoje.Year,
                hoje.Month,
                1
            );

            var inicioProximoMes = inicioMes.AddMonths(1);

            // =====================================================
            // TURMAS DO PROFESSOR
            // =====================================================

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

            // =====================================================
            // ATIVIDADES DO PROFESSOR NO MÊS
            // =====================================================

            var atividadesMes = await _context.Atividades
                .Where(a =>
                    a.Fk_Usuario_Id_Usuario == idProfessor &&
                    a.Data_Atividade >= inicioMes &&
                    a.Data_Atividade < inicioProximoMes)
                .ToListAsync();

            // =====================================================
            // QUANTIDADE DE FOTOS/EVIDÊNCIAS
            // =====================================================

            var idsAtividadesMes = atividadesMes
                .Select(a => a.Id_Atividade)
                .ToList();

            var totalEvidenciasMes = await _context.Fotos
                .Where(f =>
                    idsAtividadesMes.Contains(
                        f.Fk_Atividade_Id_Atividade))
                .CountAsync();

            // =====================================================
            // ATIVIDADES RECENTES
            // =====================================================

            var atividadesRecentes = await _context.Atividades
                .Where(a =>
                    a.Fk_Usuario_Id_Usuario == idProfessor)
                .OrderByDescending(a => a.Data_Atividade)
                .Take(3)
                .Select(a => new
                {
                    id_atividade = a.Id_Atividade,
                    descricao = a.Descricao_Atividade,
                    observacao = a.Observacao,
                    data = a.Data_Atividade,
                    id_turma = a.Fk_Turma_Id_Turma
                })
                .ToListAsync();

            // =====================================================
            // ADICIONA INFORMAÇÕES DA TURMA E FOTOS
            // =====================================================

            var atividadesCompletas = new List<object>();

            foreach (var atividade in atividadesRecentes)
            {
                var turma = await _context.Turmas
                    .FirstOrDefaultAsync(t =>
                        t.Id_Turma == atividade.id_turma);

                var quantidadeFotos = await _context.Fotos
                    .CountAsync(f =>
                        f.Fk_Atividade_Id_Atividade ==
                        atividade.id_atividade);

                atividadesCompletas.Add(new
                {
                    id_atividade = atividade.id_atividade,
                    descricao = atividade.descricao,
                    observacao = atividade.observacao,
                    data = atividade.data,
                    turma = turma == null
                        ? null
                        : turma.Nome_Turma,
                    curso = turma == null
                        ? null
                        : turma.Curso,
                    quantidade_fotos = quantidadeFotos
                });
            }

            // =====================================================
            // RESPOSTA FINAL
            // =====================================================

            return Ok(new
            {
                id_usuario = professor.Id_Usuario,
                nome = professor.Nome,
                email = professor.Email,

                total_atividades_mes = atividadesMes.Count,

                total_evidencias_mes = totalEvidenciasMes,

                total_turmas = turmas.Count,

                turmas = turmas,

                atividades_recentes = atividadesCompletas
            });
        }
    }
}