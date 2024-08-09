const { ChromaClient } = require('chromadb');
const chroma = new ChromaClient({ path: 'http://localhost:8000' });

async function initializeCollections() {
  let productCollection, embeddingCollection, userCollection, questionCollection;
  try {
    productCollection = await chroma.createCollection({ name: 'products' });
    embeddingCollection = await chroma.createCollection({ name: 'embeddings' });
    userCollection = await chroma.createCollection({ name: 'users' });
    questionCollection = await chroma.createCollection({ name: 'questions' });
    console.log('Collections created or fetched successfully');
  } catch (error) {
    console.error('Error creating or fetching collections:', error);
  }
  return { productCollection, embeddingCollection, userCollection, questionCollection };
}

module.exports = {
  chroma,
  initializeCollections,
};
