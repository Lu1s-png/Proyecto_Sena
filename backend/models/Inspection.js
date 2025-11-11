const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
  vehiculo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  numeroInterno: {
    type: String,
    required: true
  },
  placa: {
    type: String,
    required: true
  },
  marca: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  modelo: {
    type: String,
    required: true
  },
  kilometraje: {
    type: Number,
    required: true
  },
  detallesEncontrados: {
    type: String,
    required: true
  },
  profundidadNeumaticos: {
    type: String,
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fechaInspeccion: {
    type: Date,
    default: Date.now
  },
  horaInspeccion: {
    type: String,
    default: function() {
      return new Date().toLocaleTimeString('es-CO', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  },
  usuarioActualizacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Actualizar fecha de modificación antes de guardar
inspectionSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.fechaActualizacion = new Date();
  }
  next();
});

module.exports = mongoose.model('Inspection', inspectionSchema);