using System.ComponentModel.DataAnnotations;

namespace FinderAPI.Entidades
{
    public class Produto
    {
        public int Id { get; set; }
        [Required]
        public string Nome { get; set; }
        [Required]
        public string Categoria { get; set; }
        [Required]
        public bool Promocao { get; set; }
        [Required]
        public float Valor { get; set; }
        public float Valor_Promocional { get; set; }
        [Required]
        public string Link {get; set;}
    }
}
