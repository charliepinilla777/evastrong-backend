const express = require('express');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ========== OBTENER SUSCRIPCIÓN ACTUAL ==========

router.get('/current', authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });
    
    if (!subscription) {
      return res.json({
        success: true,
        subscription: null,
        message: 'Usuario sin suscripción',
      });
    }
    
    // Verificar si expiró
    if (subscription.status === 'active' && new Date() > subscription.endDate) {
      subscription.status = 'expired';
      await subscription.save();
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
    
    // Cambiar plan
    subscription.plan = newPlan;
    await subscription.save();
    
    // Actualizar usuario
    const user = await User.findById(req.user._id);
    user.subscription.plan = newPlan;
    await user.save();
    
    res.json({
      success: true,
      message: 'Plan cambiadoexitosamente',
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
    
    subscription.endDate = newEndDate;
    subscription.nextBillingDate = newEndDate;
    subscription.status = 'active';
    await subscription.save();
    
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
