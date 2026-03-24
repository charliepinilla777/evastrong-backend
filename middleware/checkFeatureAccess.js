const SecurityLog = require('../models/SecurityLog');
const AccessLog = require('../models/AccessLog');

const checkFeatureAccess = (feature, accessType = 'read') => {
  return async (req, res, next) => {
    const startTime = Date.now();
    
    try {
      // Verificar que el usuario y suscripción existen
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no autenticado',
          code: 'USER_NOT_AUTHENTICATED'
        });
      }

      if (!req.subscription) {
        return res.status(403).json({
          success: false,
          error: 'Suscripción requerida',
          code: 'SUBSCRIPTION_REQUIRED'
        });
      }

      // Verificar si el usuario tiene acceso al feature
      const accessResult = req.subscription.canUseFeature(feature, accessType !== 'read');
      
      if (!accessResult.allowed) {
        // Log de acceso denegado
        await AccessLog.logAccess({
          userId: req.user._id,
          feature: feature,
          accessType: accessType,
          result: 'denied',
          denialReason: accessResult.reason,
          requestInfo: {
            method: req.method,
            url: req.originalUrl,
            userAgent: req.headers['user-agent'],
            ip: req.ip || req.connection.remoteAddress,
            timestamp: new Date(),
            responseTime: Date.now() - startTime
          },
          subscriptionInfo: {
            isActive: req.subscription.isActive(),
            plan: req.subscription.plan,
            expiresAt: req.subscription.exactEndDate,
            daysLeft: Math.floor(req.subscription.getTimeRemaining() / (1000 * 60 * 60 * 24)),
            autoRenew: req.subscription.autoRenew,
            features: req.subscription.features
          },
          featureRequirements: {
            requiredPlan: getRequiredPlanForFeature(feature),
            requiredFeatures: [feature]
          },
          metadata: {
            limit: accessResult.limit,
            current: accessResult.current
          },
          securityFlags: {
            requiresReview: accessResult.reason === 'usage_limit_exceeded'
          }
        });

        await SecurityLog.logSecurityEvent({
          userId: req.user._id,
          eventType: 'feature_access_denied',
          description: `Acceso denegado al feature ${feature}: ${accessResult.reason}`,
          severity: accessResult.reason === 'usage_limit_exceeded' ? 'medium' : 'low',
          requestInfo: {
            method: req.method,
            url: req.originalUrl,
            userAgent: req.headers['user-agent'],
            ip: req.ip || req.connection.remoteAddress,
            timestamp: new Date()
          },
          metadata: {
            attemptedFeature: feature,
            requiredPlan: getRequiredPlanForFeature(feature),
            currentPlan: req.subscription.plan,
            reason: accessResult.reason,
            limit: accessResult.limit,
            current: accessResult.current
          },
          responseInfo: {
            statusCode: 403,
            responseTime: Date.now() - startTime,
            success: false
          }
        });

        // Respuesta específica según la razón
        let errorMessage, errorCode;
        
        switch (accessResult.reason) {
          case 'feature_not_in_plan':
            errorMessage = `El feature "${feature}" no está incluido en tu plan actual`;
            errorCode = 'FEATURE_NOT_IN_PLAN';
            break;
          case 'subscription_expired':
            errorMessage = 'Tu suscripción ha expirado';
            errorCode = 'SUBSCRIPTION_EXPIRED';
            break;
          case 'usage_limit_exceeded':
            errorMessage = `Has alcanzado el límite de uso para ${feature}`;
            errorCode = 'USAGE_LIMIT_EXCEEDED';
            break;
          default:
            errorMessage = 'Acceso denegado';
            errorCode = 'ACCESS_DENIED';
        }

        return res.status(403).json({
          success: false,
          error: errorMessage,
          code: errorCode,
          feature: feature,
          subscriptionInfo: {
            currentPlan: req.subscription.plan,
            timeRemaining: req.subscription.getTimeRemainingFormatted(),
            ...(accessResult.limit && {
              usageLimit: accessResult.limit,
              currentUsage: accessResult.current
            })
          },
          upgradeUrl: getUpgradeUrlForFeature(feature)
        });
      }

      // Log de acceso exitoso
      await AccessLog.logAccess({
        userId: req.user._id,
        feature: feature,
        accessType: accessType,
        result: 'granted',
        requestInfo: {
          method: req.method,
          url: req.originalUrl,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress,
          timestamp: new Date(),
          responseTime: Date.now() - startTime
        },
        subscriptionInfo: {
          isActive: req.subscription.isActive(),
          plan: req.subscription.plan,
          expiresAt: req.subscription.exactEndDate,
          daysLeft: Math.floor(req.subscription.getTimeRemaining() / (1000 * 60 * 60 * 24)),
          autoRenew: req.subscription.autoRenew,
          features: req.subscription.features
        },
        metadata: {
          deviceInfo: {
            platform: req.headers['x-platform'] || 'unknown',
            deviceId: req.headers['x-device-id'] || 'unknown'
          }
        }
      });

      // Adjuntar información del feature al request
      req.featureAccess = {
        feature: feature,
        accessType: accessType,
        granted: true,
        subscription: req.subscription
      };

      next();
    } catch (error) {
      console.error('Error en checkFeatureAccess:', error);
      
      // Log del error
      await SecurityLog.logSecurityEvent({
        userId: req.user?._id || null,
        eventType: 'security_breach',
        description: `Error en verificación de feature: ${error.message}`,
        severity: 'high',
        requestInfo: {
          method: req.method,
          url: req.originalUrl,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress,
          timestamp: new Date()
        },
        metadata: {
          attemptedFeature: feature,
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

      return res.status(500).json({
        success: false,
        error: 'Error al verificar acceso al feature',
        code: 'FEATURE_CHECK_ERROR'
      });
    }
  };
};

// Middleware para verificar múltiples features
const checkMultipleFeatures = (features, requireAll = true) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.subscription) {
        return res.status(403).json({
          success: false,
          error: 'Autenticación y suscripción requeridas',
          code: 'AUTH_SUBSCRIPTION_REQUIRED'
        });
      }

      const results = [];
      
      for (const feature of features) {
        const result = req.subscription.canUseFeature(feature);
        results.push({
          feature,
          allowed: result.allowed,
          reason: result.reason
        });
      }

      const allowedFeatures = results.filter(r => r.allowed);
      const deniedFeatures = results.filter(r => !r.allowed);

      if (requireAll && deniedFeatures.length > 0) {
        return res.status(403).json({
          success: false,
          error: 'Se requieren todos los features para acceder',
          code: 'ALL_FEATURES_REQUIRED',
          requiredFeatures: features,
          deniedFeatures: deniedFeatures.map(f => ({
            feature: f.feature,
            reason: f.reason
          }))
        });
      }

      if (!requireAll && allowedFeatures.length === 0) {
        return res.status(403).json({
          success: false,
          error: 'Ninguno de los features requeridos está disponible',
          code: 'NO_FEATURES_AVAILABLE',
          requiredFeatures: features,
          deniedFeatures: deniedFeatures.map(f => ({
            feature: f.feature,
            reason: f.reason
          }))
        });
      }

      // Adjuntar información de features al request
      req.featureAccess = {
        features: allowedFeatures.map(f => f.feature),
        deniedFeatures: deniedFeatures,
        subscription: req.subscription
      };

      next();
    } catch (error) {
      console.error('Error en checkMultipleFeatures:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Error al verificar acceso a múltiples features',
        code: 'MULTIPLE_FEATURES_CHECK_ERROR'
      });
    }
  };
};

