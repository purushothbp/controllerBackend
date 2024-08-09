import { ChromaClient } from 'chromadb';

const chroma = new ChromaClient({ path: 'http://localhost:8000' });

const embeddingCollection = await chroma.createCollection({ name: 'embeddings' });

export const createEmbedding = async (productId, embedding) => {
  const embeddingId = uuidv4();
  
  await embeddingCollection.add({
    ids: [embeddingId],
    embeddings: [embedding],
    documents: [{ embeddingId, productId }],
  });
};

export const findEmbeddingsByProductId = async (productId) => {
  const queryData = await embeddingCollection.query({
    queryTexts: [productId],
  });

  return queryData.documents;
};
