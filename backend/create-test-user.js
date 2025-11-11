const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: 'test@admin.com' });
    if (existingUser) {
      console.log('Usuario de prueba ya existe');
      await mongoose.disconnect();
      return;
    }
    
    // Crear usuario de prueba
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test123', salt);
    
    const testUser = new User({
      nombres: 'Test Admin',
      email: 'test@admin.com',
      password: hashedPassword,
      cargo: 'Administrador',
      activo: true
    });
    
    await testUser.save();
    console.log('Usuario de prueba creado exitosamente');
    console.log('Email: test@admin.com');
    console.log('Password: test123');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

createTestUser();