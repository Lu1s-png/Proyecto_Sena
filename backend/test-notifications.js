const mongoose = require('mongoose');
const ExpirationDate = require('./models/ExpirationDate');
const Vehicle = require('./models/Vehicle');
const User = require('./models/User');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/mantenimiento_expres', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function createTestNotifications() {
  try {
    console.log('Conectando a la base de datos...');
    
    // Verificar si ya existen notificaciones
    const existingCount = await ExpirationDate.countDocuments();
    console.log(`Notificaciones existentes: ${existingCount}`);
    
    if (existingCount === 0) {
      console.log('Creando datos de prueba...');
      
      // Crear usuario de prueba
      let testUser = await User.findOne({ email: 'test@test.com' });
      if (!testUser) {
        testUser = new User({
          nombres: 'Usuario de Prueba',
          cargo: 'Administrador',
          email: 'test@test.com',
          password: '123456'
        });
        await testUser.save();
        console.log('Usuario de prueba creado');
      }
      
      // Crear vehículos de prueba
      const vehicleData = [
        { numeroInterno: 'TEST001', placa: 'ABC123', marca: 'Toyota', tipo: 'Camión', modelo: 'Hilux' },
        { numeroInterno: 'TEST002', placa: 'DEF456', marca: 'Chevrolet', tipo: 'Camioneta', modelo: 'D-Max' },
        { numeroInterno: 'TEST003', placa: 'GHI789', marca: 'Ford', tipo: 'Automóvil', modelo: 'Fiesta' }
      ];
      
      const vehicles = [];
      for (const vData of vehicleData) {
        let vehicle = await Vehicle.findOne({ placa: vData.placa });
        if (!vehicle) {
          vehicle = new Vehicle(vData);
          await vehicle.save();
          console.log(`Vehículo ${vData.placa} creado`);
        }
        vehicles.push(vehicle);
      }
      
      // Crear notificaciones de prueba
      const testNotifications = [
        {
          vehiculo: vehicles[0]._id,
          numeroInterno: 'TEST001',
          placa: 'ABC123',
          tipo: 'RTM',
          fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          notificacionEnviada: false,
          usuario: testUser._id,
          activo: true
        },
        {
          vehiculo: vehicles[1]._id,
          numeroInterno: 'TEST002', 
          placa: 'DEF456',
          tipo: 'SOAT',
          fechaVencimiento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 días
          notificacionEnviada: false,
          usuario: testUser._id,
          activo: true
        },
        {
          vehiculo: vehicles[2]._id,
          numeroInterno: 'TEST003',
          placa: 'GHI789',
          tipo: 'Revisión Preventiva',
          fechaVencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
          notificacionEnviada: false,
          usuario: testUser._id,
          activo: true
        }
      ];
      
      await ExpirationDate.insertMany(testNotifications);
      console.log('Notificaciones de prueba creadas exitosamente');
    } else {
      console.log('Ya existen notificaciones en la base de datos');
    }
    
    // Mostrar todas las notificaciones
    const allNotifications = await ExpirationDate.find({});
    console.log(`Total de notificaciones: ${allNotifications.length}`);
    allNotifications.forEach((notif, index) => {
      console.log(`${index + 1}. ${notif.tipo} - ${notif.placa} - Vence: ${notif.fechaVencimiento.toLocaleDateString()}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestNotifications();