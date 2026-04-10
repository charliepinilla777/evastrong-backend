const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const Feedback = require('../models/Feedback');
const WorkoutHistory = require('../models/WorkoutHistory');

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

    // Top usuarios por entrenamientos completados
    const topUsersRaw = await WorkoutHistory.aggregate([
      { $group: { _id: '$user', workouts: { $sum: 1 } } },
      { $sort: { workouts: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userDoc' } },
      { $unwind: { path: '$userDoc', preserveNullAndEmptyArrays: true } },
      { $project: { name: '$userDoc.name', avatar: '$userDoc.avatar', workouts: 1 } },
    ]);

    const topUsersFormatted = topUsersRaw.map(u => ({
      name:         u.name    || 'Usuario',
      achievements: u.workouts,
      avatar:       u.avatar  || '👤',
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
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalAchievements, achievementsUnlockedToday, recentWorkouts] = await Promise.all([
      WorkoutHistory.countDocuments(),
      WorkoutHistory.countDocuments({ completedAt: { $gte: startOfToday } }),
      WorkoutHistory.find()
        .sort({ completedAt: -1 })
        .limit(5)
        .populate('user', 'name')
        .select('user routineName completedAt')
        .lean(),
    ]);

    const recentAchievements = recentWorkouts.map(w => {
      const minutesAgo = Math.floor((new Date() - new Date(w.completedAt)) / 60000);
      return {
        userName: w.user?.name || 'Usuario',
        achievement: w.routineName || 'Entrenamiento completado',
        time: minutesAgo < 60
          ? `Hace ${minutesAgo} min`
          : `Hace ${Math.floor(minutesAgo / 60)} h`,
      };
    });

    res.json({ totalAchievements, achievementsUnlockedToday, recentAchievements });
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
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [dailyActiveUsers, workoutsByDay, avgDurationResult] = await Promise.all([
      User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      WorkoutHistory.aggregate([
        { $match: { completedAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
            sessions: { $sum: 1 },
            users:    { $addToSet: '$user' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      WorkoutHistory.aggregate([
        { $match: { durationMinutes: { $exists: true, $gt: 0 } } },
        { $group: { _id: null, avg: { $avg: '$durationMinutes' } } },
      ]),
    ]);

    const avgSessionDuration = avgDurationResult[0]?.avg
      ? Number(avgDurationResult[0].avg).toFixed(1)
      : 0;

    // Build trafficTrend from real data, fill missing days with 0
    const trendMap = {};
    workoutsByDay.forEach(d => {
      trendMap[d._id] = { sessions: d.sessions, users: d.users.length };
    });
    const trafficTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString().slice(0, 10);
      trafficTrend.push({
        date:     d.toISOString(),
        users:    trendMap[key]?.users    || 0,
        sessions: trendMap[key]?.sessions || 0,
      });
    }

    res.json({
      dailyActiveUsers,
      sessionCount: workoutsByDay.reduce((s, d) => s + d.sessions, 0),
      avgSessionDuration: parseFloat(avgSessionDuration),
      trafficTrend,
    });
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
    res.status(500).json({ success: false, error: 'Error al actualizar feedback' });
  }
});

// ============= ESTADÍSTICAS DE FEEDBACK =============
router.get('/feedback/stats', async (req, res) => {
  try {
    const [pendingResponses, avgArr, recentFeedbackDocs] = await Promise.all([
      Feedback.countDocuments({ status: { $in: ['unread', 'pending'] } }),
      Feedback.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]),
      Feedback.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('userName rating comment createdAt')
        .lean(),
    ]);

    const satisfactionScore = avgArr[0]?.avg
      ? Number(avgArr[0].avg).toFixed(1)
      : '0.0';

    const recentFeedback = recentFeedbackDocs.map(f => {
      const minutesAgo = Math.floor((new Date() - new Date(f.createdAt)) / 60000);
      return {
        userName: f.userName || 'Usuario',
        rating:   f.rating   || 0,
        comment:  f.comment  || '',
        time: minutesAgo < 60
          ? `Hace ${minutesAgo} min`
          : `Hace ${Math.floor(minutesAgo / 60)} h`,
      };
    });

    res.json({
      satisfactionScore: parseFloat(satisfactionScore),
      pendingResponses,
      recentFeedback,
    });
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
