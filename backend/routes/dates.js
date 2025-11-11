const express = require('express');
const { body, validationResult } = require('express-validator');
const ExpirationDate = require('../models/ExpirationDate');
const Vehicle = require('../models/Vehicle');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Obtener todas las fechas de vencimiento
router.get('/', auth, async (req, res) => {
  try {
    const { tipo, vencidas, proximasAVencer } = req.query;
    
    const filters = { activo: true };
    
    if (tipo) {
      filters.tipo = tipo;
    }
    
    // Filtrar por fechas vencidas
    if (vencidas === 'true') {
      filters.fechaVencimiento = { $lt: new Date() };
    }
    
    // Filtrar por fechas próximas a vencer (próximos 7 días)
    if (proximasAVencer === 'true') {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      filters.fechaVencimiento = {
        $gte: today,
        $lte: nextWeek
      };
    }

    const dates = await ExpirationDate.find(filters)
      .populate('vehiculo')
      .populate('usuario', 'nombres cargo')
      .populate('usuarioActualizacion', 'nombres cargo')
      .sort({ fechaVencimiento: 1 });

    res.json(dates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener fechas por vehículo
router.get('/vehicle/:vehicleId', auth, async (req, res) => {
  try {
    const dates = await ExpirationDate.find({ 
      vehiculo: req.params.vehicleId,
      activo: true 
    })
    .populate('usuario', 'nombres cargo')
    .populate('usuarioActualizacion', 'nombres cargo')
    .sort({ tipo: 1 });

    res.json(dates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Crear o actualizar fecha de vencimiento
router.post('/', [
  auth,
  authorize('Jefe de Mantenimiento', 'Técnico', 'Administrador'),
  body('numeroInterno').notEmpty().withMessage('El número interno es requerido'),
  body('placa').notEmpty().withMessage('La placa es requerida'),
  body('tipo').isIn(['RTM', 'Revisión Preventiva', 'SOAT'])
    .withMessage('Tipo no válido'),
  body('fechaVencimiento').isISO8601().withMessage('Fecha de vencimiento no válida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { numeroInterno, placa, tipo, fechaVencimiento } = req.body;

    // Buscar vehículo
    const vehicle = await Vehicle.findOne({ 
      numeroInterno, 
      placa: placa.toUpperCase() 
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }

    // Verificar si ya existe una fecha para este vehículo y tipo
    let expirationDate = await ExpirationDate.findOne({
      vehiculo: vehicle._id,
      tipo
    });

    if (expirationDate) {
      // Actualizar fecha existente
      expirationDate.fechaVencimiento = new Date(fechaVencimiento);
      expirationDate.usuarioActualizacion = req.user._id;
      expirationDate.fechaActualizacion = new Date();
      expirationDate.notificacionEnviada = false;
      expirationDate.activo = true;
      
      await expirationDate.save();
      await expirationDate.populate('usuario', 'nombres cargo');
      await expirationDate.populate('usuarioActualizacion', 'nombres cargo');

      res.json({
        message: 'Fecha de vencimiento actualizada exitosamente',
        expirationDate
      });
    } else {
      // Crear nueva fecha
      expirationDate = new ExpirationDate({
        vehiculo: vehicle._id,
        numeroInterno,
        placa: placa.toUpperCase(),
        tipo,
        fechaVencimiento: new Date(fechaVencimiento),
        usuario: req.user._id
      });

      await expirationDate.save();
      await expirationDate.populate('usuario', 'nombres cargo');

      res.status(201).json({
        message: 'Fecha de vencimiento creada exitosamente',
        expirationDate
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Actualizar fecha de vencimiento
router.put('/:id', [
  auth,
  authorize('Jefe de Mantenimiento', 'Técnico', 'Administrador'),
  body('fechaVencimiento').isISO8601().withMessage('Fecha de vencimiento no válida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fechaVencimiento } = req.body;

    const expirationDate = await ExpirationDate.findByIdAndUpdate(
      req.params.id,
      {
        fechaVencimiento: new Date(fechaVencimiento),
        usuarioActualizacion: req.user._id,
        fechaActualizacion: new Date(),
        notificacionEnviada: false
      },
      { new: true }
    )
    .populate('usuario', 'nombres cargo')
    .populate('usuarioActualizacion', 'nombres cargo');

    if (!expirationDate) {
      return res.status(404).json({ message: 'Fecha de vencimiento no encontrada' });
    }

    res.json({
      message: 'Fecha de vencimiento actualizada exitosamente',
      expirationDate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Eliminar fecha de vencimiento (soft delete)
router.delete('/:id', [
  auth,
  authorize('Jefe de Mantenimiento', 'Administrador')
], async (req, res) => {
  try {
    const expirationDate = await ExpirationDate.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );

    if (!expirationDate) {
      return res.status(404).json({ message: 'Fecha de vencimiento no encontrada' });
    }

    res.json({ message: 'Fecha de vencimiento eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener fechas próximas a vencer para notificaciones
router.get('/notifications/upcoming', auth, async (req, res) => {
  try {
    const today = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(today.getDate() + 2);

    const upcomingDates = await ExpirationDate.find({
      fechaVencimiento: {
        $gte: today,
        $lte: twoDaysFromNow
      },
      notificacionEnviada: false,
      activo: true
    })
    .populate('vehiculo')
    .populate('usuario', 'nombres email');

    res.json(upcomingDates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Ruta específica de búsqueda para el componente Search
router.get('/search', auth, async (req, res) => {
  try {
    const { 
      tipo, 
      vehiculo, 
      fechaInicio, 
      fechaFin, 
      vencidas,
      proximasAVencer,
      page = 1,
      limit = 10
    } = req.query;

    // Construir filtros
    const filters = { activo: true };
    
    if (tipo) {
      filters.tipo = { $regex: tipo, $options: 'i' };
    }
    
    if (vehiculo) {
      // Buscar vehículos que coincidan con el término de búsqueda
      const vehicles = await Vehicle.find({
        $or: [
          { numeroInterno: { $regex: vehiculo, $options: 'i' } },
          { placa: { $regex: vehiculo, $options: 'i' } },
          { marca: { $regex: vehiculo, $options: 'i' } },
          { modelo: { $regex: vehiculo, $options: 'i' } }
        ]
      }).select('_id');
      
      const vehicleIds = vehicles.map(v => v._id);
      filters.vehiculo = { $in: vehicleIds };
    }
    
    if (fechaInicio || fechaFin) {
      filters.fechaVencimiento = {};
      if (fechaInicio) {
        filters.fechaVencimiento.$gte = new Date(fechaInicio);
      }
      if (fechaFin) {
        filters.fechaVencimiento.$lte = new Date(fechaFin);
      }
    }
    
    // Filtrar por fechas vencidas
    if (vencidas === 'true') {
      filters.fechaVencimiento = { ...filters.fechaVencimiento, $lt: new Date() };
    }
    
    // Filtrar por fechas próximas a vencer (próximos 30 días)
    if (proximasAVencer === 'true') {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(today.getDate() + 30);
      
      filters.fechaVencimiento = {
        ...filters.fechaVencimiento,
        $gte: today,
        $lte: nextMonth
      };
    }

    // Configurar paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const dates = await ExpirationDate.find(filters)
      .populate('vehiculo')
      .populate('usuario', 'nombres cargo')
      .populate('usuarioActualizacion', 'nombres cargo')
      .sort({ fechaVencimiento: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ExpirationDate.countDocuments(filters);

    res.json({
      results: dates,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error en búsqueda de fechas de vencimiento:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener estadísticas de fechas de vencimiento
router.get('/stats', auth, async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    // Total de fechas activas
    const total = await ExpirationDate.countDocuments({ activo: true });

    // Fechas vencidas
    const vencidos = await ExpirationDate.countDocuments({
      activo: true,
      fechaVencimiento: { $lt: today }
    });

    // Fechas próximas a vencer (próximos 7 días)
    const proximosVencer = await ExpirationDate.countDocuments({
      activo: true,
      fechaVencimiento: {
        $gte: today,
        $lte: nextWeek
      }
    });

    // Fechas vigentes (no vencidas y no próximas a vencer)
    const vigentes = await ExpirationDate.countDocuments({
      activo: true,
      fechaVencimiento: { $gt: nextWeek }
    });

    const stats = {
      total,
      vencidos,
      proximosVencer,
      vigentes
    };

    res.json(stats);
  } catch (error) {
    console.error('Error obteniendo estadísticas de fechas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;