const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  bin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bin',
    required: true
  },
  fillLevel: { type: Number, required: true },
  weight: { type: Number, required: true },
  gasLevel: { type: Number, required: true },
  temperature: { type: Number, default: 0 },
  recordedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('SensorData', sensorDataSchema);