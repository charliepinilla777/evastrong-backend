const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Subscription = require('./models/Subscription');

async function createTestSubscription() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong');
    console.log('✓ Conectado a MongoDB');

    // Buscar usuario administrador
    const adminUser = await User.findOne({ email: 'admin@evastrong.com' });
    
    if (!adminUser) {
      console.log('❌ Usuario administrador no encontrado');
      return;
    }

    // Verificar si ya tiene suscripción
    const existingSubscription = await Subscription.findOne({ userId: adminUser._id });
    
    if (existingSubscription) {
      // Activar suscripción existente
      const now = new Date();
      const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días
      
      existingSubscription.status = 'active';
      existingSubscription.plan = 'premium';
      existingSubscription.exactEndDate = endDate;
      existingSubscription.endDate = endDate;
      existingSubscription.features = [
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
        'hd_videos'
      ];
      existingSubscription.usageLimits = {
        workoutsPerDay: 10,
        workoutsPerMonth: 300,
        videoDownloadsPerMonth: 50,
        personalTrainingSessionsPerMonth: 10,
        customRoutinesPerMonth: 20
      };
      
      await existingSubscription.save();
      console.log('✅ Suscripción existente actualizada');
    } else {
      // Crear nueva suscripción
      const now = new Date();
      const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días
      
      const subscription = new Subscription({
        userId: adminUser._id,
        plan: 'premium',
        period: 'monthly',
        startDate: now,
        endDate: endDate,
        exactEndDate: endDate,
        status: 'active',
        features: [
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
          'hd_videos'
        ],
        usageLimits: {
          workoutsPerDay: 10,
          workoutsPerMonth: 300,
          videoDownloadsPerMonth: 50,
          personalTrainingSessionsPerMonth: 10,
          customRoutinesPerMonth: 20
        },
        amount: 29.99,
        currency: 'ARS',
        autoRenew: true
      });
      
      await subscription.save();
      console.log('✅ Nueva suscripción premium creada');
    }

    console.log('📅 Suscripción válida por 30 días');
    console.log('🎯 Features disponibles: Premium completos');
    
  } catch (error) {
    console.error('✗ Error al crear suscripción:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ Desconectado de MongoDB');
  }
}

createTestSubscription();
