'use strict';
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware de autenticación para el panel del entrenador.
 * Permite acceso a usuarios con rol 'trainer' o 'admin'.
 */
const trainerAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, error: 'Token requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!['trainer', 'admin'].includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado — se requiere rol de entrenador o administrador',
      });
    }

    const user = await User.findById(decoded.id);
    if (!user || !['trainer', 'admin'].includes(user.role)) {
      return res.status(403).json({ success: false, error: 'Acceso denegado' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expirado' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, error: 'Token inválido' });
    }
    return res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

module.exports = trainerAuth;
