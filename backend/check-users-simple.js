const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');
    
    const users = await User.find({}, 'nombres email cargo activo');
    console.log('\nUsuarios en la base de datos:');
    users.forEach(user => {
      console.log(`- Email: ${user.email}, Nombre: ${user.nombres}, Cargo: ${user.cargo}, Activo: ${user.activo}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();