// Middleware para verificar acceso con límites de uso
const checkFeatureWithLimits = (feature, accessType = 'read') => {
  return async (req, res, next) => {
    try {
      // Primero verificar acceso básico
      const basicCheck = checkFeatureAccess(feature, accessType);
      return basicCheck(req, res, () => {
        // Si el acceso básico fue exitoso, verificar límites adicionales
        checkUsageLimits(req, res, next, feature);
      });
    } catch (error) {
      console.error('Error en checkFeatureWithLimits:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Error al verificar acceso con límites',
        code: 'FEATURE_LIMITS_CHECK_ERROR'
      });
    }
  };
};

// Función auxiliar para verificar límites de uso
const checkUsageLimits = async (req, res, next, feature) => {
  try {
    const subscription = req.subscription;
    const limitKey = subscription.getUsageLimitKey(feature);
    const currentKey = subscription.getCurrentUsageKey(feature);
    
    if (!limitKey || !currentKey) {
      return next(); // No hay límites definidos para este feature
    }

    const limit = subscription.usageLimits[limitKey];
    const current = subscription.currentUsage[currentKey] || 0;
    
    // Verificar si está cerca del límite (advertencia)
    const warningThreshold = limit * 0.8; // 80%
    
    if (current >= warningThreshold && current < limit) {
      // Adjuntar advertencia al response
      res.set('X-Usage-Warning', 'true');
      res.set('X-Usage-Current', current.toString());
      res.set('X-Usage-Limit', limit.toString());
      res.set('X-Usage-Remaining', (limit - current).toString());
    }
    
    if (current >= limit) {
      return res.status(429).json({
        success: false,
        error: 'Límite de uso alcanzado',
        code: 'USAGE_LIMIT_REACHED',
        feature: feature,
        usageInfo: {
          current: current,
          limit: limit,
          remaining: 0,
          resetsAt: getNextResetTime(feature)
        }
      });
    }

    next();
  } catch (error) {
    console.error('Error en checkUsageLimits:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Error al verificar límites de uso',
      code: 'USAGE_LIMITS_CHECK_ERROR'
    });
  }
};

