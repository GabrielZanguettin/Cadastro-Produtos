import { showPage, showPreviewImage, showToast, navbar, removeAllSelectedIcons, updateCarrinho, priceToPay } from "./utils.js";
import { loadProducts, registerProduct, uploadImage, priceInput, loadProductsInCart, loadCountProducts } from "./api.js";
import { h3PriceToPay } from "./creation.js";

const form = document.querySelector("#products-form");
const editForm = document.querySelector("#edit-form");
const homeBtn = document.querySelector("#home-btn");
const productsBtn = document.querySelector("#products-btn");
const loginBtn = document.querySelector("#login-btn");
const registerBtn = document.querySelector("#register-btn");
const cartBtn = document.querySelector("#shopping-cart-btn");
const checkoutBtn = document.querySelector("#checkout-button")
const spanCreateAccount = document.querySelector("#no-account-btn");
const editButton = document.querySelector("#edit-button")
const expandBtn = document.querySelector(".bi-list");
export const sideMenuCheckout = document.querySelector(".side-menu-checkout");
const sideMenu = document.querySelector(".side-menu")
const arrowIcon = document.querySelector(".bi-arrow-up-circle");

expandBtn.addEventListener("click", () => {
    sideMenu.classList.toggle("expanded")
})

arrowIcon.addEventListener("click", () => {
    arrowIcon.classList.toggle("rotate-icon");
    sideMenuCheckout.classList.toggle("new-height");
})

navbar.forEach((li) => {
    li.addEventListener("click", (e) => {
        removeAllSelectedIcons();
        e.target.closest("li").classList.add("active")
    })
})

priceInput.addEventListener("input", (e) => {
    if (e.target.value) {
        e.target.value = e.target.value.replace(/[^0-9.]/g, '');
    }
})

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
})

editButton.addEventListener("click", () => {
    const validate = updateCarrinho();
    if (validate === 0) {
        showToast("Quantidade inválida", "#FF0000");
    }
    else {
        showToast("Produto editado com sucesso!", "#096137")
        h3PriceToPay.innerText = `R$${priceToPay()}`;
        loadProductsInCart();
        showPage("cart", "block");
    }
})

window.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("formEnviado") === "true") {
        showToast("Produto cadastrado com sucesso!", "#096137");
        sessionStorage.removeItem("formEnviado");
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    showPage("home", "block");
    loadProducts(1, 9);
    loadCountProducts();

    homeBtn.addEventListener("click", () => showPage("home", "block"));
    productsBtn.addEventListener("click", () => showPage("products", "block"));
    loginBtn.addEventListener("click", () => showPage("login", "block"));
    registerBtn.addEventListener("click", () => showPage("register", "block"));
    cartBtn.addEventListener("click", () => showPage("cart", "block"));
    checkoutBtn.addEventListener("click", () => showPage("checkout", "flex"))
    spanCreateAccount.addEventListener("click", () => {
        showPage("register", "block")
        removeAllSelectedIcons();
        registerBtn.classList.add("active");
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const product = await registerProduct();
        if (product !== null) {
            sessionStorage.setItem("formEnviado", "true");
            location.reload();
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