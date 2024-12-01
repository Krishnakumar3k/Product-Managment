const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number] // [longitude, latitude]
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  }
}, {
  timestamps: true
});

warehouseSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Warehouse', warehouseSchema);