using System.ComponentModel.DataAnnotations;

namespace FinderAPI.Entidades
{
    public class Produto
    {
        public int Id { get; set; }
        [Required]
        public string Nome { get; set; }
        [Required]
        public string Barcode { get; set; }
        [Required]
        public string Base64 { get; set; }
        [Required]
        public string Embeddings { get; set; }
    }
}
