// src/routes/products.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { generateEmbedding } = require('../controllers/chat/utils/ragEmbeddings');

const router = express.Router();

router.get('/', async (req, res) => {
  const { productCollection } = req.app.locals.collections;
  try {
    const queryData = await productCollection.query({
      queryTexts: [],
    });
    res.status(200).json(queryData.documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  const { productCollection } = req.app.locals.collections;
  try {
    const queryData = await productCollection.query({
      queryTexts: [req.params.id],
    });
    if (queryData.documents.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(queryData.documents[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/', async (req, res) => {
  const { title, description, price, imageUrl, instructor, active, userId } = req.body;
  const { productCollection, embeddingCollection } = req.app.locals.collections;

  if (!title || !description || !price || !imageUrl || !instructor || active === undefined || !userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let embeddingArray;
    try {
      embeddingArray = await generateEmbedding(description);
    } catch (embeddingError) {
      return res.status(500).json({ message: 'Error generating embedding', error: embeddingError });
    }

    const productId = uuidv4();
    await productCollection.add({
      ids: [productId],
      documents: [{ productId, title, description, price, imageUrl, instructor, active, userId }],
    });

    await embeddingCollection.add({
      ids: [uuidv4()],
      embeddings: [embeddingArray],
      documents: [{ productId }],
    });

    res.status(201).json({ productId, title, description, price, imageUrl, instructor, active, userId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
