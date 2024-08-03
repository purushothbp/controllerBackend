const express = require('express');
const Product = require('../models/products');
const Embedding = require('../models/embeddings');
const { generateEmbedding } = require('../controllers/chat/utils/ragEmbeddings');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/', async (req, res) => {
  const { title, description, price, imageUrl, instructor, active, userId } = req.body;

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

    const newProduct = new Product({ 
      title, 
      description, 
      price, 
      imageUrl, 
      instructor, 
      active,
      userId
    });
    await newProduct.save();

    const newEmbedding = new Embedding({
      productId: newProduct._id,
      embedding: embeddingArray
    });
    await newEmbedding.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
