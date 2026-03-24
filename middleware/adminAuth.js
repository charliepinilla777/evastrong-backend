const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
  try {
    // Obtener token del header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Token requerido' 
      });
    }
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar rol de administrador
    if (decoded.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Acceso denegado - Se requiere rol de administrador' 
      });
    }
    
    // Buscar usuario
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'Usuario no encontrado' 
      });
    }
    
    // Verificar que el usuario siga siendo administrador
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Acceso denegado - Privilegios de administrador revocados' 
      });
    }
    
    // Adjuntar usuario al request
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en autenticación de administrador:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expirado' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token inválido' 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

module.exports = adminAuth;
