using System.ComponentModel.DataAnnotations;

namespace DOCSenai.Models
{
    public class Foto
    {
        [Key]
        public int Id_Foto { get; set; }
        public string Nome_Arquivo { get; set; }
        public DateTime Data_Envio { get; set; }
        public int Fk_Atividade_Id_Atividade { get; set; }
    }
}
