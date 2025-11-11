const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');

// Importar rutas
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const inspectionRoutes = require('./routes/inspections');
const dateRoutes = require('./routes/dates');
const notificationRoutes = require('./routes/notifications');

// Importar servicios
const notificationService = require('./services/notificationService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mantenimiento_expres', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/dates', dateRoutes);
app.use('/api/notifications', notificationRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API MantenimientoExprés funcionando correctamente' });
});

// Endpoint de salud
app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexión a MongoDB
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
    
    res.json({
      status: 'ok',
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});



// Programar verificación de notificaciones cada día a las 8:00 AM
cron.schedule('0 8 * * *', () => {
  console.log('Verificando fechas de vencimiento...');
  notificationService.checkExpiringDates();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});