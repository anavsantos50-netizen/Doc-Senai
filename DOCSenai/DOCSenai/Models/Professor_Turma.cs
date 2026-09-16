namespace DOCSenai.Models
{
    public class Professor_Turma
    {
public int Id_Professor_Turma {  get; set; }
        public int Fk_Professor_Id_Usuario { get; set; }
        public int Fk_Turma_Id_Turma { get; set; }
        public Usuario Professor { get; set; }

        public Turma Turma { get; set; }
    }
}
