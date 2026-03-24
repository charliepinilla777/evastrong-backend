const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { verifyRefreshToken } = require('../middleware/verifyToken');
const User = require('../models/User');
const Token = require('../models/Token');
const Subscription = require('../models/Subscription');
const SecurityLog = require('../models/SecurityLog');
const router = express.Router();

// Generar tokens seguros
const generateTokens = async (userId, deviceInfo = {}) => {
  const accessTokenExpiry = 15 * 60 * 1000; // 15 minutos
  const refreshTokenExpiry = 7 * 24 * 60 * 60 * 1000; // 7 días
  
  const accessTokenPayload = {
    id: userId,
    type: 'access',
    timestamp: Date.now()
  };
  
  const refreshTokenPayload = {
    id: userId,
    type: 'refresh',
    timestamp: Date.now()
  };
  
  const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });
  
  const refreshToken = crypto.randomBytes(64).toString('hex');
  
  // Crear registro en la base de datos
  const tokenRecord = new Token({
    userId,
    accessToken,
    refreshToken,
    accessTokenExpiresAt: new Date(Date.now() + accessTokenExpiry),
    refreshTokenExpiresAt: new Date(Date.now() + refreshTokenExpiry),
    deviceInfo: {
      userAgent: deviceInfo.userAgent,
      platform: deviceInfo.platform,
      ip: deviceInfo.ip,
      deviceId: deviceInfo.deviceId
    },
    location: deviceInfo.location || {}
  });
  
  await tokenRecord.save();
  
  return {
    accessToken,
    refreshToken,
    accessTokenExpiresIn: 15 * 60, // segundos
    refreshTokenExpiresIn: 7 * 24 * 60 * 60, // segundos
    tokenInfo: {
      tokenId: tokenRecord._id,
      accessTokenExpires: tokenRecord.accessTokenExpiresAt,
      refreshTokenExpires: tokenRecord.refreshTokenExpiresAt
    }
  };
};

