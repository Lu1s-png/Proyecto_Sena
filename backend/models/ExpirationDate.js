const mongoose = require('mongoose');

const expirationDateSchema = new mongoose.Schema({
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
  tipo: {
    type: String,
    required: true,
    enum: ['RTM', 'Revisión Preventiva', 'SOAT']
  },
  fechaVencimiento: {
    type: Date,
    required: true
  },
  notificacionEnviada: {
    type: Boolean,
    default: false
  },
  fechaNotificacion: {
    type: Date
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  },
  activo: {
    type: Boolean,
    default: true
  }
});

// Actualizar fecha de modificación antes de guardar
expirationDateSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.fechaActualizacion = new Date();
  }
  next();
});

// Índice compuesto para evitar duplicados
expirationDateSchema.index({ vehiculo: 1, tipo: 1 }, { unique: true });

module.exports = mongoose.model('ExpirationDate', expirationDateSchema);