// Funciones auxiliares
const getRequiredPlanForFeature = (feature) => {
  const featurePlanMap = {
    'basic_workouts': 'basic',
    'premium_workouts': 'premium',
    'personal_training': 'premium',
    'video_library': 'basic',
    'nutrition_plans': 'premium',
    'progress_tracking': 'free',
    'community_access': 'basic',
    'live_sessions': 'premium',
    'custom_routines': 'premium',
    'priority_support': 'premium',
    'offline_mode': 'premium',
    'hd_videos': 'premium'
  };
  
  return featurePlanMap[feature] || 'premium';
};

const getUpgradeUrlForFeature = (feature) => {
  const requiredPlan = getRequiredPlanForFeature(feature);
  return `/upgrade?plan=${requiredPlan}&feature=${feature}`;
};

const getNextResetTime = (feature) => {
  // Lógica para determinar cuándo se resetea el contador
  // Por simplicidad, asumimos reset diario a medianoche
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  return tomorrow.toISOString();
};

// Middleware para verificar acceso sin logs (para endpoints internos)
const checkFeatureAccessSilent = (feature) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.subscription) {
        return res.status(403).json({
          success: false,
          error: 'Autenticación y suscripción requeridas'
        });
      }

      const accessResult = req.subscription.canUseFeature(feature);
      
      if (!accessResult.allowed) {
        return res.status(403).json({
          success: false,
          error: 'Acceso denegado',
          reason: accessResult.reason
        });
      }

      req.featureAccess = {
        feature: feature,
        granted: true,
        subscription: req.subscription
      };

      next();
    } catch (error) {
      console.error('Error en checkFeatureAccessSilent:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Error al verificar acceso'
      });
    }
  };
};

module.exports = {
  checkFeatureAccess,
  checkMultipleFeatures,
  checkFeatureWithLimits,
  checkFeatureAccessSilent
};
