import { loadProducts, loadProductsInCart } from "./api.js";
import { priceToPay, removeAllSelectedIconsPage, showPage, showToast, updateLengthCartIcon } from "./utils.js";
import { sideMenuCheckout } from "./main.js";

export let carrinho = []
export let productName = "";
const titleCart = document.querySelector(".title-cart")
export const h3PriceToPay = document.querySelector("#price-to-pay");
const nextPageDiv = document.querySelector(".next-page")

export function createCountIconPage(productsPages) {
    for (let i = 1; i <= productsPages; i++) {
        const h3 = document.createElement("h3");
        h3.innerText = i;
        h3.addEventListener("click", async (e) => {
            removeAllSelectedIconsPage();
            e.target.classList.add("current-page");
            await loadProducts(parseInt(e.target.innerText), 9)
        })
        nextPageDiv.appendChild(h3);
    }
    const firstH3 = document.querySelector(".next-page h3")
    firstH3.classList.add("current-page")
}

export function createProductElement(produto) {
    const divProduct = document.createElement("div");
    divProduct.classList.add("product");

    // --- Imagem e categoria ---
    const imgWrap = document.createElement("div");
    imgWrap.classList.add("product-img-action-wrap");

    const productImage = document.createElement("div");
    productImage.classList.add("product-image");

    const img = document.createElement("img");
    img.src = produto.link;
    img.loading = "lazy";

    img.addEventListener("click", () => {
        showPage("product", "flex");
        requestAnimationFrame(() => createSingleProductElement(produto));
    })

    const category = document.createElement("h6");
    category.classList.add("product-category");
    category.textContent = produto.categoria;

    productImage.appendChild(img);
    productImage.appendChild(category);
    imgWrap.appendChild(productImage);

    // --- Nome ---
    const divProductName = document.createElement("div");
    divProductName.classList.add("div-product-name");

    const productNameEl = document.createElement("h4");
    productNameEl.classList.add("product-name");
    productNameEl.textContent = produto.nome;

    divProductName.appendChild(productNameEl);

    // --- Preços ---
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

    // --- Ações (input e botão) ---
    const action = document.createElement("div");
    action.classList.add("action");

    const input = document.createElement("input");
    input.type = "number";
    input.classList.add("amount-items");
    input.value = "1";
    input.min = "1";
    input.max = "999";

    input.addEventListener("input", () => {
        const qtd = parseInt(input.value) || 0;
        productDiscountValue.textContent = `R$${(qtd * produto.valor_Promocional).toFixed(2)}`;
    });

    const button = document.createElement("button");
    button.classList.add("buy-btn");
    button.innerHTML = '<i class="bi bi-cart"></i> Comprar';

    button.addEventListener("click", () => {
        const nome = productNameEl.innerText;
        const categoria = category.innerText;
        const link = img.src;
        const quantidade = parseInt(input.value) || 0;
        const valorTotal = parseFloat(productDiscountValue.innerText.replace("R$", ""));

        if (quantidade <= 0) {
            showToast("Quantidade inválida", "#FF0000");
            return;
        }

        const produtoExistente = carrinho.find(p => p.Nome === nome);

        if (produtoExistente) {
            produtoExistente.Quantidade += quantidade;
            produtoExistente.Valor += valorTotal;
        } else {
            carrinho.push({
                Nome: nome,
                Categoria: categoria,
                Valor: valorTotal,
                Quantidade: quantidade,
                Link: link
            });
            titleCart.textContent = "Seu carrinho";
            sideMenuCheckout.style.display = "flex";
        }

        updateLengthCartIcon();
        showToast("Produto adicionado ao carrinho!", "#43A0D6");
        h3PriceToPay.innerText = `R$${priceToPay()}`;
        loadProductsInCart();
    });

    action.appendChild(input);
    action.appendChild(button);

    // --- Montagem final ---
    divProduct.appendChild(imgWrap);
    divProduct.appendChild(divProductName);
    divProduct.appendChild(prices);
    divProduct.appendChild(action);

    return divProduct;
}