// Endpoint de refresh token
router.post('/refresh', verifyRefreshToken, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { refreshToken } = req.body;
    const user = req.user;
    const oldToken = req.token;
    
    // Revocar el refresh token antiguo
    await oldToken.revoke('token_refresh');
    
    // Generar nuevos tokens
    const deviceInfo = {
      userAgent: req.headers['user-agent'],
      platform: req.headers['x-platform'] || 'unknown',
      ip: req.ip || req.connection.remoteAddress,
      deviceId: req.headers['x-device-id'] || 'unknown'
    };
    
    const newTokens = await generateTokens(user._id, deviceInfo);
    
    // Log de refresh exitoso
    await SecurityLog.logSecurityEvent({
      userId: user._id,
      eventType: 'token_refresh',
      description: 'Tokens refrescados exitosamente',
      severity: 'low',
      requestInfo: {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress,
        timestamp: new Date()
      },
      tokenInfo: {
        tokenId: newTokens.tokenInfo.tokenId,
        accessTokenExpires: newTokens.tokenInfo.accessTokenExpires,
        refreshTokenExpires: newTokens.tokenInfo.refreshTokenExpires,
        wasRefreshed: true
      },
      responseInfo: {
        statusCode: 200,
        responseTime: Date.now() - startTime,
        success: true
      }
    });
    
    // Obtener información de suscripción
    const subscription = await Subscription.findActiveByUser(user._id);
    
    res.json({
      success: true,
      message: 'Tokens refrescados exitosamente',
      tokens: newTokens,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      },
      subscription: subscription ? {
        isActive: subscription.isActive(),
        plan: subscription.plan,
        timeRemaining: subscription.getTimeRemainingFormatted(),
        features: subscription.features
      } : null
    });
    
  } catch (error) {
    console.error('Error en refresh token:', error);
    
    await SecurityLog.logSecurityEvent({
      userId: req.user?._id || null,
      eventType: 'security_breach',
      description: `Error en refresh token: ${error.message}`,
      severity: 'high',
      requestInfo: {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress,
        timestamp: new Date()
      },
      metadata: {
        errorMessage: error.message
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
    
    res.status(500).json({
      success: false,
      error: 'Error al refrescar tokens',
      code: 'REFRESH_ERROR'
    });
  }
});

// Endpoint de login seguro (actualizado)
router.post('/login', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { email, password, deviceInfo = {} } = req.body;
    
    // Buscar usuario
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      await SecurityLog.logSecurityEvent({
        userId: null,
        eventType: 'login_failed',
        description: 'Usuario no encontrado',
        severity: 'medium',
        requestInfo: {
          method: req.method,
          url: req.originalUrl,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress,
          timestamp: new Date()
        },
        metadata: {
          attemptedEmail: email,
          errorMessage: 'Usuario no encontrado'
        },
        responseInfo: {
          statusCode: 401,
          responseTime: Date.now() - startTime,
          success: false
        }
      });
      
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      await SecurityLog.logSecurityEvent({
        userId: user._id,
        eventType: 'login_failed',
        description: 'Contraseña incorrecta',
        severity: 'medium',
        requestInfo: {
          method: req.method,
          url: req.originalUrl,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress,
          timestamp: new Date()
        },
        metadata: {
          attemptedEmail: email,
          errorMessage: 'Contraseña incorrecta'
        },
        responseInfo: {
          statusCode: 401,
          responseTime: Date.now() - startTime,
          success: false
        }
      });
      
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Verificar si el usuario está activo
    if (!user.active) {
      await SecurityLog.logSecurityEvent({
        userId: user._id,
        eventType: 'login_failed',
        description: 'Usuario inactivo',
        severity: 'medium',
        requestInfo: {
          method: req.method,
          url: req.originalUrl,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress,
          timestamp: new Date()
        },
        metadata: {
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
    
    // Revocar todos los tokens anteriores del usuario
    await Token.revokeAllUserTokens(user._id, 'user_login');
    
    // Generar nuevos tokens
    const fullDeviceInfo = {
      userAgent: req.headers['user-agent'],
      platform: deviceInfo.platform || req.headers['x-platform'] || 'unknown',
      ip: req.ip || req.connection.remoteAddress,
      deviceId: deviceInfo.deviceId || req.headers['x-device-id'] || 'unknown',
      location: deviceInfo.location || {}
    };
    
    const tokens = await generateTokens(user._id, fullDeviceInfo);
    
    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();
    
    // Obtener suscripción
    const subscription = await Subscription.findActiveByUser(user._id);
    
    // Log de login exitoso
    await SecurityLog.logSecurityEvent({
      userId: user._id,
      eventType: 'login_success',
      description: 'Login exitoso',
      severity: 'low',
      requestInfo: {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress,
        timestamp: new Date()
      },
      tokenInfo: {
        tokenId: tokens.tokenInfo.tokenId,
        accessTokenExpires: tokens.tokenInfo.accessTokenExpires,
        refreshTokenExpires: tokens.tokenInfo.refreshTokenExpires,
        wasRefreshed: false
      },
      responseInfo: {
        statusCode: 200,
        responseTime: Date.now() - startTime,
        success: true
      }
    });
    
    res.json({
      success: true,
      message: 'Login exitoso',
      tokens,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        fitnessLevel: user.fitnessLevel,
        goals: user.goals
      },
      subscription: subscription ? {
        isActive: subscription.isActive(),
        plan: subscription.plan,
        timeRemaining: subscription.getTimeRemainingFormatted(),
        features: subscription.features,
        usageLimits: subscription.usageLimits,
        currentUsage: subscription.currentUsage
      } : null
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      code: 'LOGIN_ERROR'
    });
  }
});

// Endpoint de logout seguro
router.post('/logout', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { refreshToken, allDevices = false } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token requerido',
        code: 'REFRESH_TOKEN_REQUIRED'
      });
    }
    
    // Buscar el refresh token
    const tokenRecord = await Token.findActiveRefreshToken(refreshToken);
    
    if (!tokenRecord) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
        code: 'TOKEN_INVALID'
      });
    }
    
    const userId = tokenRecord.userId;
    
    if (allDevices) {
      // Revocar todos los tokens del usuario
      await Token.revokeAllUserTokens(userId, 'user_logout');
      
      await SecurityLog.logSecurityEvent({
        userId: userId,
        eventType: 'logout',
        description: 'Logout de todos los dispositivos',
        severity: 'low',
        requestInfo: {
          method: req.method,
          url: req.originalUrl,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress,
          timestamp: new Date()
        },
        responseInfo: {
          statusCode: 200,
          responseTime: Date.now() - startTime,
          success: true
        }
      });
      
    } else {
      // Revocar solo el token específico
      await tokenRecord.revoke('user_logout');
      
      await SecurityLog.logSecurityEvent({
        userId: userId,
        eventType: 'logout',
        description: 'Logout de dispositivo específico',
        severity: 'low',
        requestInfo: {
          method: req.method,
          url: req.originalUrl,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress,
          timestamp: new Date()
        },
        tokenInfo: {
          tokenId: tokenRecord._id
        },
        responseInfo: {
          statusCode: 200,
          responseTime: Date.now() - startTime,
          success: true
        }
      });
    }
    
    res.json({
      success: true,
      message: allDevices ? 'Logout de todos los dispositivos exitoso' : 'Logout exitoso'
    });
    
  } catch (error) {
    console.error('Error en logout:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error al hacer logout',
      code: 'LOGOUT_ERROR'
    });
  }
});

// Endpoint para verificar token actual
router.get('/verify', async (req, res) => {
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
    
    // Buscar token activo
    const tokenRecord = await Token.findActiveAccessToken(accessToken);
    
    if (!tokenRecord) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido o expirado',
        code: 'TOKEN_INVALID'
      });
    }
    
    // Obtener suscripción
    const subscription = await Subscription.findActiveByUser(tokenRecord.userId._id);
    
    res.json({
      success: true,
      valid: true,
      user: {
        id: tokenRecord.userId._id,
        email: tokenRecord.userId.email,
        name: tokenRecord.userId.name,
        role: tokenRecord.userId.role
      },
      subscription: subscription ? {
        isActive: subscription.isActive(),
        plan: subscription.plan,
        timeRemaining: subscription.getTimeRemainingFormatted(),
        features: subscription.features
      } : null,
      tokenInfo: {
        expiresAt: tokenRecord.accessTokenExpiresAt,
        timeRemaining: tokenRecord.accessTokenExpiresAt - new Date()
      }
    });
    
  } catch (error) {
    console.error('Error en verify:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error al verificar token',
      code: 'VERIFY_ERROR'
    });
  }
});

module.exports = router;
