using System.ComponentModel.DataAnnotations;

namespace DOCSenai.Models
{
    public class Usuario
    {
        [Key]
        public int Id_Usuario { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public string Cargo { get; set; }
    }
}
