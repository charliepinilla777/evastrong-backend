const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
  // Usuario
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Feature o recurso accedido
  feature: {
    type: String,
    required: true,
    index: true
  },
  
  // Tipo de acceso
  accessType: {
    type: String,
    required: true,
    enum: [
      'view',
      'create',
      'update',
      'delete',
      'download',
      'upload',
      'execute',
      'read',
      'write'
    ]
  },
  
  // Resultado del acceso
  result: {
    type: String,
    required: true,
    enum: ['granted', 'denied', 'partial'],
    default: 'granted'
  },
  
  // Razón del denegación (si aplica)
  denialReason: {
    type: String,
    enum: [
      'subscription_expired',
      'insufficient_plan',
      'feature_not_available',
      'quota_exceeded',
      'geographic_restriction',
      'time_restriction',
      'user_suspended',
      'token_invalid',
      'permission_denied',
      'rate_limit_exceeded'
    ]
  },
  
  // Información del request
  requestInfo: {
    method: String,
    url: String,
    endpoint: String,
    userAgent: String,
    ip: String,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    responseTime: Number, // en ms
    statusCode: Number
  },
  
  // Información de la suscripción al momento del acceso
  subscriptionInfo: {
    isActive: Boolean,
    plan: String,
    expiresAt: Date,
    daysLeft: Number,
    autoRenew: Boolean,
    features: [String] // Features disponibles en el plan
  },
  
  // Requerimientos del feature
  featureRequirements: {
    requiredPlan: String,
    requiredFeatures: [String],
    maxUsagePerDay: Number,
    maxUsagePerMonth: Number,
    timeRestrictions: {
      startHour: Number,
      endHour: Number,
      allowedDays: [Number] // 0-6 (Domingo-Sábado)
    },
    geographicRestrictions: [String] // Países permitidos
  },
  
  // Contadores de uso
  usageInfo: {
    dailyUsage: {
      type: Number,
      default: 0
    },
    monthlyUsage: {
      type: Number,
      default: 0
    },
    totalUsage: {
      type: Number,
      default: 0
    },
    lastResetAt: Date
  },
  
  // Metadata adicional
  metadata: {
    resourceId: String, // ID del recurso específico accedido
    resourceType: String, // Tipo de recurso (video, rutina, etc.)
    duration: Number, // Duración del acceso (para videos/streaming)
    dataSize: Number, // Tamaño de datos transferidos
    deviceInfo: {
      platform: String,
      deviceId: String,
      appVersion: String
    },
    location: {
      country: String,
      city: String,
      timezone: String
    }
  },
  
  // Flags de seguridad
  securityFlags: {
    isAnomalous: {
      type: Boolean,
      default: false
    },
    requiresReview: {
      type: Boolean,
      default: false
    },
    isFromNewLocation: {
      type: Boolean,
      default: false
    },
    isFromNewDevice: {
      type: Boolean,
      default: false
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  // Índices para consultas eficientes
  index: { userId: 1, feature: 1, createdAt: -1 },
  index: { feature: 1, result: 1, createdAt: -1 },
  index: { result: 'denied', createdAt: -1 },
  index: { 'securityFlags.requiresReview': 1, createdAt: -1 },
  index: { 'requestInfo.ip': 1, createdAt: -1 },
  // TTL: mantener logs por 30 días
  expireAfterSeconds: 30 * 24 * 60 * 60
});

// Métodos estáticos
accessLogSchema.statics.logAccess = function(data) {
  const log = new this(data);
  return log.save();
};

accessLogSchema.statics.getUserAccessStats = function(userId, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return this.aggregate([
    { $match: { userId, createdAt: { $gte: since } } },
    {
      $group: {
        _id: '$feature',
        totalAccess: { $sum: 1 },
        grantedAccess: {
          $sum: { $cond: [{ $eq: ['$result', 'granted'] }, 1, 0] }
        },
        deniedAccess: {
          $sum: { $cond: [{ $eq: ['$result', 'denied'] }, 1, 0] }
        },
        lastAccess: { $max: '$createdAt' },
        avgResponseTime: { $avg: '$requestInfo.responseTime' }
      }
    },
    { $sort: { totalAccess: -1 } }
  ]);
};

accessLogSchema.statics.getFeatureUsageStats = function(feature, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return this.aggregate([
    { $match: { feature, createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          result: '$result'
        },
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' }
      }
    },
    {
      $group: {
        _id: '$_id.date',
        stats: {
          $push: {
            result: '$_id.result',
            count: '$count',
            uniqueUsers: { $size: '$uniqueUsers' }
          }
        },
        totalAccess: { $sum: '$count' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

accessLogSchema.statics.detectAnomalousAccess = function(hours = 1) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  return this.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          userId: '$userId',
          ip: '$requestInfo.ip',
          feature: '$feature'
        },
        accessCount: { $sum: 1 },
        uniqueDevices: { $addToSet: '$metadata.deviceInfo.deviceId' },
        deniedCount: {
          $sum: { $cond: [{ $eq: ['$result', 'denied'] }, 1, 0] }
        }
      }
    },
    {
      $match: {
        $or: [
          { accessCount: { $gt: 100 } }, // Más de 100 accesos en 1 hora
          { deniedCount: { $gt: 10 } }, // Más de 10 denegaciones
          { 'uniqueDevices.2': { $exists: true } } // Múltiples dispositivos
        ]
      }
    }
  ]);
};

accessLogSchema.statics.checkUsageQuotas = function(userId, feature, period = 'daily') {
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'daily':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'monthly':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    default:
      startDate = new Date(now - 24 * 60 * 60 * 1000); // 24 horas por defecto
  }
  
  return this.aggregate([
    {
      $match: {
        userId,
        feature,
        result: 'granted',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalAccess: { $sum: 1 },
        lastAccess: { $max: '$createdAt' }
      }
    }
  ]);
};

// Métodos de instancia
accessLogSchema.methods.markAsAnomalous = function(reason) {
  this.securityFlags.isAnomalous = true;
  this.securityFlags.requiresReview = true;
  this.metadata.reason = reason;
  return this.save();
};

accessLogSchema.methods.updateUsageCount = function() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Resetear contadores si es necesario
  if (!this.usageInfo.lastResetAt || this.usageInfo.lastResetAt < today) {
    this.usageInfo.dailyUsage = 0;
    this.usageInfo.lastResetAt = today;
  }
  
  this.usageInfo.dailyUsage += 1;
  this.usageInfo.monthlyUsage += 1;
  this.usageInfo.totalUsage += 1;
  
  return this.save();
};

// Middleware para detección automática de anomalías
accessLogSchema.pre('save', function(next) {
  // Marcar como nuevo dispositivo/location si es necesario
  if (this.isNew) {
    // Aquí podrías implementar lógica para detectar nuevos dispositivos/ubicaciones
    // comparando con accesos anteriores del mismo usuario
  }
  
  next();
});

module.exports = mongoose.model('AccessLog', accessLogSchema);
