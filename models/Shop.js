const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  retailer:    { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);
