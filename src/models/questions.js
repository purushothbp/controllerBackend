import { ChromaClient } from 'chromadb';

const chroma = new ChromaClient({ path: 'http://localhost:8000' });

const questionCollection = await chroma.createCollection({ name: 'questions' });

export const createQuestion = async (question, answer) => {
  const questionId = uuidv4();
  
  await questionCollection.add({
    ids: [questionId],
    documents: [{ questionId, question, answer }],
  });
};

export const findQuestions = async () => {
  const queryData = await questionCollection.query({
  });

  return queryData.documents;
};
