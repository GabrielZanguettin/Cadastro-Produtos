using FinderAPI.Entidades;
using FinderAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinderAPI.Controllers
{
    [Route("api")]
    [ApiController]
    public class ProdutoController : ControllerBase
    {
        private readonly ProdutoService produtoService;
        public ProdutoController(ProdutoService produtoService)
        {
            this.produtoService = produtoService;
        }
        [HttpGet("produtos/count")]
        public async Task<IActionResult> GetCountProdutos()
        {
            var total = await produtoService.GetProductsCount();
            return Ok(total);
        }
        [HttpGet("produtos")]
        public async Task<IActionResult> GetProdutosDoBanco(int page, int pageSize)
        {
            try
            {
                var produtos = await produtoService.GetProdutos(page, pageSize);
                return Ok(produtos);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = "Erro ao encontrar produtos", error = ex.Message });
            }
        }
        [HttpPost("produto")]
        public async Task<IActionResult> RegistrarProduto([FromBody] Produto produto)
        {
            try
            {
                var produtoCadastrado = await produtoService.RegistrarProdutoNoBanco(produto);
                return Ok(produtoCadastrado);
            }
            catch (Exception error)
            {
                return BadRequest(error.Message);
            }
        }
        [HttpPost("produtos")]
        public async Task<IActionResult> RegistrarProdutos([FromBody] List<Produto> produtos)
        {
            var produtosCadastrados = await produtoService.CadastrarProdutos(produtos);
            return Ok(produtosCadastrados);
        }
    }
}
