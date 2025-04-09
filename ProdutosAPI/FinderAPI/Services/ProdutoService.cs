using FinderAPI.Entidades;
using NHibernate;
using NHibernate.Linq;

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
        public async Task<List<Produto>> GetProdutos(int page, int pageSize) {
            using var session = sessionFactory.OpenSession();
            var products = page == 0 ? await session.Query<Produto>().ToListAsync() : 
                await session.Query<Produto>().Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return products ?? new List<Produto>();
        }
        public async Task<int> GetProductsCount()
        {
            using var session = sessionFactory.OpenSession();
            var total = await session.Query<Produto>().CountAsync();
            return total;
        }
    }
}
