const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError, asyncHandler } = require('./errorHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Verificar si el token está en headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Hacer que token sea obligatorio
  if (!token) {
    return next(new AppError('No autorizado para acceder a esta ruta', 401));
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new AppError('Usuario no encontrado', 404));
    }

    next();
  } catch (error) {
    return next(new AppError('Token inválido o expirado', 401));
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('No tienes permiso para acceder a esta ruta', 403)
      );
    }
    next();
  };
};

const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (error) {
      // Token inválido, pero continuamos sin usuario
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
});

module.exports = {
  protect,
  authorize,
  optionalAuth,
};
