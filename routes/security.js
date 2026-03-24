const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const { verifyToken } = require('../middleware/verifyToken');
const SecurityLog = require('../models/SecurityLog');
const AccessLog = require('../models/AccessLog');
const Token = require('../models/Token');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const router = express.Router();

// Aplicar autenticación de administrador a todas las rutas
router.use(adminAuth);

// ============= ESTADÍSTICAS DE SEGURIDAD =============

// Obtener estadísticas generales de seguridad
router.get('/security/stats', async (req, res) => {
  try {
    const now = new Date();
    const last24h = new Date(now - 24 * 60 * 60 * 1000);
    const last7d = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now - 30 * 24 * 60 * 60 * 1000);

    // Eventos de seguridad
    const [totalEvents, events24h, events7d, criticalEvents] = await Promise.all([
      SecurityLog.countDocuments({ createdAt: { $gte: last30d } }),
      SecurityLog.countDocuments({ createdAt: { $gte: last24h } }),
      SecurityLog.countDocuments({ createdAt: { $gte: last7d } }),
      SecurityLog.countDocuments({ 
        severity: 'critical', 
        createdAt: { $gte: last24h } 
      })
    ]);

    // Eventos por tipo
    const eventsByType = await SecurityLog.aggregate([
      { $match: { createdAt: { $gte: last7d } } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Eventos por severidad
    const eventsBySeverity = await SecurityLog.aggregate([
      { $match: { createdAt: { $gte: last7d } } },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    // Actividad sospechosa
    const suspiciousActivity = await SecurityLog.find({
      'securityFlags.isSuspicious': true,
      createdAt: { $gte: last24h }
    }).sort({ createdAt: -1 }).limit(10);

    // Tokens activos
    const activeTokens = await Token.countDocuments({ isActive: true });
    const expiredTokens = await Token.countDocuments({ 
      isActive: false, 
      revokedAt: { $gte: last7d } 
    });

    // Logs de acceso
    const [totalAccess, deniedAccess] = await Promise.all([
      AccessLog.countDocuments({ createdAt: { $gte: last7d } }),
      AccessLog.countDocuments({ 
        result: 'denied', 
        createdAt: { $gte: last7d } 
      })
    ]);

    res.json({
      success: true,
      data: {
        events: {
          total: totalEvents,
          last24h: events24h,
          last7d: events7d,
          critical: criticalEvents,
          byType: eventsByType,
          bySeverity: eventsBySeverity
        },
        tokens: {
          active: activeTokens,
          expired: expiredTokens
        },
        access: {
          total: totalAccess,
          denied: deniedAccess,
          denialRate: totalAccess > 0 ? (deniedAccess / totalAccess * 100).toFixed(2) : 0
        },
        suspiciousActivity: suspiciousActivity.map(log => ({
          id: log._id,
          eventType: log.eventType,
          description: log.description,
          severity: log.severity,
          userId: log.userId,
          timestamp: log.createdAt,
          ip: log.requestInfo?.ip
        }))
      }
    });
  } catch (error) {
    console.error('Error en /security/stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas de seguridad'
    });
  }
});

// Obtener logs de seguridad con filtros
router.get('/security/logs', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      eventType,
      severity,
      userId,
      startDate,
      endDate,
      suspicious
    } = req.query;

    // Construir filtros
    const filters = {};
    
    if (eventType) filters.eventType = eventType;
    if (severity) filters.severity = severity;
    if (userId) filters.userId = userId;
    if (suspicious === 'true') filters['securityFlags.isSuspicious'] = true;
    
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      SecurityLog.find(filters)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      SecurityLog.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: {
        logs: logs.map(log => ({
          id: log._id,
          eventType: log.eventType,
          description: log.description,
          severity: log.severity,
          userId: log.userId,
          requestInfo: log.requestInfo,
          metadata: log.metadata,
          securityFlags: log.securityFlags,
          createdAt: log.createdAt,
          resolvedAt: log.resolvedAt
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error en /security/logs:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener logs de seguridad'
    });
  }
});

// Obtener logs de acceso
router.get('/security/access-logs', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      userId,
      feature,
      result,
      startDate,
      endDate
    } = req.query;

    const filters = {};
    
    if (userId) filters.userId = userId;
    if (feature) filters.feature = feature;
    if (result) filters.result = result;
    
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      AccessLog.find(filters)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      AccessLog.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: {
        logs: logs.map(log => ({
          id: log._id,
          userId: log.userId,
          feature: log.feature,
          accessType: log.accessType,
          result: log.result,
          denialReason: log.denialReason,
          requestInfo: log.requestInfo,
          subscriptionInfo: log.subscriptionInfo,
          securityFlags: log.securityFlags,
          createdAt: log.createdAt
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error en /security/access-logs:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener logs de acceso'
    });
  }
});

// ============= GESTIÓN DE USUARIOS =============

// Obtener usuarios con actividad sospechosa
router.get('/security/suspicious-users', async (req, res) => {
  try {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const suspiciousUsers = await SecurityLog.aggregate([
      { $match: { 
        'securityFlags.isSuspicious': true,
        createdAt: { $gte: last24h }
      }},
      { $group: {
        _id: '$userId',
        eventCount: { $sum: 1 },
        lastEvent: { $max: '$createdAt' },
        eventTypes: { $addToSet: '$eventType' },
        severity: { $max: '$severity' }
      }},
      { $sort: { eventCount: -1 } },
      { $limit: 20 }
    ]);

    // Obtener detalles de usuarios
    const userIds = suspiciousUsers.map(u => u._id);
    const users = await User.find({ _id: { $in: userIds } }, 'name email avatar createdAt lastLogin');

    const result = suspiciousUsers.map(user => {
      const userDetails = users.find(u => u._id.equals(user._id));
      return {
        userId: user._id,
        userDetails,
        eventCount: user.eventCount,
        lastEvent: user.lastEvent,
        eventTypes: user.eventTypes,
        severity: user.severity
      };
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error en /security/suspicious-users:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios sospechosos'
    });
  }
});

// Revocar todos los tokens de un usuario
router.post('/security/revoke-tokens/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason = 'admin_action' } = req.body;

    // Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Revocar tokens
    const result = await Token.revokeAllUserTokens(userId, reason);

    // Log de acción administrativa
    await SecurityLog.logSecurityEvent({
      userId: userId,
      eventType: 'admin_action',
      description: `Administrador ${req.user.email} revocó todos los tokens`,
      severity: 'medium',
      requestInfo: {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress,
        timestamp: new Date()
      },
      metadata: {
        reason,
        adminId: req.user._id,
        adminEmail: req.user.email,
        tokensRevoked: result.modifiedCount
      }
    });

    res.json({
      success: true,
      message: `Tokens revocados exitosamente (${result.modifiedCount} tokens afectados)`,
      tokensRevoked: result.modifiedCount
    });
  } catch (error) {
    console.error('Error en /security/revoke-tokens:', error);
    res.status(500).json({
      success: false,
      error: 'Error al revocar tokens'
    });
  }
});

