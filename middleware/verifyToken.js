const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
const User = require('../models/User');
const SecurityLog = require('../models/SecurityLog');

const verifyToken = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      await SecurityLog.logSecurityEvent({
        userId: null,
        eventType: 'access_denied',
        description: 'Token no proporcionado o formato inválido',
        severity: 'medium',
        requestInfo: {
          method: req.method,
          url: req.originalUrl,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress,
          timestamp: new Date()
        },
        metadata: {
          attemptedFeature: req.originalUrl,
          errorMessage: 'Token no proporcionado'
        },
        responseInfo: {
          statusCode: 401,
          responseTime: Date.now() - startTime,
          success: false
        }
      });
      
      return res.status(401).json({
        success: false,
        error: 'Token requerido',
        code: 'TOKEN_REQUIRED'
      });
    }

    const accessToken = authHeader.substring(7);
    
    // Buscar token activo en la base de datos
    const tokenRecord = await Token.findActiveAccessToken(accessToken);
    
    if (!tokenRecord) {
      await SecurityLog.logSecurityEvent({
        userId: null,
        eventType: 'access_denied',
        description: 'Token no encontrado o inválido',
        severity: 'high',
        requestInfo: {
          method: req.method,
          url: req.originalUrl,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress,
          timestamp: new Date()
        },
        metadata: {
          attemptedFeature: req.originalUrl,
          errorMessage: 'Token inválido o expirado'
        },
        responseInfo: {
          statusCode: 401,
          responseTime: Date.now() - startTime,
          success: false
        }
      });
      
      return res.status(401).json({
        success: false,
        error: 'Token inválido o expirado',
        code: 'TOKEN_INVALID'
      });
    }

    // Verificar si el usuario está activo
    if (!tokenRecord.userId.active) {
      await SecurityLog.logSecurityEvent({
        userId: tokenRecord.userId._id,
        eventType: 'access_denied',
        description: 'Usuario inactivo intentando acceder',
        severity: 'high',
        requestInfo: {
          method: req.method,
          url: req.originalUrl,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress,
          timestamp: new Date()
        },
        metadata: {
          attemptedFeature: req.originalUrl,
          errorMessage: 'Usuario inactivo'
        },
        responseInfo: {
          statusCode: 401,
          responseTime: Date.now() - startTime,
          success: false
        }
      });
      
      return res.status(401).json({
        success: false,
        error: 'Usuario inactivo',
        code: 'USER_INACTIVE'
      });
    }

    // Actualizar uso del token
    await tokenRecord.updateUsage();
    
    // Adjuntar información al request
    req.user = tokenRecord.userId;
    req.token = tokenRecord;
    req.tokenInfo = {
      tokenId: tokenRecord._id,
      accessTokenExpires: tokenRecord.accessTokenExpiresAt,
      refreshTokenExpires: tokenRecord.refreshTokenExpiresAt
    };

    // Log de acceso exitoso
    await SecurityLog.logSecurityEvent({
      userId: tokenRecord.userId._id,
      eventType: 'login_success', // Podría ser 'access_granted' para ser más específico
      description: `Acceso autorizado a ${req.originalUrl}`,
      severity: 'low',
      requestInfo: {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress,
        timestamp: new Date()
      },
      tokenInfo: {
        tokenId: tokenRecord._id,
        accessTokenExpires: tokenRecord.accessTokenExpiresAt,
        refreshTokenExpires: tokenRecord.refreshTokenExpiresAt,
        wasRefreshed: false
      },
      responseInfo: {
        statusCode: 200, // Asumimos éxito hasta que la ruta responda
        responseTime: Date.now() - startTime,
        success: true
      }
    });

    next();
  } catch (error) {
    console.error('Error en verifyToken:', error);
    
    // Log del error
    await SecurityLog.logSecurityEvent({
      userId: req.user?._id || null,
      eventType: 'security_breach',
      description: `Error en verificación de token: ${error.message}`,
      severity: 'critical',
      requestInfo: {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress,
        timestamp: new Date()
      },
      metadata: {
        errorMessage: error.message,
        errorCode: error.code,
        attemptedFeature: req.originalUrl
      },
      responseInfo: {
        statusCode: 500,
        responseTime: Date.now() - startTime,
        success: false
      },
      securityFlags: {
        isSuspicious: true,
        requiresAction: true
      }
    });

    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Middleware opcional para verificar refresh token
const verifyRefreshToken = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token requerido',
        code: 'REFRESH_TOKEN_REQUIRED'
      });
    }

    // Buscar refresh token activo
    const tokenRecord = await Token.findActiveRefreshToken(refreshToken);
    
    if (!tokenRecord) {
      await SecurityLog.logSecurityEvent({
        userId: null,
        eventType: 'token_expired',
        description: 'Refresh token inválido o expirado',
        severity: 'medium',
        requestInfo: {
          method: req.method,
          url: req.originalUrl,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress,
          timestamp: new Date()
        },
        metadata: {
          errorMessage: 'Refresh token inválido'
        },
        responseInfo: {
          statusCode: 401,
          responseTime: Date.now() - startTime,
          success: false
        }
      });
      
      return res.status(401).json({
        success: false,
        error: 'Refresh token inválido o expirado',
        code: 'REFRESH_TOKEN_INVALID'
      });
    }

    // Verificar si el usuario está activo
    if (!tokenRecord.userId.active) {
      return res.status(401).json({
        success: false,
        error: 'Usuario inactivo',
        code: 'USER_INACTIVE'
      });
    }

    // Adjuntar información al request
    req.user = tokenRecord.userId;
    req.token = tokenRecord;

    next();
  } catch (error) {
    console.error('Error en verifyRefreshToken:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Middleware para verificar tokens sin logs (para endpoints internos)
const verifyTokenSilent = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token requerido',
        code: 'TOKEN_REQUIRED'
      });
    }

    const accessToken = authHeader.substring(7);
    
    // Verificar token JWT
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    
    // Buscar usuario
    const user = await User.findById(decoded.id);
    if (!user || !user.active) {
      return res.status(401).json({
        success: false,
        error: 'Usuario inválido',
        code: 'USER_INVALID'
      });
    }

    // Adjuntar usuario al request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
        code: 'TOKEN_INVALID'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

module.exports = {
  verifyToken,
  verifyRefreshToken,
  verifyTokenSilent
};
