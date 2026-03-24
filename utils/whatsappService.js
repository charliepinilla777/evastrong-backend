'use strict';

/**
 * Servicio de WhatsApp via Twilio
 *
 * CONFIGURACIÓN en .env:
 *   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886   ← número sandbox de Twilio
 *
 * PRUEBA RÁPIDA (Sandbox gratuito):
 *   1. Crea cuenta en https://twilio.com
 *   2. Ve a Messaging → Try it out → Send a WhatsApp message
 *   3. Desde tu celular manda "join <palabra>" al +1 415 523 8886
 *   4. Tu número queda habilitado para recibir mensajes del sandbox
 */

const twilio = require('twilio');

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN  = process.env.TWILIO_AUTH_TOKEN;
const FROM        = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

let client = null;

function getClient() {
  if (!client && ACCOUNT_SID && AUTH_TOKEN) {
    client = twilio(ACCOUNT_SID, AUTH_TOKEN);
  }
  return client;
}

/**
 * Envía un mensaje de WhatsApp.
 * @param {string} toPhone - Número en formato internacional, ej: +5491112345678
 * @param {string} message - Texto del mensaje
 * @returns {Promise<{success: boolean, sid?: string, error?: string}>}
 */
async function sendWhatsApp(toPhone, message) {
  const cl = getClient();

  if (!cl) {
    console.warn('[WhatsApp] Twilio no configurado — TWILIO_ACCOUNT_SID o TWILIO_AUTH_TOKEN faltante.');
    return { success: false, error: 'Twilio no configurado' };
  }

  // Normalizar número: asegurar formato whatsapp:+XXXXXXXXXXX
  const to = toPhone.startsWith('whatsapp:') ? toPhone : `whatsapp:${toPhone}`;

  try {
    const msg = await cl.messages.create({ from: FROM, to, body: message });
    console.log(`[WhatsApp] Enviado a ${to} — SID: ${msg.sid}`);
    return { success: true, sid: msg.sid };
  } catch (err) {
    console.error(`[WhatsApp] Error al enviar a ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendWhatsApp };
