import { carrinho, productName } from "./creation.js";

const elements = {
    image: document.querySelector("#image"),
    divPreview: document.querySelector("#preview"),
    toastContainer: document.querySelector("#toast-container"),
    spanLenIcon: document.querySelector("#len-cart"),
    editInput: document.querySelector("#edit-input"),
    navbar: document.querySelectorAll("#navbar li")
};

const containers = {
    registerProductsContainer: document.querySelector("#register-products-container"),
    previewContainer: document.querySelector("#preview-image-container"),
    productsListContainer: document.querySelector("#products-list-container"),
    loginContainer: document.querySelector("#login-container"),
    registerContainer: document.querySelector("#register-container"),
    cartContainer: document.querySelector("#cart-container"),
    editContainer: document.querySelector("#edit-product-container"),
    checkoutContainer: document.querySelector("#checkout-container"),
    productContainer: document.querySelector("#product-container")
};

const pageVisibilityMap = {
    home: ["registerProductsContainer", "previewContainer"],
    products: ["productsListContainer"],
    login: ["loginContainer"],
    register: ["registerContainer"],
    cart: ["cartContainer"],
    edit: ["editContainer"],
    checkout: ["checkoutContainer"],
    product: ["productContainer"]
};

export function showPreviewImage(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
        const base64 = e.target.result;
        elements.image.src = base64;
        elements.divPreview.style.backgroundImage = `url('${base64}')`;
        elements.divPreview.style.backgroundSize = "cover";
        elements.divPreview.style.backgroundPosition = "center";
    };
}

export function showToast(message, color) {
    elements.toastContainer.innerHTML = "";
    const span = document.createElement("span");
    span.classList.add("toast");
    span.innerText = message;
    span.style.backgroundColor = color;
    elements.toastContainer.appendChild(span);

    setTimeout(() => span.classList.toggle("transitioned"), 100);
    setTimeout(() => span.classList.toggle("transitioned"), 2000);
    setTimeout(() => elements.toastContainer.removeChild(span), 3000);
}

export function showPage(page, display) {
    Object.keys(containers).forEach((key) => {
        const container = containers[key];
        if (container.parentNode) {
            container.parentNode.removeChild(container); // remove do DOM
        }
    });

    const visibleContainers = pageVisibilityMap[page];
    if (visibleContainers) {
        visibleContainers.forEach((containerName) => {
            const container = containers[containerName];
            document.querySelector("main").appendChild(container); // recoloca no DOM
            container.style.display = display;
        });
    } else {
        console.warn("Página não reconhecida:", page);
    }
}

export function removeAllSelectedIcons() {
    elements.navbar.forEach((item) => item.classList.remove("active"));
}

export function removeAllSelectedIconsPage() {
    const icons = document.querySelectorAll(".next-page h3");
    console.log(icons);
    icons.forEach((item) => item.classList.remove("current-page"));
}

export function updateLengthCartIcon() {
    elements.spanLenIcon.innerText = carrinho.length;
}

export function updateCarrinho() {
    const targetProduct = carrinho.find((p) => p.Nome === productName);
    const newQty = +elements.editInput.value;

    if (targetProduct && newQty > 0) {
        const unitPrice = targetProduct.Valor / targetProduct.Quantidade;
        targetProduct.Quantidade = newQty;
        targetProduct.Valor = unitPrice * newQty;
    } else {
        return 0;
    }
}

export function priceToPay() {
    return carrinho.reduce((total, p) => total + Number(p.Valor), 0).toFixed(2);
}

export const navbar = elements.navbar;
export const previewContainer = elements.previewContainer;