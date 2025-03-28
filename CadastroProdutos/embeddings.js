tf.setBackend('cpu');

async function extractEmbeddings(imageElement) {
    const model = await mobilenet.load();
    const embeddings = await model.infer(imageElement, true); 
    return embeddings.array();
}

// Espera a imagem carregar antes de extrair os embeddings
image.onload = async () => {
    const embeddings = await extractEmbeddings(image);
    console.log(embeddings);
};