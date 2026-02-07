const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ========== VERIFICAR ESTADO DE PRUEBA ==========

router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }
    
    const hasAccess = user.hasActiveSubscription();
    const daysRemaining = user.getTrialDaysRemaining();
    const isTrial = user.subscription.plan === 'trial';
    
    res.json({
      success: true,
      trial: {
        active: isTrial && hasAccess,
        plan: user.subscription.plan,
        daysRemaining: isTrial ? daysRemaining : 0,
        startDate: user.subscription.startDate,
        endDate: user.subscription.endDate,
        hasAccess: hasAccess,
        trialExpired: isTrial && !hasAccess,
        needsSubscription: !hasAccess && user.subscription.plan !== 'premium' && user.subscription.plan !== 'basic',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ========== EXPIRAR PRUEBA MANUALMENTE (para testing) ==========

router.post('/expire', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }
    
    if (user.subscription.plan !== 'trial') {
      return res.status(400).json({
        success: false,
        message: 'El usuario no está en período de prueba',
      });
    }
    
    // Expirar inmediatamente
    user.subscription.endDate = new Date();
    user.subscription.active = false;
    await user.save();
    
    res.json({
      success: true,
      message: 'Período de prueba expirado',
      subscription: user.subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
