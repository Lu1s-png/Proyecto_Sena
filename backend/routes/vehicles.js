const express = require('express');
const { body, validationResult } = require('express-validator');
const Vehicle = require('../models/Vehicle');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los vehículos
router.get('/', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ activo: true }).sort({ fechaCreacion: -1 });
    res.json(vehicles);
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
      marca, 
      tipo, 
      tipoVehiculo,
      modelo,
      activo,
      page = 1,
      limit = 10
    } = req.query;

    // Construir filtros
    const filters = {};

    // Activo: por defecto true, pero respeta 'activo=false' si se envía
    if (typeof activo !== 'undefined') {
      const val = String(activo).toLowerCase();
      filters.activo = val === 'true' || val === '1';
    } else {
      filters.activo = true;
    }
    
    if (numeroInterno) {
      filters.numeroInterno = { $regex: numeroInterno, $options: 'i' };
    }
    
    if (placa) {
      filters.placa = { $regex: placa, $options: 'i' };
    }
    
    if (marca) {
      filters.marca = { $regex: marca, $options: 'i' };
    }
    
    const tipoQuery = tipo || tipoVehiculo;
    if (tipoQuery) {
      filters.tipo = { $regex: tipoQuery, $options: 'i' };
    }
    
    if (modelo) {
      filters.modelo = { $regex: modelo, $options: 'i' };
    }

    // Configurar paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const vehicles = await Vehicle.find(filters)
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Vehicle.countDocuments(filters);

    res.json({
      results: vehicles,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error en búsqueda de vehículos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener vehículo por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }
    res.json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Crear nuevo vehículo
router.post('/', [
  auth,
  authorize('Jefe de Mantenimiento', 'Técnico', 'Administrador'),
  body('numeroInterno').notEmpty().withMessage('El número interno es requerido'),
  body('placa').notEmpty().withMessage('La placa es requerida'),
  body('marca').notEmpty().withMessage('La marca es requerida'),
  body('tipo').notEmpty().withMessage('El tipo es requerido'),
  body('modelo').notEmpty().withMessage('El modelo es requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { numeroInterno, placa, marca, tipo, modelo } = req.body;

    // Verificar si ya existe un vehículo con el mismo número interno o placa
    const existingVehicle = await Vehicle.findOne({
      $or: [{ numeroInterno }, { placa: placa.toUpperCase() }]
    });

    if (existingVehicle) {
      return res.status(400).json({ 
        message: 'Ya existe un vehículo con ese número interno o placa' 
      });
    }

    const vehicle = new Vehicle({
      numeroInterno,
      placa: placa.toUpperCase(),
      marca,
      tipo,
      modelo
    });

    await vehicle.save();

    res.status(201).json({
      message: 'Vehículo creado exitosamente',
      vehicle
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Actualizar vehículo
router.put('/:id', [
  auth,
  authorize('Jefe de Mantenimiento', 'Técnico', 'Administrador'),
  body('numeroInterno').notEmpty().withMessage('El número interno es requerido'),
  body('placa').notEmpty().withMessage('La placa es requerida'),
  body('marca').notEmpty().withMessage('La marca es requerida'),
  body('tipo').notEmpty().withMessage('El tipo es requerido'),
  body('modelo').notEmpty().withMessage('El modelo es requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { numeroInterno, placa, marca, tipo, modelo } = req.body;

    // Verificar si existe otro vehículo con el mismo número interno o placa
    const existingVehicle = await Vehicle.findOne({
      _id: { $ne: req.params.id },
      $or: [{ numeroInterno }, { placa: placa.toUpperCase() }]
    });

    if (existingVehicle) {
      return res.status(400).json({ 
        message: 'Ya existe otro vehículo con ese número interno o placa' 
      });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        numeroInterno,
        placa: placa.toUpperCase(),
        marca,
        tipo,
        modelo
      },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }

    res.json({
      message: 'Vehículo actualizado exitosamente',
      vehicle
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Eliminar vehículo (soft delete)
router.delete('/:id', [
  auth,
  authorize('Jefe de Mantenimiento', 'Administrador')
], async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }

    res.json({ message: 'Vehículo eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});


module.exports = router;