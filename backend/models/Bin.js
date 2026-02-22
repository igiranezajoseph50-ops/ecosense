const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  binId: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  fillLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  weight: {
    type: Number,
    default: 0
  },
  gasLevel: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['green', 'yellow', 'red'],
    default: 'green'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Bin', binSchema);