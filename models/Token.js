const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Tokens
  accessToken: {
    type: String,
    required: true,
    unique: true
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true
  },
  
  // Expiración
  accessTokenExpiresAt: {
    type: Date,
    required: true
  },
  refreshTokenExpiresAt: {
    type: Date,
    required: true
  },
  
  // Estado
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Información del dispositivo
  deviceInfo: {
    userAgent: String,
    platform: String,
    ip: String,
    deviceId: String
  },
  
  // Ubicación (opcional)
  location: {
    country: String,
    city: String,
    timezone: String
  },
  
  // Control de sesión
  lastUsedAt: {
    type: Date,
    default: Date.now
  },
  usageCount: {
    type: Number,
    default: 0
  },
  
  // Revocación
  revokedAt: Date,
  revokeReason: {
    type: String,
    enum: ['user_logout', 'admin_action', 'security_breach', 'expired', 'password_change']
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices compuestos para búsquedas de tokens activos
tokenSchema.index({ userId: 1, isActive: 1 });
tokenSchema.index({ refreshToken: 1, isActive: 1 });
tokenSchema.index({ accessToken: 1 });
tokenSchema.index({ accessTokenExpiresAt: 1 });
tokenSchema.index({ refreshTokenExpiresAt: 1 });
// TTL: elimina automáticamente tokens inactivos después de 30 días
tokenSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60, partialFilterExpression: { isActive: false } }
);

// Métodos estáticos
tokenSchema.statics.findActiveRefreshToken = function(refreshToken) {
  return this.findOne({
    refreshToken,
    isActive: true,
    refreshTokenExpiresAt: { $gt: new Date() }
  }).populate('userId');
};

tokenSchema.statics.findActiveAccessToken = function(accessToken) {
  return this.findOne({
    accessToken,
    isActive: true,
    accessTokenExpiresAt: { $gt: new Date() }
  }).populate('userId');
};

tokenSchema.statics.revokeAllUserTokens = function(userId, reason = 'user_logout') {
  return this.updateMany(
    { userId, isActive: true },
    { 
      isActive: false,
      revokedAt: new Date(),
      revokeReason: reason,
      updatedAt: new Date()
    }
  );
};

// Métodos de instancia
tokenSchema.methods.isAccessTokenValid = function() {
  return this.isActive && this.accessTokenExpiresAt > new Date();
};

tokenSchema.methods.isRefreshTokenValid = function() {
  return this.isActive && this.refreshTokenExpiresAt > new Date();
};

tokenSchema.methods.revoke = function(reason = 'user_logout') {
  this.isActive = false;
  this.revokedAt = new Date();
  this.revokeReason = reason;
  this.updatedAt = new Date();
  return this.save();
};

tokenSchema.methods.updateUsage = function() {
  this.lastUsedAt = new Date();
  this.usageCount += 1;
  return this.save();

};

// Middleware para limpieza automática
tokenSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método para limpiar tokens expirados (cron job)
tokenSchema.statics.cleanupExpiredTokens = function() {
  return this.deleteMany({
    $or: [
      { accessTokenExpiresAt: { $lt: new Date() } },
      { refreshTokenExpiresAt: { $lt: new Date() } },
      { isActive: false, updatedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } // 30 días
    ]
  });
};

module.exports = mongoose.model('Token', tokenSchema);
