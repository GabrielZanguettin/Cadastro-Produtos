using FinderAPI.Entidades;
using NHibernate;

namespace FinderAPI.Services
{
    public class ProdutoService
    {
        private readonly ISessionFactory sessionFactory;
        public ProdutoService(ISessionFactory sessionFactory)
        {
            this.sessionFactory = sessionFactory;
        }
        public async Task<Produto> RegistrarProdutoNoBanco(Produto produto)
        {
            using var session = sessionFactory.OpenSession();
            using var transaction = session.BeginTransaction();
            await session.SaveAsync(produto);
            await transaction.CommitAsync();
            return produto;
        }
        public async Task<List<Produto>> CadastrarProdutos(List<Produto> produtos)
        {
            var produtosCadastrados = new List<Produto>();
            foreach (var produto in produtos)
            {
                var produtoCadastrado = await RegistrarProdutoNoBanco(produto);
                produtosCadastrados.Add(produtoCadastrado);
            }
            return produtosCadastrados;
        }
    }
}
