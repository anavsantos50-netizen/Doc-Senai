using System.ComponentModel.DataAnnotations;

namespace DOCSenai.Models
{
    public class Turma
    {
        [Key]
        public int Id_Turma { get; set; }
        public string Nome_Turma { get; set; }
        public string Curso {  get; set; }
        public DateTime Periodo { get; set; }
        public string Turno { get; set; }

    }
}
