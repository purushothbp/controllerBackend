const { OpenAI } = require('openai');
const dotenv = require('dotenv');
const { ChromaClient } = require('chromadb');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chroma = new ChromaClient({ path: 'http://localhost:8000' });

async function initializeCollections() {
  let questionCollection, embeddingCollection;
  try {
    questionCollection = await chroma.createCollection({ name: 'questions' });
    embeddingCollection = await chroma.createCollection({ name: 'embeddings' });
    console.log('Collections created or fetched successfully');
  } catch (error) {
    console.error('Error creating or fetching collections:', error.message);
  }
  return { questionCollection, embeddingCollection };
}

const collectionsPromise = initializeCollections();

async function generateQueryEmbedding(question) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: question,
  });
  return response.data[0].embedding;
}

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

async function findRelevantChunks(queryEmbedding) {
  const { embeddingCollection } = await collectionsPromise;
  const embeddings = await embeddingCollection.query({
    queryEmbeddings: [queryEmbedding],
  });

  const similarities = embeddings.documents.map(doc => ({
    ...doc,
    similarity: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities.slice(0, 5);
}

async function generateAnswer(question, contextDocuments) {
  const context = contextDocuments.map(doc => doc.chunk).join(' ');

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: `${context}\n\nQ: ${question}\nA:` },
    ],
    max_tokens: 100,
  });
  return response.choices[0].message.content.trim();
}

async function askQuestion(req, res) {
  const { question } = req.body;

  try {
    const { questionCollection } = await collectionsPromise;
    const queryData = await questionCollection.query({
      queryTexts: [question],
    });

    if (queryData.documents.length > 0) {
      return res.json(queryData.documents[0]);
    } else {
      const queryEmbedding = await generateQueryEmbedding(question);
      const relevantChunks = await findRelevantChunks(queryEmbedding);
      const generatedAnswer = await generateAnswer(question, relevantChunks);

      await questionCollection.add({
        ids: [question],
        embeddings: [queryEmbedding],
        documents: [{ question, answer: generatedAnswer }],
      });

      return res.json({ question, answer: generatedAnswer });
    }
  } catch (error) {
    console.error('Error processing question:', error);
    res.status(500).send({ error: 'An error occurred while processing your request.' });
  }
}

module.exports = {
  askQuestion,
};
