const mongoose = require('mongoose');
const ExpirationDate = require('./models/ExpirationDate');
const Vehicle = require('./models/Vehicle');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/mantenimiento_expres', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function checkNotifications() {
  try {
    console.log('Verificando notificaciones...');
    
    const notifications = await ExpirationDate.find()
      .populate('vehiculo')
      .populate('usuario');
    
    console.log(`Notificaciones encontradas: ${notifications.length}`);
    
    notifications.forEach((n, i) => {
      console.log(`${i+1}. ${n.tipo} - ${n.placa} - Usuario: ${n.usuario ? n.usuario.nombres : 'Sin usuario'} - Activo: ${n.activo}`);
    });
    
    // También verificar sin populate
    const rawNotifications = await ExpirationDate.find();
    console.log(`\nNotificaciones sin populate: ${rawNotifications.length}`);
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkNotifications();