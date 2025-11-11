const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const notificationService = require('../services/notificationService');
const ExpirationDate = require('../models/ExpirationDate');

const router = express.Router();

// Obtener todas las notificaciones con paginación y filtros
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      tipo = '', 
      prioridad = '', 
      estado = '', 
      fechaDesde = '', 
      fechaHasta = '' 
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir filtros
    let filters = { activo: true };
    
    if (tipo) filters.tipo = tipo;
    if (prioridad) filters.prioridad = prioridad;
    if (estado === 'leida') filters.notificacionEnviada = true;
    if (estado === 'no_leida') filters.notificacionEnviada = { $ne: true };
    
    if (fechaDesde || fechaHasta) {
      filters.fechaVencimiento = {};
      if (fechaDesde) filters.fechaVencimiento.$gte = new Date(fechaDesde);
      if (fechaHasta) filters.fechaVencimiento.$lte = new Date(fechaHasta);
    }



    const notifications = await ExpirationDate.find(filters)
      .populate('vehiculo')
      .populate('usuario', 'nombres cargo')
      .sort({ fechaVencimiento: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ExpirationDate.countDocuments(filters);

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener notificaciones pendientes
router.get('/pending', auth, async (req, res) => {
  try {
    const today = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(today.getDate() + 2);

    const pendingNotifications = await ExpirationDate.find({
      fechaVencimiento: {
        $gte: today,
        $lte: twoDaysFromNow
      },
      activo: true
    })
    .populate('vehiculo')
    .populate('usuario', 'nombres cargo')
    .sort({ fechaVencimiento: 1 });

    res.json(pendingNotifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener historial de notificaciones enviadas
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await ExpirationDate.find({
      notificacionEnviada: true,
      fechaNotificacion: { $exists: true }
    })
    .populate('vehiculo')
    .populate('usuario', 'nombres cargo')
    .sort({ fechaNotificacion: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await ExpirationDate.countDocuments({
      notificacionEnviada: true,
      fechaNotificacion: { $exists: true }
    });

    res.json({
      notifications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Enviar notificación manual
router.post('/send/:id', [
  auth,
  authorize('Jefe de Mantenimiento', 'Jefe de Operaciones')
], async (req, res) => {
  try {
    const success = await notificationService.sendManualNotification(req.params.id);
    
    if (success) {
      res.json({ message: 'Notificación enviada exitosamente' });
    } else {
      res.status(500).json({ message: 'Error enviando notificación' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Ejecutar verificación manual de notificaciones
router.post('/check', [
  auth,
  authorize('Jefe de Mantenimiento', 'Jefe de Operaciones')
], async (req, res) => {
  try {
    await notificationService.checkExpiringDates();
    res.json({ message: 'Verificación de notificaciones ejecutada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error ejecutando verificación' });
  }
});

// Obtener estadísticas de notificaciones
router.get('/stats', auth, async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const stats = {
      vencidas: await ExpirationDate.countDocuments({
        fechaVencimiento: { $lt: today },
        activo: true
      }),
      proximasAVencer: await ExpirationDate.countDocuments({
        fechaVencimiento: {
          $gte: today,
          $lte: nextWeek
        },
        activo: true
      }),
      notificacionesPendientes: await ExpirationDate.countDocuments({
        fechaVencimiento: {
          $gte: today,
          $lte: nextWeek
        },
        notificacionEnviada: false,
        activo: true
      }),
      notificacionesEnviadas: await ExpirationDate.countDocuments({
        notificacionEnviada: true,
        fechaNotificacion: { $exists: true }
      })
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener estadísticas de notificaciones
router.get('/statistics', auth, async (req, res) => {
  try {
    const today = new Date();
    
    const stats = {
      total: await ExpirationDate.countDocuments({ activo: true }),
      noLeidas: await ExpirationDate.countDocuments({ 
        activo: true, 
        notificacionEnviada: { $ne: true } 
      }),
      alta: await ExpirationDate.countDocuments({ 
        activo: true, 
        prioridad: 'alta' 
      }),
      media: await ExpirationDate.countDocuments({ 
        activo: true, 
        prioridad: 'media' 
      }),
      baja: await ExpirationDate.countDocuments({ 
        activo: true, 
        prioridad: 'baja' 
      })
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;