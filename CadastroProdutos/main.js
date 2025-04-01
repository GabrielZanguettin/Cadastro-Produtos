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

async function uploadImage(file) {
    // FormData -> Formato que permite enviar arquivos em requisições HTTP
    const formData = new FormData();
    formData.append("image", file);

    const chave_api = "3ff3ec26f6adb29d0157e85b88b477e9";

    try {
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${chave_api}`, formData);
        linkInput.value = response.data.data.url;
    } catch (error) {
        console.error(error);
    }
};

async function registerProduct() {
    try {
        const response = await axios.post( , {
            Nome: nameInput.value,
            Categoria: categoryInput.value,
            Promocao: discountInput.value,
            Valor: priceInput.value,
            ValorPromocional:  priceInput.value - priceInput.value * discounts[categoryInput.value],
            Link: linkInput.value
        })
    }
}

async function showPreviewImage(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function (e) {
        const base64 = e.target.result;
        image.src = base64;
        divPreview.style.backgroundImage = `url('${image.src}')`;
        divPreview.style.backgroundSize = "cover";
        divPreview.style.backgroundPosition = "center";
        /* const response = await axios.post(`https://localhost:7223/api/produto/base64`, {
            Valor: base64
        }); */
    }
}

function showToast() {
    toastContainer.innerHTML = "";
    const span = document.createElement("span");
    span.classList.add("toast")
    span.innerText = "Produto cadastrado com sucesso!";
    toastContainer.appendChild(span);

    setTimeout(() => span.classList.toggle("transitioned"), 0.1);
    setTimeout(() => span.classList.toggle("transitioned"), 2000);
    setTimeout(() => toastContainer.removeChild(span), 3000);
}

/* async function showPreviewImage2(file) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async function (e) {
        const arrayBuffer = e.target.result;
        const byteArray = new Uint8Array(arrayBuffer); // Transformar o ArrayBuffer em Uint8Array
        console.log(`Valor binário da imagem: ${byteArray}`);
        image.src = base64;
        divPreview.style.backgroundImage = `url('${image.src}')`;
        divPreview.style.backgroundSize = "cover";
        divPreview.style.backgroundPosition = "center";
        const response = await axios.post(`https://localhost:7223/api/produto/base64`, {
            Valor: base64
        });
    }
} */

/* categoryInput.addEventListener("change", () => {
    const desconto = discounts[categoryInput.value];
    const productValue = priceInput.value - priceInput.value * desconto;
}) */

submitBtn.addEventListener("click", () => {
    registerProduct();
})

document.querySelector("#fileInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file) {
        const imageUrl = await uploadImage(file);
        showPreviewImage(file);
    }
});

form.addEventListener("submit", () => {
    sessionStorage.setItem("formEnviado", "true");
})

window.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("formEnviado") === "true") {
        showToast();
        sessionStorage.removeItem("formEnviado");
    }
});