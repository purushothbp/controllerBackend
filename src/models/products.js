import { ChromaClient } from 'chromadb';

const chroma = new ChromaClient({ path: 'http://localhost:8000' });

const productCollection = await chroma.createCollection({ name: 'products' });

export const createProduct = async (title, description, price, imageUrl, userId, instructor, active = true) => {
  const productId = uuidv4();
  
  await productCollection.add({
    ids: [productId],
    documents: [{ productId, title, description, price, imageUrl, userId, instructor, active }],
  });
};

export const findProducts = async () => {
  const queryData = await productCollection.query({
    queryTexts: [], 
  });

  return queryData.documents;
};
