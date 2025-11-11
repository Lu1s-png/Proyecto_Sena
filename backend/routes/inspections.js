const express = require('express');
const { body, validationResult } = require('express-validator');
const Inspection = require('../models/Inspection');
const Vehicle = require('../models/Vehicle');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Obtener todas las inspecciones con filtros y búsqueda
router.get('/', auth, async (req, res) => {
  try {
    const { 
      numeroInterno, 
      placa, 
      fechaInicio, 
      fechaFin, 
      usuario,
      sortBy = 'fechaInspeccion',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Construir filtros
    const filters = {};
    
    if (numeroInterno) {
      filters.numeroInterno = { $regex: numeroInterno, $options: 'i' };
    }
    
    if (placa) {
      filters.placa = { $regex: placa, $options: 'i' };
    }
    
    if (fechaInicio || fechaFin) {
      filters.fechaInspeccion = {};
      if (fechaInicio) {
        filters.fechaInspeccion.$gte = new Date(fechaInicio);
      }
      if (fechaFin) {
        filters.fechaInspeccion.$lte = new Date(fechaFin);
      }
    }
    
    if (usuario) {
      // Buscar por email del usuario en lugar de ObjectId
      const User = require('../models/User');
      const userDoc = await User.findOne({ email: { $regex: usuario, $options: 'i' } });
      if (userDoc) {
        filters.usuario = userDoc._id;
      } else {
        // Si no se encuentra el usuario, usar un ObjectId que no existe para que no devuelva resultados
        filters.usuario = new require('mongoose').Types.ObjectId();
      }
    }

    // Configurar ordenamiento
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Configurar paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const inspections = await Inspection.find(filters)
      .populate('usuario', 'nombres cargo')
      .populate('usuarioActualizacion', 'nombres cargo')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Inspection.countDocuments(filters);

    res.json({
      inspections,
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

// Ruta específica de búsqueda para el componente Search (DEBE IR ANTES DE /:id)
router.get('/search', auth, async (req, res) => {
  try {
    const { 
      numeroInterno, 
      placa, 
      fechaInicio, 
      fechaFin, 
      usuario,
      conObservaciones,
      page = 1,
      limit = 10
    } = req.query;

    // Construir filtros
    const filters = {};
    
    if (numeroInterno) {
      filters.numeroInterno = { $regex: numeroInterno, $options: 'i' };
    }
    
    if (placa) {
      filters.placa = { $regex: placa, $options: 'i' };
    }
    
    if (fechaInicio || fechaFin) {
      filters.fechaInspeccion = {};
      if (fechaInicio) {
        filters.fechaInspeccion.$gte = new Date(fechaInicio);
      }
      if (fechaFin) {
        filters.fechaInspeccion.$lte = new Date(fechaFin);
      }
    }
    
    if (usuario) {
      // Buscar por email del usuario en lugar de ObjectId
      const User = require('../models/User');
      const userDoc = await User.findOne({ email: { $regex: usuario, $options: 'i' } });
      if (userDoc) {
        filters.usuario = userDoc._id;
      } else {
        // Si no se encuentra el usuario, usar un ObjectId que no existe para que no devuelva resultados
        filters.usuario = new require('mongoose').Types.ObjectId();
      }
    }

    if (conObservaciones !== undefined && conObservaciones !== '') {
      if (conObservaciones === 'true') {
        filters.observaciones = { $exists: true, $ne: '' };
      } else if (conObservaciones === 'false') {
        filters.$or = [
          { observaciones: { $exists: false } },
          { observaciones: '' }
        ];
      }
    }

    // Configurar paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const inspections = await Inspection.find(filters)
      .populate({
        path: 'usuario',
        select: 'nombres cargo email',
        options: { strictPopulate: false }
      })
      .populate({
        path: 'usuarioActualizacion',
        select: 'nombres cargo email',
        options: { strictPopulate: false }
      })
      .sort({ fechaInspeccion: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Inspection.countDocuments(filters);

    res.json({
      results: inspections,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error en búsqueda de inspecciones:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener inspección por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id)
      .populate('usuario', 'nombres cargo')
      .populate('usuarioActualizacion', 'nombres cargo');
      
    if (!inspection) {
      return res.status(404).json({ message: 'Inspección no encontrada' });
    }
    
    res.json(inspection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Crear nueva inspección
router.post('/', [
  auth,
  authorize('Jefe de Mantenimiento', 'Técnico', 'Administrador'),
  body('numeroInterno').notEmpty().withMessage('El número interno es requerido'),
  body('placa').notEmpty().withMessage('La placa es requerida'),
  body('marca').notEmpty().withMessage('La marca es requerida'),
  body('tipo').notEmpty().withMessage('El tipo es requerido'),
  body('modelo').notEmpty().withMessage('El modelo es requerido'),
  body('kilometraje').isNumeric().withMessage('El kilometraje debe ser un número'),
  body('detallesEncontrados').notEmpty().withMessage('Los detalles encontrados son requeridos'),
  body('profundidadNeumaticos').notEmpty().withMessage('La profundidad de neumáticos es requerida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      numeroInterno,
      placa,
      marca,
      tipo,
      modelo,
      kilometraje,
      detallesEncontrados,
      profundidadNeumaticos
    } = req.body;

    // Buscar o crear vehículo
    let vehicle = await Vehicle.findOne({ 
      numeroInterno, 
      placa: placa.toUpperCase() 
    });

    if (!vehicle) {
      vehicle = new Vehicle({
        numeroInterno,
        placa: placa.toUpperCase(),
        marca,
        tipo,
        modelo
      });
      await vehicle.save();
    }

    const inspection = new Inspection({
      vehiculo: vehicle._id,
      numeroInterno,
      placa: placa.toUpperCase(),
      marca,
      tipo,
      modelo,
      kilometraje: parseInt(kilometraje),
      detallesEncontrados,
      profundidadNeumaticos,
      usuario: req.user._id
    });

    await inspection.save();
    await inspection.populate('usuario', 'nombres cargo');

    res.status(201).json({
      message: 'Inspección creada exitosamente',
      inspection
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Actualizar inspección
router.put('/:id', [
  auth,
  authorize('Jefe de Mantenimiento', 'Técnico', 'Administrador'),
  body('numeroInterno').notEmpty().withMessage('El número interno es requerido'),
  body('placa').notEmpty().withMessage('La placa es requerida'),
  body('marca').notEmpty().withMessage('La marca es requerida'),
  body('tipo').notEmpty().withMessage('El tipo es requerido'),
  body('modelo').notEmpty().withMessage('El modelo es requerido'),
  body('kilometraje').isNumeric().withMessage('El kilometraje debe ser un número'),
  body('detallesEncontrados').notEmpty().withMessage('Los detalles encontrados son requeridos'),
  body('profundidadNeumaticos').notEmpty().withMessage('La profundidad de neumáticos es requerida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      numeroInterno,
      placa,
      marca,
      tipo,
      modelo,
      kilometraje,
      detallesEncontrados,
      profundidadNeumaticos
    } = req.body;

    const inspection = await Inspection.findByIdAndUpdate(
      req.params.id,
      {
        numeroInterno,
        placa: placa.toUpperCase(),
        marca,
        tipo,
        modelo,
        kilometraje: parseInt(kilometraje),
        detallesEncontrados,
        profundidadNeumaticos,
        usuarioActualizacion: req.user._id,
        fechaActualizacion: new Date()
      },
      { new: true }
    ).populate('usuario', 'nombres cargo')
     .populate('usuarioActualizacion', 'nombres cargo');

    if (!inspection) {
      return res.status(404).json({ message: 'Inspección no encontrada' });
    }

    res.json({
      message: 'Inspección actualizada exitosamente',
      inspection
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Eliminar inspección
router.delete('/:id', [
  auth,
  authorize('Jefe de Mantenimiento', 'Administrador')
], async (req, res) => {
  try {
    const inspection = await Inspection.findByIdAndDelete(req.params.id);

    if (!inspection) {
      return res.status(404).json({ message: 'Inspección no encontrada' });
    }

    res.json({ message: 'Inspección eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});



// Endpoint temporal para debugging (sin autenticación)
router.get('/search-debug', async (req, res) => {
  try {
    console.log('=== DEBUG SEARCH ENDPOINT ===');
    console.log('Query params:', req.query);
    
    const { 
      numeroInterno, 
      placa, 
      fechaInicio, 
      fechaFin, 
      usuario,
      conObservaciones,
      page = 1,
      limit = 10
    } = req.query;

    // Construir filtros
    const filters = {};
    
    if (numeroInterno) {
      filters.numeroInterno = { $regex: numeroInterno, $options: 'i' };
      console.log('Filtro numeroInterno:', filters.numeroInterno);
    }
    
    if (placa) {
      filters.placa = { $regex: placa, $options: 'i' };
    }
    
    if (fechaInicio || fechaFin) {
      filters.fechaInspeccion = {};
      if (fechaInicio) {
        filters.fechaInspeccion.$gte = new Date(fechaInicio);
      }
      if (fechaFin) {
        filters.fechaInspeccion.$lte = new Date(fechaFin);
      }
    }
    
    if (usuario) {
      filters.usuario = usuario;
    }

    if (conObservaciones !== undefined && conObservaciones !== '') {
      if (conObservaciones === 'true') {
        filters.observaciones = { $exists: true, $ne: '' };
      } else if (conObservaciones === 'false') {
        filters.$or = [
          { observaciones: { $exists: false } },
          { observaciones: '' }
        ];
      }
    }

    console.log('Filtros construidos:', JSON.stringify(filters, null, 2));

    // Configurar paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    console.log('Paginación - skip:', skip, 'limit:', parseInt(limit));

    const inspections = await Inspection.find(filters)
      .populate('usuario', 'nombres cargo')
      .populate('usuarioActualizacion', 'nombres cargo')
      .sort({ fechaInspeccion: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    console.log('Inspecciones encontradas:', inspections.length);

    const total = await Inspection.countDocuments(filters);
    console.log('Total de documentos:', total);

    res.json({
      results: inspections,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      debug: {
        filters,
        skip,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error en búsqueda de inspecciones (DEBUG):', error);
    res.status(500).json({ 
      message: 'Error del servidor',
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;