export function createSingleProductElement(produto) {
    const container = document.querySelector("#product-container");
    container.innerHTML = ""; // Limpa o conteúdo anterior

    const iconDiv = document.createElement("div")
    iconDiv.classList.add("arrow-90deg")
    const arrow90deg = document.createElement("i")
    arrow90deg.classList.add(...["bi", "bi-arrow-90deg-left"]);
    iconDiv.appendChild(arrow90deg)
    container.appendChild(iconDiv);

    arrow90deg.addEventListener("click", () => {
        showPage("products", "block")
    })

    // --- Imagem ---
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("single-product-image");

    const img = document.createElement("img");
    img.src = produto.link;
    img.alt = produto.nome;

    imageDiv.appendChild(img);
    container.appendChild(imageDiv);

    const singleProduct = document.createElement("div");
    singleProduct.classList.add("single-product");

    // --- Título ---
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("single-product-title");

    const h2 = document.createElement("h2");
    h2.textContent = produto.nome;

    const p = document.createElement("p");
    p.textContent = produto.categoria;

    titleDiv.appendChild(h2);
    titleDiv.appendChild(p);

    // --- Reviews ---
    const reviewsDiv = document.createElement("div");
    reviewsDiv.classList.add("single-product-reviews");

    for (let i = 0; i < 5; i++) {
        const star = document.createElement("i");
        star.classList.add("bi", "bi-star-fill");
        reviewsDiv.appendChild(star);
    }

    const reviewText = document.createElement("h3");
    reviewText.textContent = "(75 reviews)";
    reviewsDiv.appendChild(reviewText);

    // --- Informações / Preços / Botão ---
    const infosDiv = document.createElement("div");
    infosDiv.classList.add("single-product-infos");

    const pricesDiv = document.createElement("div");
    pricesDiv.classList.add("single-product-prices");

    const promoPrice = document.createElement("h3");
    promoPrice.textContent = `R$${produto.valor_Promocional.toFixed(2)}`;

    const fullPrice = document.createElement("h4");
    fullPrice.textContent = `R$${produto.valor.toFixed(2)}`;

    pricesDiv.appendChild(promoPrice);
    pricesDiv.appendChild(fullPrice);

    const buyButton = document.createElement("button");
    buyButton.id = "buy-button";
    buyButton.innerHTML = `<i class="bi bi-cart"></i>Comprar`;

    buyButton.addEventListener("click", () => {
        const nome = produto.nome;
        const categoria = produto.categoria;
        const link = produto.link;
        const quantidade = 1;
        const valorTotal = produto.valor_Promocional;

        const produtoExistente = carrinho.find(p => p.Nome === nome);

        if (produtoExistente) {
            produtoExistente.Quantidade += quantidade;
            produtoExistente.Valor += valorTotal;
        } else {
            carrinho.push({
                Nome: nome,
                Categoria: categoria,
                Valor: valorTotal,
                Quantidade: quantidade,
                Link: link
            });
            titleCart.textContent = "Seu carrinho";
            sideMenuCheckout.style.display = "flex";
        }

        updateLengthCartIcon();
        showToast("Produto adicionado ao carrinho!", "#43A0D6");
        h3PriceToPay.innerText = `R$${priceToPay()}`;
        loadProductsInCart();
    });

    infosDiv.appendChild(pricesDiv);
    infosDiv.appendChild(buyButton);

    // --- Monta tudo no singleProduct ---
    singleProduct.appendChild(titleDiv);
    singleProduct.appendChild(reviewsDiv);
    singleProduct.appendChild(infosDiv);

    // --- Adiciona ao container ---
    container.appendChild(singleProduct);
}

export function createProductCartElement(product) {
    const divCartProduct = document.createElement("div");
    divCartProduct.classList.add("product-cart");

    // --- Imagem e categoria ---
    const imgWrapCart = document.createElement("div");
    imgWrapCart.classList.add("product-img-action-wrap-cart");

    const borderCart = document.createElement("div");
    borderCart.classList.add("border-cart");

    const productImageCart = document.createElement("div");
    productImageCart.classList.add("product-image-cart");

    const imgCart = document.createElement("img");
    imgCart.src = product.Link;

    const categoryCart = document.createElement("h6");
    categoryCart.classList.add("product-category-cart");
    categoryCart.textContent = product.Categoria;

    productImageCart.appendChild(categoryCart);
    productImageCart.appendChild(imgCart);
    imgWrapCart.appendChild(productImageCart);

    // --- Nome ---
    const divProductNameCart = document.createElement("div");
    divProductNameCart.classList.add("div-product-name-cart");

    const productNameCart = document.createElement("h4");
    productNameCart.classList.add("product-name-cart");
    productNameCart.textContent = product.Nome;

    divProductNameCart.appendChild(productNameCart);

    // --- Preço e Quantidade ---
    const pricesCart = document.createElement("div");
    pricesCart.classList.add("prices-cart");

    const productValueCart = document.createElement("h4");
    productValueCart.classList.add("product-value-cart");
    productValueCart.textContent = `R$${product.Valor.toFixed(2)}`;

    const productAmountCart = document.createElement("h4");
    productAmountCart.classList.add("product-amount-cart");
    productAmountCart.textContent = `Quantidade: ${product.Quantidade}`;

    pricesCart.appendChild(productValueCart);
    pricesCart.appendChild(productAmountCart);

    // --- Ações (ícones) ---
    const productCartInfos = document.createElement("div");
    productCartInfos.classList.add("product-cart-infos");

    const productCartIcons = document.createElement("div");
    productCartIcons.classList.add("product-cart-icons");

    const editIcon = document.createElement("i");
    editIcon.classList.add("bi", "bi-pencil");

    const removeIcon = document.createElement("i");
    removeIcon.classList.add("bi", "bi-x-lg");

    productCartIcons.appendChild(editIcon);
    productCartIcons.appendChild(removeIcon);

    productCartInfos.appendChild(divProductNameCart);
    productCartInfos.appendChild(pricesCart);

    divCartProduct.appendChild(imgWrapCart);
    divCartProduct.appendChild(borderCart);
    divCartProduct.appendChild(productCartInfos);
    divCartProduct.appendChild(productCartIcons);

    // --- Eventos ---

    // Editar
    editIcon.addEventListener("click", () => {
        showPage("edit", "block");
        productName = product.Nome;
    });

    // Remover
    removeIcon.addEventListener("click", () => {
        const indexToRemove = carrinho.findIndex(p => p.Nome === product.Nome);

        if (indexToRemove !== -1) {
            carrinho.splice(indexToRemove, 1);
            if (carrinho.length === 0) {
                titleCart.textContent = "Não há produtos no carrinho.";
                sideMenuCheckout.style.display = "none";
            }
            h3PriceToPay.innerText = `R$${priceToPay()}`;
            loadProductsInCart();
            updateLengthCartIcon();
            showToast("Produto removido do carrinho!", "#096137");
        } else {
            showToast("Produto não encontrado", "#FF0000");
        }
    });

    return divCartProduct;
}