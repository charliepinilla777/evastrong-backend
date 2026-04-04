const express = require('express');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ========== OBTENER SUSCRIPCIÓN ACTUAL ==========

router.get('/current', authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id }).lean();

    if (!subscription) {
      return res.json({
        success: true,
        subscription: null,
        message: 'Usuario sin suscripción',
      });
    }

    // Verificar si expiró — actualizar solo si realmente cambió de estado
    // para no escribir en DB en cada lectura (evita N+1 writes)
    const isExpired = subscription.status === 'active' && new Date() > subscription.endDate;
    if (isExpired) {
      await Subscription.updateOne(
        { _id: subscription._id },
        { $set: { status: 'expired' } }
      );
      subscription.status = 'expired';
    }

    res.json({
      success: true,
      subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ========== OBTENER HISTORIAL DE SUSCRIPCIONES ==========

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ========== CAMBIAR PLAN ==========

router.post('/change-plan', authMiddleware, async (req, res) => {
  try {
    const { newPlan } = req.body;
    
    if (!['basic', 'premium'].includes(newPlan)) {
      return res.status(400).json({
        success: false,
        message: 'Plan inválido',
      });
    }
    
    const subscription = await Subscription.findOne({ userId: req.user._id });
    
    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: 'Usuario sin suscripción activa',
      });
    }
    
    if (subscription.plan === newPlan) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes este plan',
      });
    }
    
    // Actualizar ambos modelos en paralelo (atómico, evita inconsistencia si uno falla)
    await Promise.all([
      Subscription.updateOne({ _id: subscription._id }, { plan: newPlan }),
      User.updateOne({ _id: req.user._id }, { 'subscription.plan': newPlan }),
    ]);

    subscription.plan = newPlan; // refleja el cambio en la respuesta

    res.json({
      success: true,
      message: 'Plan cambiado exitosamente',
      subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ========== CANCELAR SUSCRIPCIÓN ==========

router.post('/cancel', authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const subscription = await Subscription.findOne({ userId: req.user._id });
    
    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: 'Usuario sin suscripción',
      });
    }
    
    if (subscription.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Suscripción ya está cancelada',
      });
    }
    
    // Cancelar suscripción
    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.cancelReason = reason || 'Cancelación por usuario';
    subscription.autoRenew = false;
    await subscription.save();
    
    // Actualizar usuario
    const user = await User.findById(req.user._id);
    user.subscription.active = false;
    await user.save();
    
    res.json({
      success: true,
      message: 'Suscripción cancelada',
      subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ========== RENOVAR SUSCRIPCIÓN ==========

router.post('/renew', authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });
    
    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: 'Usuario sin suscripción',
      });
    }
    
    // Calcular nuevas fechas
    const newEndDate = new Date(subscription.endDate);
    if (subscription.period === 'monthly') {
      newEndDate.setMonth(newEndDate.getMonth() + 1);
    } else {
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    }

    // Actualizar Subscription y User en paralelo (evita inconsistencia)
    await Promise.all([
      Subscription.updateOne(
        { _id: subscription._id },
        { endDate: newEndDate, nextBillingDate: newEndDate, status: 'active' }
      ),
      User.updateOne(
        { _id: req.user._id },
        {
          subscriptionStatus: 'active',
          'subscription.active':  true,
          'subscription.endDate': newEndDate,
        }
      ),
    ]);

    subscription.endDate = newEndDate;
    subscription.status  = 'active';

    res.json({
      success: true,
      message: 'Suscripción renovada',
      subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
