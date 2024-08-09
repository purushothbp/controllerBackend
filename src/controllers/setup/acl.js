// src/routes/dataCheck.js
const express = require('express');
const router = express.Router();

router.get('/products', async (req, res) => {
  const { productCollection } = req.app.locals.collections;
  try {
    const queryData = await productCollection.query({
      queryTexts: [],
    });
    res.status(200).json(queryData.documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/embeddings', async (req, res) => {
  const { embeddingCollection } = req.app.locals.collections;
  try {
    const queryData = await embeddingCollection.query({
      queryTexts: [],
    });
    res.status(200).json(queryData.documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/users', async (req, res) => {
  const { userCollection } = req.app.locals.collections;
  try {
    const queryData = await userCollection.query({
      queryTexts: [],
    });
    res.status(200).json(queryData.documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/questions', async (req, res) => {
  const { questionCollection } = req.app.locals.collections;
  try {
    const queryData = await questionCollection.query({
      queryTexts: [],
    });
    res.status(200).json(queryData.documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
