import { createProductElement, carrinho, createProductCartElement, createCountIconPage } from "./creation.js";

const linkInput = document.querySelector("#link-input");
const categoryInput = document.querySelector("#category-input");
const nameInput = document.querySelector("#name-input");
const discountInput = document.querySelector("#discount-input");
export const priceInput = document.querySelector("#price-input");
const divProducts = document.querySelector(".products");
const divProductsInCart = document.querySelector(".products-cart");

const discounts = {
    Bebida: 0.05,
    Alimento: 0.10,
    Frios: 0.07,
    Carne: 0.08,
    Doce: 0.06,
    Limpeza: 0.03,
    Higiene: 0.04,
    Eletrodoméstico: 0.12
};


export async function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    const chave_api = "3ff3ec26f6adb29d0157e85b88b477e9";

    try {
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${chave_api}`, formData);
        linkInput.value = response.data.data.url;
    } catch (error) {
        console.error(error.config.data);
    }
}

export async function registerProduct() {
    try {
        const category = categoryInput.value;
        
        if (!(category in discounts)) {
            alert("Categoria inválida! Escolha uma das categorias disponíveis.");
            return null;
        }

        const product = {
            Nome: nameInput.value,
            Categoria: category,
            Promocao: discountInput.checked,
            Valor: +priceInput.value,
            Link: linkInput.value
        };

        if (product.Promocao) {
            product.Valor_Promocional = product.Valor - product.Valor * discounts[category];
        }
        else {
            product.Valor_Promocional = product.Valor;
        }

        const response = await axios.post("https://localhost:7223/api/produto", product);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getProducts(page, pageSize) {
    try {
        const response = await axios.get(`https://localhost:7223/api/produtos?page=${page}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function loadCountProducts() {
    try {

        const productsCount = await axios.get("https://localhost:7223/api/produtos/count")
        const productsPages = Math.ceil(productsCount.data / 9)
        createCountIconPage(productsPages);

    } catch (error) {

    }
}

export async function loadProducts(page, pageSize) {
    

    divProducts.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 2rem;">
            <span class="loader-1"></span>
        </div>
    `;
    

    try {
        let produtos = await getProducts(page, pageSize);
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!produtos || produtos.length === 0) {
            return;
        } else {
            

            const fragment = document.createDocumentFragment();

            produtos.forEach((produto) => {
                const productElement = createProductElement(produto);
                fragment.appendChild(productElement);
            });

            divProducts.innerHTML = "";
            divProducts.appendChild(fragment);
        }
    } catch (error) {
        console.error(error);
        
    }
}

export function loadProductsInCart() {
    divProductsInCart.innerHTML = "";

    const fragment = document.createDocumentFragment();

    carrinho.forEach((produto) => {
        const productCartElement = createProductCartElement(produto);
        fragment.appendChild(productCartElement);
    });

    divProductsInCart.appendChild(fragment);
}