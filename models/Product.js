const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
  retailer: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer' }
});

module.exports = mongoose.model('Product', productSchema);