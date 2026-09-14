using DOCSenai.Models;
using Microsoft.EntityFrameworkCore;

namespace DOCSenai.Data
{
    public class DOCSenaiContext : DbContext
    {
        public DOCSenaiContext(DbContextOptions<DOCSenaiContext> options) : base(options) { }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Turma> Turmas { get; set; }
        public DbSet<Relatorio_Atividade> Relatorios_Atividades { get; set; }
        public DbSet<Relatorio> Relatorios { get; set; }
        public DbSet<Foto> Fotos { get; set; }
        public DbSet<Atividade> Atividades { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Relatorio_Atividade>()
                .HasKey(ra => new
                {
                    ra.Fk_Atividade_Id_Atividade,
                    ra.Fk_Relatorio_Id_Relatorio
                });


        }
    }
}

