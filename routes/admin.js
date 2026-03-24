const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const Feedback = require('../models/Feedback');

// Aplicar middleware de autenticación a todas las rutas
router.use(adminAuth);

// ============= ESTADÍSTICAS DE USUARIOS =============
router.get('/users/stats', async (req, res) => {
  try {
    console.log('Dashboard request from:', req.user.email);

    // Total usuarios
    const totalUsers = await User.countDocuments();

    // Usuarios activos (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }
    });

    // Nuevos usuarios hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Top usuarios (simulado - necesitaríamos modelo de achievements y performance)
    const topUsers = await User.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name avatar email createdAt')
      .lean();

    const topUsersFormatted = topUsers.map((user, index) => ({
      name: user.name,
      achievements: Math.floor(Math.random() * 50) + 10, // Simulado
      performance: (Math.random() * 20 + 80).toFixed(1), // Simulado
      avatar: user.avatar || '👤'
    }));

    const responseData = {
      totalUsers,
      activeUsers,
      newUsersToday,
      topUsers: topUsersFormatted
    };

    console.log('Users stats sent:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Error en /users/stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas de usuarios'
    });
  }
});

// ============= ESTADÍSTICAS DE VENTAS =============
router.get('/revenue/stats', async (req, res) => {
  try {
    // Ingresos diarios
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailyRevenueResult = await Payment.aggregate([
      {
        $match: {
          status: 'approved',
          createdAt: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const dailyRevenue = dailyRevenueResult[0]?.totalAmount || 0;
    const dailySales = dailyRevenueResult[0]?.count || 0;

    // Ingresos mensuales
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const monthlyRevenueResult = await Payment.aggregate([
      {
        $match: {
          status: 'approved',
          createdAt: { $gte: firstDayOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const monthlyRevenue = monthlyRevenueResult[0]?.totalAmount || 0;

    // Ventas recientes
    const recentSales = await Payment.find({ status: 'approved' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentSalesFormatted = recentSales.map(sale => ({
      userId: sale.userId?._id || 'Unknown',
      plan: sale.plan === 'basic' ? 'Básico' : 'Premium',
      amount: sale.amount,
      time: `Hace ${Math.floor((new Date() - sale.createdAt) / 60000)} min`
    }));

    const responseData = {
      dailyRevenue,
      monthlyRevenue,
      dailySales,
      recentSales: recentSalesFormatted
    };

    console.log('Revenue stats sent:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Error en /revenue/stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas de ventas'
    });
  }
});

// ============= ESTADÍSTICAS DE LOGROS =============
router.get('/achievements/stats', async (req, res) => {
  try {
    // Simulado - necesitaríamos modelo de Achievement
    const totalAchievements = 12543;
    const achievementsUnlockedToday = Math.floor(Math.random() * 50) + 20;

    // Usuarios recientes para simular logros
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt')
      .lean();

    const achievements = ['Rutina Perfecta', 'Primera Semana', 'Consistencia', 'Fuerza Máxima', 'Velocidad'];
    const recentAchievements = recentUsers.map(user => ({
      userName: user.name,
      achievement: achievements[Math.floor(Math.random() * achievements.length)],
      time: `Hace ${Math.floor((new Date() - user.createdAt) / 60000)} min`
    }));

    const responseData = {
      totalAchievements,
      achievementsUnlockedToday,
      recentAchievements
    };

    console.log('Achievements stats sent:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Error en /achievements/stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas de logros'
    });
  }
});

// ============= ESTADÍSTICAS DE SUSCRIPCIONES =============
router.get('/subscriptions/stats', async (req, res) => {
  try {
    // Suscripciones activas
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });

    // Suscripciones que expiraron este mes
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    const expiredThisMonth = await Subscription.countDocuments({
      status: 'expired',
      endDate: { $gte: firstDayOfMonth }
    });

    // Suscripciones por vencer (próximos 14 días)
    const fourteenDaysFromNow = new Date();
    fourteenDaysFromNow.setDate(fourteenDaysFromNow.getDate() + 14);

    const expiringSubscriptions = await Subscription.find({
      status: 'active',
      endDate: { $lte: fourteenDaysFromNow, $gt: new Date() }
    })
      .populate('userId', 'name email')
      .sort({ endDate: 1 })
      .limit(10)
      .lean();

    const expiringSubscriptionsFormatted = expiringSubscriptions.map(sub => ({
      userId: sub.userId?._id || 'Unknown',
      userName: sub.userId?.name || 'Unknown',
      plan: sub.plan === 'basic' ? 'Básico Mensual' : 'Premium Mensual',
      daysLeft: Math.ceil((sub.endDate - new Date()) / (1000 * 60 * 60 * 24))
    }));

    const responseData = {
      activeSubscriptions,
      expiredThisMonth,
      expiringSubscriptions: expiringSubscriptionsFormatted
    };

    console.log('Subscriptions stats sent:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Error en /subscriptions/stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas de suscripciones'
    });
  }
});

// ============= ESTADÍSTICAS DE TRÁFICO =============
router.get('/traffic/stats', async (req, res) => {
  try {
    // Simulado - necesitaríamos sistema de analytics
    const dailyActiveUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    const sessionCount = dailyActiveUsers * 2; // Simulado
    const avgSessionDuration = (Math.random() * 10 + 20).toFixed(1);

    // Tendencia de tráfico últimos 7 días (simulado)
    const trafficTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const users = Math.floor(Math.random() * 500 + 1000);
      const sessions = Math.floor(users * (Math.random() * 0.5 + 1.5));
      
      trafficTrend.push({
        date: date.toISOString(),
        users,
        sessions
      });
    }

    const responseData = {
      dailyActiveUsers,
      sessionCount,
      avgSessionDuration: parseFloat(avgSessionDuration),
      trafficTrend
    };

    console.log('Traffic stats sent:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Error en /traffic/stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas de tráfico'
    });
  }
});

// ============= FEEDBACK DE USUARIAS (REAL) =============
router.get('/feedback/list', async (req, res) => {
  try {
    const list = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const total   = await Feedback.countDocuments();
    const pending = await Feedback.countDocuments({ status: 'pending' });
    const avgArr  = await Feedback.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]);
    const avgRating = avgArr[0]?.avg ? Number(avgArr[0].avg).toFixed(1) : '—';

    res.json({ total, pending, avgRating, feedback: list });
  } catch (error) {
    console.error('Error en /feedback/list:', error);
    res.status(500).json({ success: false, error: 'Error al obtener feedback' });
  }
});

// Marcar feedback como leído
router.patch('/feedback/:id/read', async (req, res) => {
  try {
    await Feedback.findByIdAndUpdate(req.params.id, { status: 'read' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// ============= ESTADÍSTICAS DE FEEDBACK =============
router.get('/feedback/stats', async (req, res) => {
  try {
    // Simulado - necesitaríamos modelo de Feedback
    const satisfactionScore = (Math.random() * 0.5 + 4.2).toFixed(1);
    const pendingResponses = Math.floor(Math.random() * 20) + 5;

    // Usuarios recientes para simular feedback
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt')
      .lean();

    const comments = [
      '¡Excelente app! Me encanta',
      'Muy buena para mantenerse en forma',
      'Las rutinas son geniales',
      'Necesita más ejercicios',
      'Perfecta para mi nivel'
    ];

    const recentFeedback = recentUsers.map(user => ({
      userName: user.name,
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 estrellas
      comment: comments[Math.floor(Math.random() * comments.length)],
      time: `Hace ${Math.floor((new Date() - user.createdAt) / 60000)} min`
    }));

    const responseData = {
      satisfactionScore: parseFloat(satisfactionScore),
      pendingResponses,
      recentFeedback
    };

    console.log('Feedback stats sent:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Error en /feedback/stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas de feedback'
    });
  }
});

// ============= PAGOS RECIENTES =============
router.get('/payments/recent', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();

    const formatted = payments.map(p => ({
      userName:  p.userId?.name  || '—',
      userEmail: p.userId?.email || '—',
      plan:      p.plan          || '—',
      amount:    p.amount,
      currency:  p.currency      || '',
      method:    p.paymentMethod || '—',
      status:    p.status        || '—',
      createdAt: p.createdAt,
    }));

    res.json({ payments: formatted });
  } catch (error) {
    console.error('Error en /payments/recent:', error);
    res.status(500).json({ success: false, error: 'Error al obtener pagos recientes' });
  }
});

// ============= ACCIONES =============

// Enviar recordatorio de suscripción
router.post('/subscriptions/send-reminder', async (req, res) => {
  try {
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren userId y userName'
      });
    }

    // Simular envío de recordatorio
    console.log(`Recordatorio enviado a ${userName} (ID: ${userId})`);

    // Aquí iría la lógica real de envío de email/notificación

    res.json({
      success: true,
      message: `Recordatorio enviado a ${userName} exitosamente`
    });
  } catch (error) {
    console.error('Error al enviar recordatorio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al enviar recordatorio'
    });
  }
});

