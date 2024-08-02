const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active:{type:Boolean, required:true ,enum: ['true', 'false'], default: 'true' },
  instructor:{type:String, required:true}
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
