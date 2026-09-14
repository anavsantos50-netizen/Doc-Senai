using System.ComponentModel.DataAnnotations;

namespace DOCSenai.Models
{
    public class Relatorio
    {
        [Key]
        public int Id_Relatorio { get; set; }
        public string Titulo_Pdf { get; set; }
        public DateTime Periodo_Fim {  get; set; }
        public DateTime Data_Criacao { get; set; }
        public string Descricao {  get; set; }
        public int Fk_Usuario_Id_Usuario { get; set; }


    }
}