// Responder feedback
router.post('/feedback/respond', async (req, res) => {
  try {
    const { userId, response } = req.body;

    if (!userId || !response) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren userId y response'
      });
    }

    // Simular respuesta a feedback
    console.log(`Respuesta enviada al usuario ${userId}: ${response}`);

    // Aquí iría la lógica real de envío de respuesta

    res.json({
      success: true,
      message: 'Respuesta enviada exitosamente'
    });
  } catch (error) {
    console.error('Error al responder feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Error al responder feedback'
    });
  }
});

// ============= TEST RECORDATORIO WHATSAPP =============
// POST /admin/reminders/test  — dispara el job manualmente
router.post('/reminders/test', async (req, res) => {
  try {
    const { checkExpiringSubscriptions } = require('../utils/subscriptionReminder');
    await checkExpiringSubscriptions();
    res.json({ success: true, message: 'Job de recordatorios ejecutado. Revisa la consola del servidor.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /admin/reminders/send-test  — envía mensaje a un número específico para probar
router.post('/reminders/send-test', async (req, res) => {
  try {
    const { phone, name } = req.body;
    if (!phone) return res.status(400).json({ success: false, error: 'Se requiere phone' });

    const { sendWhatsApp } = require('../utils/whatsappService');
    const result = await sendWhatsApp(phone,
      `Hola ${name || 'Eva'} 💪✨\n\n` +
      `Este es un mensaje de prueba de *Eva Strong*.\n\n` +
      `Los recordatorios de renovación de suscripción están funcionando correctamente 💜\n\n` +
      `_Eva Strong — Tu mejor versión te está esperando_`
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
