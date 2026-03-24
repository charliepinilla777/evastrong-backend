'use strict';

const cron         = require('node-cron');
const Subscription = require('../models/Subscription');
const { sendWhatsApp } = require('./whatsappService');

const PLAN_NAMES = {
  basic:     'Básico',
  premium:   'Premium',
  exclusive: 'Elite',
  free:      'Gratuito',
};

/**
 * Busca suscripciones que vencen en exactamente 5 días
 * y envía un recordatorio por WhatsApp a la usuaria.
 * Se ejecuta todos los días a las 10:00 AM.
 */
async function checkExpiringSubscriptions() {
  console.log('[Recordatorio] Verificando suscripciones por vencer...');

  try {
    const now     = new Date();
    const in5Days = new Date(now);
    in5Days.setDate(in5Days.getDate() + 5);

    // Ventana de 24 h centrada en 5 días exactos
    const from = new Date(in5Days); from.setHours(0,  0, 0, 0);
    const to   = new Date(in5Days); to.setHours(23, 59, 59, 999);

    const expiring = await Subscription.find({
      status:        'active',
      reminderSent5d: false,
      endDate:       { $gte: from, $lte: to },
    }).populate('userId', 'name phone email');

    console.log(`[Recordatorio] Encontradas: ${expiring.length} suscripciones por vencer.`);

    for (const sub of expiring) {
      const user     = sub.userId;
      const planName = PLAN_NAMES[sub.plan] || sub.plan;
      const endDate  = sub.endDate.toLocaleDateString('es-AR', { day:'2-digit', month:'long', year:'numeric' });

      if (!user?.phone) {
        console.warn(`[Recordatorio] Usuaria sin teléfono — ${user?.email || sub._id}`);
        // Marcar igual para no reintentar (sin número no se puede enviar)
        await Subscription.findByIdAndUpdate(sub._id, { reminderSent5d: true });
        continue;
      }

      const message =
        `Hola ${user.name} 💪✨\n\n` +
        `Te escribimos desde *Eva Strong* para avisarte que tu plan *${planName}* ` +
        `vence el *${endDate}* (en 5 días).\n\n` +
        `No pierdas el acceso a tus rutinas, dietas y todo el contenido que te encanta 🔥\n\n` +
        `Renueva ahora desde la app y sigue transformando tu cuerpo 💜\n\n` +
        `_Eva Strong — Tu mejor versión te está esperando_`;

      const result = await sendWhatsApp(user.phone, message);

      if (result.success) {
        await Subscription.findByIdAndUpdate(sub._id, { reminderSent5d: true });
        console.log(`[Recordatorio] Mensaje enviado a ${user.name} (${user.phone})`);
      } else {
        console.error(`[Recordatorio] Falló para ${user.name}: ${result.error}`);
      }

      // Pequeña pausa para no saturar la API de Twilio
      await new Promise(r => setTimeout(r, 500));
    }

    console.log('[Recordatorio] Proceso completado.');
  } catch (err) {
    console.error('[Recordatorio] Error en el cron job:', err);
  }
}

/**
 * Inicia el cron job.
 * Corre todos los días a las 10:00 AM hora del servidor.
 */
function startReminderCron() {
  cron.schedule('0 10 * * *', checkExpiringSubscriptions, {
    timezone: 'America/Argentina/Buenos_Aires',
  });

  console.log('[Recordatorio] Cron de recordatorios activo — se ejecuta diariamente a las 10:00 AM');
}

// Exportar también la función directa para poder testearla manualmente
module.exports = { startReminderCron, checkExpiringSubscriptions };
