using System.ComponentModel.DataAnnotations;

namespace DOCSenai.Models
{
    public class Atividade
    {
        [Key]
        public int Id_Atividade { get; set; }
        public string Descricao_Atividade { get; set; }
        public string Observacao { get; set; }
        public DateTime Data_Atividade { get; set; }
        public int Fk_Usuario_Id_Usuario { get; set; }
        public int Fk_Turma_Id_Turma { get; set; }
    }
}
