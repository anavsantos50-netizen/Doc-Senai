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
        public DbSet<Professor_Turma> Professor_Turmas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Relatorio_Atividade>()
                .HasKey(ra => new
                {
                    ra.Fk_Atividade_Id_Atividade,
                    ra.Fk_Relatorio_Id_Relatorio
                });

            modelBuilder.Entity<Atividade>()
                .Property(a => a.Observacao)
                .IsRequired(false);

            modelBuilder.Entity<Professor_Turma>()
                .ToTable("Professor_Turma");

            modelBuilder.Entity<Professor_Turma>()
                .HasKey(pt => pt.Id_Professor_Turma);

            modelBuilder.Entity<Professor_Turma>()
                .HasOne(pt => pt.Professor)
                .WithMany()
                .HasForeignKey(pt => pt.Fk_Professor_Id_Usuario)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Professor_Turma>()
                .HasOne(pt => pt.Turma)
                .WithMany()
                .HasForeignKey(pt => pt.Fk_Turma_Id_Turma)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Professor_Turma>()
                .HasIndex(pt => new
                {
                    pt.Fk_Professor_Id_Usuario,
                    pt.Fk_Turma_Id_Turma
                })
                .IsUnique();
        }
    }
}