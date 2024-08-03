const mongoose = require('mongoose');

const embeddingSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  embedding: { type: [Number], required: true }
});

const Embedding = mongoose.model('Embedding', embeddingSchema);

module.exports = Embedding;
