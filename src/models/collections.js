const { ChromaClient } = require('chromadb');
const chroma = new ChromaClient({ path: 'http://localhost:8000' });

async function initializeCollections() {
  try {
    await chroma.createCollection({ name: 'products' });
    await chroma.createCollection({ name: 'embeddings' });
    await chroma.createCollection({ name: 'users' });
    await chroma.createCollection({ name: 'questions' });
    console.log('Collections created or fetched successfully');
  } catch (error) {
    console.error('Error creating or fetching collections:', error.message);
  }
}

module.exports = {
  chroma,
  initializeCollections,
};