// Suspender usuario
router.post('/security/suspend-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason, duration } = req.body; // duration en días

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Suspender usuario
    user.active = false;
    await user.save();

    // Suspender suscripción si existe
    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (subscription) {
      subscription.status = 'suspended';
      subscription.suspendedAt = new Date();
      subscription.suspensionReason = reason;
      if (duration) {
        subscription.suspensionEndsAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
      }
      await subscription.save();
    }

    // Revocar todos los tokens
    await Token.revokeAllUserTokens(userId, 'admin_action');

    // Log de acción
    await SecurityLog.logSecurityEvent({
      userId: userId,
      eventType: 'admin_action',
      description: `Usuario suspendido por administrador: ${reason}`,
      severity: 'high',
      requestInfo: {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress,
        timestamp: new Date()
      },
      metadata: {
        reason,
        duration,
        adminId: req.user._id,
        adminEmail: req.user.email
      }
    });

    res.json({
      success: true,
      message: 'Usuario suspendido exitosamente',
      suspensionInfo: {
        reason,
        duration,
        suspendedAt: new Date(),
        suspensionEndsAt: duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : null
      }
    });
  } catch (error) {
    console.error('Error en /security/suspend-user:', error);
    res.status(500).json({
      success: false,
      error: 'Error al suspender usuario'
    });
  }
});

// ============= ANÁLISIS Y REPORTES =============

// Detectar anomalías en tiempo real
router.get('/security/anomalies', async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 1;

    // Anomalías en logs de seguridad
    const securityAnomalies = await SecurityLog.detectAnomalies(hours);

    // Anomalías en logs de acceso
    const accessAnomalies = await AccessLog.detectAnomalousAccess(hours);

    res.json({
      success: true,
      data: {
        securityAnomalies,
        accessAnomalies,
        analysisTime: new Date(),
        timeWindow: `${hours} horas`
      }
    });
  } catch (error) {
    console.error('Error en /security/anomalies:', error);
    res.status(500).json({
      success: false,
      error: 'Error al detectar anomalías'
    });
  }
});

// Obtener estadísticas de uso por feature
router.get('/security/feature-usage', async (req, res) => {
  try {
    const { feature, days = 30 } = req.query;

    if (!feature) {
      return res.status(400).json({
        success: false,
        error: 'Feature requerido'
      });
    }

    const usageStats = await AccessLog.getFeatureUsageStats(feature, parseInt(days));

    res.json({
      success: true,
      data: {
        feature,
        period: `${days} días`,
        stats: usageStats
      }
    });
  } catch (error) {
    console.error('Error en /security/feature-usage:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas de uso'
    });
  }
});

// Limpiar logs antiguos
router.post('/security/cleanup', async (req, res) => {
  try {
    const { days = 90 } = req.body; // Mantener logs por N días

    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [securityDeleted, accessDeleted, tokensDeleted] = await Promise.all([
      SecurityLog.deleteMany({ createdAt: { $lt: cutoffDate } }),
      AccessLog.deleteMany({ createdAt: { $lt: cutoffDate } }),
      Token.deleteMany({ 
        isActive: false, 
        updatedAt: { $lt: cutoffDate } 
      })
    ]);

    // Log de limpieza
    await SecurityLog.logSecurityEvent({
      userId: req.user._id,
      eventType: 'admin_action',
      description: `Limpieza de logs antiguos (${days} días)`,
      severity: 'low',
      requestInfo: {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress,
        timestamp: new Date()
      },
      metadata: {
        days,
        securityLogsDeleted: securityDeleted.deletedCount,
        accessLogsDeleted: accessDeleted.deletedCount,
        tokensDeleted: tokensDeleted.deletedCount
      }
    });

    res.json({
      success: true,
      message: 'Limpieza completada exitosamente',
      deleted: {
        securityLogs: securityDeleted.deletedCount,
        accessLogs: accessDeleted.deletedCount,
        tokens: tokensDeleted.deletedCount
      }
    });
  } catch (error) {
    console.error('Error en /security/cleanup:', error);
    res.status(500).json({
      success: false,
      error: 'Error en limpieza de logs'
    });
  }
});

module.exports = router;
