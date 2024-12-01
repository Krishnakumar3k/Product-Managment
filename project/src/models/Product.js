const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  lowStockThreshold: {
    type: Number,
    required: true,
    default: 10
  }
}, {
  timestamps: true
});

productSchema.index({ warehouse: 1 });

module.exports = mongoose.model('Product', productSchema);