const Subscription = require('../models/Subscription');
const SecurityLog = require('../models/SecurityLog');
const AccessLog = require('../models/AccessLog');

const checkSubscription = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    // Verificar que el usuario existe en el request (debe pasar por verifyToken primero)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado',
        code: 'USER_NOT_AUTHENTICATED'
      });
    }

    // Buscar suscripción activa del usuario
    const subscription = await Subscription.findActiveByUser(req.user._id);
    
    if (!subscription) {
      // Log de acceso denegado por falta de suscripción
      await AccessLog.logAccess({
        userId: req.user._id,
        feature: req.originalUrl,
        accessType: 'read',
        result: 'denied',
        denialReason: 'subscription_expired',
        requestInfo: {
          method: req.method,
          url: req.originalUrl,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress,
          timestamp: new Date(),
          responseTime: Date.now() - startTime
        },
        subscriptionInfo: {
          isActive: false,
          plan: 'none',
          expiresAt: null,
          daysLeft: 0,
          autoRenew: false
        },
        securityFlags: {
          requiresReview: false
        }
      });

      await SecurityLog.logSecurityEvent({
        userId: req.user._id,
        eventType: 'access_denied',
        description: 'Usuario sin suscripción activa intentando acceder',
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
          currentPlan: 'none',
          requiredPlan: 'basic_or_premium'
        },
        responseInfo: {
          statusCode: 403,
          responseTime: Date.now() - startTime,
          success: false
        }
      });

      return res.status(403).json({
        success: false,
        error: 'Suscripción requerida',
        code: 'SUBSCRIPTION_REQUIRED',
        message: 'Esta función requiere una suscripción activa',
        subscriptionInfo: {
          isActive: false,
          plan: 'none',
          timeRemaining: 'Expirada'
        }
      });
    }

    // Verificar si la suscripción está realmente activa (doble verificación)
    if (!subscription.isActive() && !subscription.isInGracePeriod()) {
      await AccessLog.logAccess({
        userId: req.user._id,
        feature: req.originalUrl,
        accessType: 'read',
        result: 'denied',
        denialReason: 'subscription_expired',
        requestInfo: {
          method: req.method,
          url: req.originalUrl,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress,
          timestamp: new Date(),
          responseTime: Date.now() - startTime
        },
        subscriptionInfo: {
          isActive: subscription.isActive(),
          plan: subscription.plan,
          expiresAt: subscription.exactEndDate,
          daysLeft: Math.floor(subscription.getTimeRemaining() / (1000 * 60 * 60 * 24)),
          autoRenew: subscription.autoRenew
        }
      });

      return res.status(403).json({
        success: false,
        error: 'Suscripción expirada',
        code: 'SUBSCRIPTION_EXPIRED',
        message: 'Tu suscripción ha expirado. Por favor, renuévala para continuar.',
        subscriptionInfo: {
          isActive: false,
          plan: subscription.plan,
          timeRemaining: subscription.getTimeRemainingFormatted(),
          expiredAt: subscription.exactEndDate
        }
      });
    }

    // Adjuntar información de suscripción al request
    req.subscription = subscription;
    req.subscriptionInfo = {
      isActive: subscription.isActive(),
      plan: subscription.plan,
      timeRemaining: subscription.getTimeRemaining(),
      timeRemainingFormatted: subscription.getTimeRemainingFormatted(),
      features: subscription.features,
      usageLimits: subscription.usageLimits,
      currentUsage: subscription.currentUsage
    };

    // Log de acceso exitoso
    await AccessLog.logAccess({
      userId: req.user._id,
      feature: req.originalUrl,
      accessType: 'read',
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
        isActive: subscription.isActive(),
        plan: subscription.plan,
        expiresAt: subscription.exactEndDate,
        daysLeft: Math.floor(subscription.getTimeRemaining() / (1000 * 60 * 60 * 24)),
        autoRenew: subscription.autoRenew,
        features: subscription.features
      }
    });

    next();
  } catch (error) {
    console.error('Error en checkSubscription:', error);
    
    // Log del error
    await SecurityLog.logSecurityEvent({
      userId: req.user?._id || null,
      eventType: 'security_breach',
      description: `Error en verificación de suscripción: ${error.message}`,
      severity: 'high',
      requestInfo: {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress,
        timestamp: new Date()
      },
      metadata: {
        errorMessage: error.message,
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
      error: 'Error al verificar suscripción',
      code: 'SUBSCRIPTION_CHECK_ERROR'
    });
  }
};

// Middleware para verificar suscripción específica (basic/premium)
const checkSubscriptionLevel = (requiredPlan) => {
  return async (req, res, next) => {
    const startTime = Date.now();
    
    try {
      // Primero verificar que tenga suscripción activa
      if (!req.subscription) {
        return res.status(403).json({
          success: false,
          error: 'Suscripción requerida',
          code: 'SUBSCRIPTION_REQUIRED'
        });
      }

      const userPlan = req.subscription.plan;
      const planHierarchy = { free: 0, basic: 1, premium: 2 };
      
      if (planHierarchy[userPlan] < planHierarchy[requiredPlan]) {
        await AccessLog.logAccess({
          userId: req.user._id,
          feature: req.originalUrl,
          accessType: 'read',
          result: 'denied',
          denialReason: 'insufficient_plan',
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
            plan: userPlan,
            expiresAt: req.subscription.exactEndDate,
            daysLeft: Math.floor(req.subscription.getTimeRemaining() / (1000 * 60 * 60 * 24)),
            autoRenew: req.subscription.autoRenew
          },
          metadata: {
            requiredPlan: requiredPlan,
            currentPlan: userPlan
          }
        });

        return res.status(403).json({
          success: false,
          error: 'Plan insuficiente',
          code: 'INSUFFICIENT_PLAN',
          message: `Esta función requiere el plan ${requiredPlan}`,
          subscriptionInfo: {
            currentPlan: userPlan,
            requiredPlan: requiredPlan,
            upgradeUrl: '/upgrade'
          }
        });
      }

      next();
    } catch (error) {
      console.error('Error en checkSubscriptionLevel:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Error al verificar nivel de suscripción',
        code: 'PLAN_CHECK_ERROR'
      });
    }
  };
};

// Middleware para verificar suscripción sin logs (para endpoints internos)
const checkSubscriptionSilent = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const subscription = await Subscription.findActiveByUser(req.user._id);
    
    if (!subscription || (!subscription.isActive() && !subscription.isInGracePeriod())) {
      return res.status(403).json({
        success: false,
        error: 'Suscripción activa requerida'
      });
    }

    req.subscription = subscription;
    next();
  } catch (error) {
    console.error('Error en checkSubscriptionSilent:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Error al verificar suscripción'
    });
  }
};

module.exports = {
  checkSubscription,
  checkSubscriptionLevel,
  checkSubscriptionSilent
};
