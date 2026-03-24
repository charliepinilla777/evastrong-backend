const mongoose = require('mongoose');

const securityLogSchema = new mongoose.Schema({
  // Usuario involucrado
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true
  },
  
  // Tipo de evento
  eventType: {
    type: String,
    required: true,
    enum: [
      'login_success',
      'login_failed',
      'logout',
      'token_refresh',
      'token_expired',
      'access_denied',
      'subscription_check',
      'feature_access_denied',
      'suspicious_activity',
      'password_change',
      'account_locked',
      'admin_action',
      'security_breach'
    ]
  },
  
  // Descripción del evento
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  // Nivel de severidad
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  // Información del request
  requestInfo: {
    method: String,
    url: String,
    userAgent: String,
    ip: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  
  // Información del dispositivo
  deviceInfo: {
    platform: String,
    deviceId: String,
    browser: String,
    version: String
  },
  
  // Ubicación
  location: {
    country: String,
    city: String,
    timezone: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Detalles adicionales (flexible)
  metadata: {
    reason: String,
    errorCode: String,
    errorMessage: String,
    attemptedFeature: String,
    requiredPlan: String,
    currentPlan: String,
    tokenType: String,
    sessionId: String,
    previousAttempts: Number,
    timeWindow: String
  },
  
  // Estado de la suscripción (si aplica)
  subscriptionInfo: {
    isActive: Boolean,
    plan: String,
    expiresAt: Date,
    daysLeft: Number,
    autoRenew: Boolean
  },
  
  // Información de tokens (si aplica)
  tokenInfo: {
    tokenId: mongoose.Schema.Types.ObjectId,
    accessTokenExpires: Date,
    refreshTokenExpires: Date,
    wasRefreshed: Boolean
  },
  
  // Respuesta del servidor
  responseInfo: {
    statusCode: Number,
    responseTime: Number, // en ms
    success: Boolean
  },
  
  // Flags de seguridad
  securityFlags: {
    isSuspicious: {
      type: Boolean,
      default: false
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    requiresAction: {
      type: Boolean,
      default: false
    },
    autoResolved: {
      type: Boolean,
      default: false
    }
  },
  
  // Acciones tomadas
  actionsTaken: [{
    type: String,
    enum: [
      'none',
      'user_notified',
      'session_terminated',
      'tokens_revoked',
      'account_locked',
      'admin_alerted',
      'ip_blocked',
      'feature_blocked'
    ]
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  resolvedAt: Date,
  
  // Referencia a logs relacionados
  relatedLogs: [{
    logId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SecurityLog'
    },
    relation: String
  }]
}, { 
  timestamps: true,
  // Índices para consultas eficientes
  index: { userId: 1, createdAt: -1 },
  index: { eventType: 1, createdAt: -1 },
  index: { severity: 1, createdAt: -1 },
  index: { 'securityFlags.isSuspicious': 1, createdAt: -1 },
  index: { 'requestInfo.ip': 1, createdAt: -1 },
  index: { createdAt: 1 }, // Para TTL
  // TTL: mantener logs por 90 días
  expireAfterSeconds: 90 * 24 * 60 * 60
});

// Métodos estáticos
securityLogSchema.statics.logSecurityEvent = function(data) {
  const log = new this(data);
  return log.save();
};

securityLogSchema.statics.findSuspiciousActivity = function(userId, hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  return this.find({
    userId,
    'securityFlags.isSuspicious': true,
    createdAt: { $gte: since }
  }).sort({ createdAt: -1 });
};

securityLogSchema.statics.getSecurityStats = function(userId, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return this.aggregate([
    { $match: { userId, createdAt: { $gte: since } } },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
        lastOccurrence: { $max: '$createdAt' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

securityLogSchema.statics.detectAnomalies = function(hours = 1) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  return this.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          userId: '$userId',
          ip: '$requestInfo.ip',
          eventType: '$eventType'
        },
        count: { $sum: 1 },
        uniqueDevices: { $addToSet: '$deviceInfo.deviceId' }
      }
    },
    {
      $match: {
        $or: [
          { count: { $gt: 10 } }, // Más de 10 eventos del mismo tipo en 1 hora
          { 'uniqueDevices.2': { $exists: true } } // Múltiples dispositivos
        ]
      }
    }
  ]);
};

// Métodos de instancia
securityLogSchema.methods.markAsSuspicious = function(reason) {
  this.securityFlags.isSuspicious = true;
  this.securityFlags.requiresAction = true;
  this.metadata.reason = reason;
  return this.save();
};

securityLogSchema.methods.resolve = function(actions = []) {
  this.securityFlags.requiresAction = false;
  this.securityFlags.autoResolved = true;
  this.resolvedAt = new Date();
  this.actionsTaken = actions;
  return this.save();
};

securityLogSchema.methods.addRelatedLog = function(logId, relation) {
  this.relatedLogs.push({ logId, relation });
  return this.save();
};

// Middleware para alertas automáticas
securityLogSchema.post('save', async function(doc) {
  // Si es un evento crítico o sospechoso, podría disparar alertas
  if (doc.severity === 'critical' || doc.securityFlags.isSuspicious) {
    // Aquí podrías implementar notificaciones a admins
    console.log(`🚨 Alerta de seguridad: ${doc.eventType} - ${doc.description}`);
  }
});

module.exports = mongoose.model('SecurityLog', securityLogSchema);
