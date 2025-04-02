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
