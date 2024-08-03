const Question = require('../../models/questions');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
  await client.connect();
  const database = client.db();
  const collection = database.collection('embeddings');

  const results = await collection.find().toArray();
  const similarities = results.map(doc => ({
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

exports.askQuestion = async (req, res) => {
  const { question } = req.body;

  try {
    const dbResponse = await Question.findOne({ question });

    if (dbResponse) {
      return res.json(dbResponse);
    } else {
      const queryEmbedding = await generateQueryEmbedding(question);
      const relevantChunks = await findRelevantChunks(queryEmbedding);
      const generatedAnswer = await generateAnswer(question, relevantChunks);

      const newQuestion = new Question({ question, answer: generatedAnswer });
      await newQuestion.save();

      return res.json({ question, answer: generatedAnswer });
    }
  } catch (error) {
    console.error('Error processing question:', error);
    res.status(500).send({ error: 'An error occurred while processing your request.' });
  }
};
