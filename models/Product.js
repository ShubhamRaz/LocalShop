const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  price:       { type: Number, required: true },
  imageUrl:    { type: String, default: '' },
  retailer:    { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
