const image = document.querySelector("#image");
const divPreview = document.querySelector("#preview");
const nameInput = document.querySelector("#name-input");
const categoryInput = document.querySelector("#category-input");
const discountInput = document.querySelector("#discount-input");
const priceInput = document.querySelector("#price-input");
const linkInput = document.querySelector("#link-input");
const submitBtn = document.querySelector("#submit-button");
const toastContainer = document.querySelector("#toast-container");
const form = document.querySelector("#products-form");
const divAvaliableCategories = document.querySelector("#available-categories");
const homeBtn = document.querySelector("#home-btn");
const productsBtn = document.querySelector("#products-btn");
const loginBtn = document.querySelector("#login-btn");
const productsContainer = document.querySelector("#products-container");
const productsListContainer = document.querySelector("#products-list-container");
const previewContainer = document.querySelector("#preview-image-container");
const loginContainer = document.querySelector("#login-container");
const main = document.querySelector("#main");
const divProducts = document.querySelector(".products");

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

const containers = {
    productsContainer,
    previewContainer,
    productsListContainer,
    loginContainer
};

const pageVisibilityMap = {
    home: ["productsContainer", "previewContainer"],
    products: ["productsListContainer"],
    login: ["loginContainer"]
};

async function uploadImage(file) {
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

async function registerProduct() {
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

        /* const response = await axios.post("https://localhost:7223/api/produto", product); */
    } catch (error) {
        console.error(error);
        return null;
    }
}

function createProductElement(produto) {
    const divProduct = document.createElement("div");
    divProduct.classList.add("product");

    const imgWrap = document.createElement("div");
    imgWrap.classList.add("product-img-action-wrap");

    const productImage = document.createElement("div");
    productImage.classList.add("product-image");

    const img = document.createElement("img");
    img.src = produto.link;

    const category = document.createElement("h6");
    category.classList.add("product-category");
    category.textContent = produto.categoria;

    productImage.appendChild(img);
    productImage.appendChild(category);
    imgWrap.appendChild(productImage);

    const divProductName = document.createElement("div");
    divProductName.classList.add("div-product-name");

    const productName = document.createElement("h4");
    productName.classList.add("product-name");
    productName.textContent = produto.nome;

    divProductName.appendChild(productName);

    const prices = document.createElement("div");
    prices.classList.add("prices");

    const productValue = document.createElement("h4");
    productValue.classList.add("product-value");
    productValue.textContent = `R$${produto.valor.toFixed(2)}`;

    const productDiscountValue = document.createElement("h2");
    productDiscountValue.classList.add("product-discount-value");
    productDiscountValue.textContent = `R$${produto.valor_Promocional.toFixed(2)}`;

    prices.appendChild(productValue);
    prices.appendChild(productDiscountValue);

    const action = document.createElement("div");
    action.classList.add("action");

    const input = document.createElement("input");
    input.type = "number";
    input.classList.add("amount-items");
    input.value = "1";
    input.min = "1";
    input.max = "999";

    input.addEventListener("input", () => {
        productDiscountValue.textContent = `R$${(input.value * produto.valor_Promocional).toFixed(2)}`;
    })

    const button = document.createElement("button");
    button.classList.add("buy-btn");
    button.innerHTML = '<i class="bi bi-cart"></i> Comprar';

    action.appendChild(input);
    action.appendChild(button);

    divProduct.appendChild(imgWrap);
    divProduct.appendChild(divProductName);
    divProduct.appendChild(prices);
    divProduct.appendChild(action);

    button.addEventListener("click", () => {
        console.log(divProduct);
    })

    return divProduct;
}

let cachedProducts = null;

async function getProducts() {
    if (!cachedProducts) {
        try {
            /* const response = await axios.get("https://localhost:7223/api/produtos") */
            /* cachedProducts = response.data; */
        } catch (error) {
            console.log(error)
        }
    }
    return cachedProducts;
}

async function loadProducts() {
    const title = document.querySelector("#title");

    try {
        const produtos = await getProducts();
        
        if (!produtos || produtos.length === 0) {
            return;
        } else {
            title.textContent = "Produtos cadastrados";
            produtos.forEach(produto => {
                const productElement = createProductElement(produto);
                divProducts.appendChild(productElement);
            });
        }
    } catch (error) {
        console.error(error);
        title.textContent = "Não há produtos cadastrados";
    }
}

function showPreviewImage(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
        const base64 = e.target.result;
        image.src = base64;
        divPreview.style.backgroundImage = `url('${image.src}')`;
        divPreview.style.backgroundSize = "cover";
        divPreview.style.backgroundPosition = "center";
    };
}

function showToast(message) {
    toastContainer.innerHTML = "";
    const span = document.createElement("span");
    span.classList.add("toast");
    span.innerText = message;
    toastContainer.appendChild(span);

    setTimeout(() => span.classList.toggle("transitioned"), 100);
    setTimeout(() => span.classList.toggle("transitioned"), 2000);
    setTimeout(() => toastContainer.removeChild(span), 3000);
}

function showPage(page) {
    for (let key in containers) {
        containers[key].style.display = "none";
    }
    
    const visibleContainers = pageVisibilityMap[page];
    if (visibleContainers) {
        visibleContainers.forEach(containerName => {
            containers[containerName].style.display = "block";
        });
    } else {
        console.warn("Página não reconhecida:", page);
    }
}

priceInput.addEventListener("input", (e) => {
    if (e.target.value) {
        e.target.value = e.target.value.replace(/[^0-9.]/g, '');
    }
})

document.addEventListener("DOMContentLoaded", () => {
    showPage("home");
    loadProducts();

    homeBtn.addEventListener("click", () => showPage("home"));
    productsBtn.addEventListener("click", () => showPage("products"));
    loginBtn.addEventListener("click", () => showPage("login"));

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const product = await registerProduct();
        if (product !== null) {
            showToast("Produto cadastrado com sucesso!");
            form.reset();
            loadProducts();
        }
    });

    document.querySelector("#fileInput").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
            showPreviewImage(file);
            await uploadImage(file);
        }
    });
});