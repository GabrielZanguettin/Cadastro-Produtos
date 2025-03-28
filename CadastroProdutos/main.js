const image = document.querySelector("#image");
const divPreview = document.querySelector("#preview");
const nameInput = document.querySelector("#name-input");
const submitBtn = document.querySelector("#submit-button");
const toastContainer = document.querySelector("#toast-container");
const form = document.querySelector("#products-form");

/* tf.setBackend('cpu'); */


async function uploadImage(file) {
    // FormData -> Formato que permite enviar arquivos em requisições HTTP
    const formData = new FormData();
    formData.append("image", file);

    const chave_api = "3ff3ec26f6adb29d0157e85b88b477e9";

    try {
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${chave_api}`, formData);
        return response.data.data.url;
    } catch (error) {
        console.error(error);
    }
};

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

async function extractEmbeddings(imageElement) {
    const model = await mobilenet.load();
    const embeddings = await model.infer(imageElement, true); 
    return embeddings.array();
}


async function showPreviewImage(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        image.src = e.target.result;
        divPreview.style.backgroundImage = `url('${image.src}')`;
        divPreview.style.backgroundSize = "cover";
        divPreview.style.backgroundPosition = "center";
    }
}

let embeddings = [];

document.querySelector("#fileInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file) {
        showPreviewImage(file);
        /* image.onload = async () => {
            embeddings = await extractEmbeddings(image);
            const str = embeddings.join(",");
            console.log(str);
        }; */
        /* const fileName = file.name;
        const nameEdited = fileName.slice(0, fileName.lastIndexOf("."));
        nameInput.value = nameEdited; */
        /* const imageUrl = await uploadImage(file);
        console.log("URL da imagem:", imageUrl); */
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

const json = [
    {
        "nome": "Saco de Arroz",
        "barcode": "583217490856",
        "base64": "NTgzMjE3NDkwODU2",
        "embeddings": "0.0783122330904007,0.6533994674682617,5.0030131340026855,0.3611036241054535"
    },
    {
        "nome": "Creme de leite",
        "barcode": "783447092891",
        "base64": "NHgxMrG8NDliODU9",
        "embeddings": "0.0783122330904007,0.6533994674682617,5.0030131340026855,0.3611036241054535"
    }
]

console.log(json);