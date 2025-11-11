const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  numeroInterno: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  placa: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  marca: {
    type: String,
    required: true,
    trim: true
  },
  tipo: {
    type: String,
    required: true,
    trim: true
  },
  modelo: {
    type: String,
    required: true,
    trim: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);