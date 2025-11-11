const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No hay token, acceso denegado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token no válido' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no válido' });
  }
};

// Middleware para verificar roles específicos
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.cargo)) {
      return res.status(403).json({ 
        message: 'No tienes permisos para realizar esta acción' 
      });
    }
    next();
  };
};

module.exports = { auth, authorize };