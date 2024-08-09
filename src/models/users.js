const { v4: uuidv4 } = require('uuid');
const { initializeCollections } = require('./chromaClient');

let userCollection;

initializeCollections().then(collections => {
  userCollection = collections.userCollection;
});

const createUser = async (firstname, lastname, email, role = 'guest') => {
  if (!userCollection) {
    throw new Error('User collection not initialized');
  }
  const userId = uuidv4();
  
  await userCollection.add({
    ids: [userId],
    documents: [{ userId, firstname, lastname, email, role }],
  });
};

const findUserByEmail = async (email) => {
  if (!userCollection) {
    throw new Error('User collection not initialized');
  }
  const queryData = await userCollection.query({
    queryTexts: [email],
  });

  return queryData.documents[0];
};

module.exports = {
  createUser,
  findUserByEmail,
};
