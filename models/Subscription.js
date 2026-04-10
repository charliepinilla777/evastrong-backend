const mongoose = require('mongoose');

// Features incluidas por plan
const PLAN_FEATURES = {
  basic: [
    'basic_workouts',
    'video_library',
    'progress_tracking',
    'community_access',
  ],
  premium: [
    'basic_workouts',
    'premium_workouts',
    'personal_training',
    'video_library',
    'nutrition_plans',
    'progress_tracking',
    'community_access',
    'live_sessions',
    'custom_routines',
    'priority_support',
    'offline_mode',
    'hd_videos',
  ],
};

// Límites de uso por plan (-1 = ilimitado)
const PLAN_USAGE_LIMITS = {
  basic:   { routinesLimit: 5,  dietsLimit: 3  },
  premium: { routinesLimit: -1, dietsLimit: -1 },
};

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Plan
  plan: {
    type: String,
    enum: ['basic', 'premium'],
    required: true,
  },

  // Período
  period: {
    type: String,
    enum: ['monthly', 'annual'],
    default: 'monthly',
  },

  // Fechas
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: Date,
  nextBillingDate: Date,

  // Estado
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'pending',
  },

  // Features del plan (se pobla automáticamente al guardar)
  features: {
    type: [String],
    default: [],
  },

  // Límites de uso del plan
  usageLimits: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

  // Uso actual del período
  currentUsage: {
    customRoutineCount: { type: Number, default: 0 },
    customDietCount:    { type: Number, default: 0 },
  },

  // Mercado Pago
  mercadoPagoSubscriptionId: String,
  mercadoPagoCustomerId: String,

  // Precio
  amount: Number,
  currency: {
    type: String,
    default: 'ARS',
  },

  // Auto-renovación
  autoRenew: {
    type: Boolean,
    default: true,
  },

  // Recordatorios enviados
  reminderSent5d: {
    type: Boolean,
    default: false,
  },

  // Cancelación
  cancelledAt: Date,
  cancelReason: String,

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Índices para búsquedas frecuentes
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ userId: 1, endDate: 1 });
subscriptionSchema.index({ status: 1, endDate: -1 });

// Virtual: alias de endDate usado por los middlewares
subscriptionSchema.virtual('exactEndDate').get(function () {
  return this.endDate;
});

// Pre-save: sincronizar features y usageLimits con el plan actual
subscriptionSchema.pre('save', function (next) {
  if (this.isModified('plan') || this.isNew) {
    this.features    = PLAN_FEATURES[this.plan]    || [];
    this.usageLimits = PLAN_USAGE_LIMITS[this.plan] || {};
  }
  next();
});

// ─── Static methods ───────────────────────────────────────────────────────────

/** Devuelve la suscripción activa (o en gracia) de un usuario, o null */
subscriptionSchema.statics.findActiveByUser = function (userId) {
  const now = new Date();
  return this.findOne({
    userId,
    status: { $in: ['active', 'expired'] },
    endDate: { $gt: new Date(now - 3 * 24 * 60 * 60 * 1000) }, // incluye 3 días de gracia
  }).sort({ endDate: -1 });
};

// ─── Instance methods ─────────────────────────────────────────────────────────

/** ¿La suscripción está vigente ahora mismo? */
subscriptionSchema.methods.isActive = function () {
  return this.status === 'active' && this.endDate && new Date() < new Date(this.endDate);
};

/** ¿Está dentro del período de gracia (3 días tras expirar)? */
subscriptionSchema.methods.isInGracePeriod = function () {
  if (!this.endDate) return false;
  const msElapsed = Date.now() - new Date(this.endDate).getTime();
  return this.status === 'expired' && msElapsed >= 0 && msElapsed < 3 * 24 * 60 * 60 * 1000;
};

/** Milisegundos restantes hasta endDate (0 si ya expiró) */
subscriptionSchema.methods.getTimeRemaining = function () {
  if (!this.endDate) return 0;
  return Math.max(0, new Date(this.endDate).getTime() - Date.now());
};

/** Texto legible del tiempo restante */
subscriptionSchema.methods.getTimeRemainingFormatted = function () {
  const ms = this.getTimeRemaining();
  if (ms <= 0) return 'Expirada';
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days} día${days !== 1 ? 's' : ''}`;
  const hours = Math.floor(ms / (1000 * 60 * 60));
  return `${hours} hora${hours !== 1 ? 's' : ''}`;
};

/**
 * ¿El usuario puede usar este feature?
 * @param {string} feature  - nombre del feature (ej. 'custom_routines')
 * @param {boolean} isWrite - true cuando la acción consume cuota
 * @returns {{ allowed: boolean, reason?: string, limit?: number, current?: number }}
 */
subscriptionSchema.methods.canUseFeature = function (feature, isWrite = false) {
  if (!this.isActive() && !this.isInGracePeriod()) {
    return { allowed: false, reason: 'subscription_expired' };
  }

  const planFeatures = PLAN_FEATURES[this.plan] || [];
  if (!planFeatures.includes(feature)) {
    return { allowed: false, reason: 'feature_not_in_plan' };
  }

  if (isWrite) {
    const limitKey   = this.getUsageLimitKey(feature);
    const currentKey = this.getCurrentUsageKey(feature);
    if (limitKey && currentKey) {
      const limit   = (this.usageLimits || {})[limitKey] ?? -1;
      const current = (this.currentUsage || {})[currentKey] ?? 0;
      if (limit !== -1 && current >= limit) {
        return { allowed: false, reason: 'usage_limit_exceeded', limit, current };
      }
    }
  }

  return { allowed: true };
};

/** Devuelve la clave del límite en usageLimits para este feature */
subscriptionSchema.methods.getUsageLimitKey = function (feature) {
  const map = {
    custom_routines: 'routinesLimit',
    custom_diets:    'dietsLimit',
  };
  return map[feature] ?? null;
};

/** Devuelve la clave del contador actual en currentUsage para este feature */
subscriptionSchema.methods.getCurrentUsageKey = function (feature) {
  const map = {
    custom_routines: 'customRoutineCount',
    custom_diets:    'customDietCount',
  };
  return map[feature] ?? null;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
