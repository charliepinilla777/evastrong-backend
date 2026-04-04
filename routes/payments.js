const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ─── Helper: activar suscripción de forma atómica ────────────────────────────
// Usa findOneAndUpdate con upsert=false + unique index en paymentId para
// garantizar que dos webhooks simultáneos no creen dos suscripciones.
async function activateSubscription(payment) {
  const startDate = new Date();
  const endDate   = new Date(startDate);
  if (payment.subscriptionPeriod === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  // $setOnInsert garantiza que si ya existe no se sobreescriba (idempotente)
  const result = await Subscription.findOneAndUpdate(
    { paymentId: payment._id },
    {
      $setOnInsert: {
        userId:   payment.userId,
        plan:     payment.plan,
        period:   payment.subscriptionPeriod,
        paymentId: payment._id,
        startDate,
        endDate,
        status:    'active',
        autoRenew: true,
      },
    },
    { upsert: true, new: false }
  );

  // Si result es null → se insertó (nuevo); si tiene valor → ya existía (skip)
  if (result !== null) return; // ya procesado

  await User.findByIdAndUpdate(payment.userId, {
    subscriptionPlan:   payment.plan,
    subscriptionStatus: 'active',
    'subscription.plan':   payment.plan,
    'subscription.active': true,
    'subscription.endDate': endDate,
  });

  console.log(`✅ Suscripción activada para usuario: ${payment.userId}`);
}
// ─────────────────────────────────────────────────────────────────────────────

// PayPal API endpoints
const PAYPAL_API = process.env.PAYPAL_MODE === 'sandbox'
  ? 'https://api.sandbox.paypal.com'
  : 'https://api.paypal.com';

// Mercado Pago API
const MERCADO_PAGO_API = 'https://api.mercadopago.com';

// ============================================================
// HELPERS
// ============================================================

async function getPayPalToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await axios.post(
    `${PAYPAL_API}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
}

// FIX #2: Verificacion de firma del webhook de PayPal via API de PayPal
// Requiere PAYPAL_WEBHOOK_ID en .env
async function verifyPayPalWebhook(headers, body) {
  try {
    const token = await getPayPalToken();
    const response = await axios.post(
      `${PAYPAL_API}/v1/notifications/verify-webhook-signature`,
      {
        auth_algo: headers['paypal-auth-algo'],
        cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: body,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('Error verificando firma PayPal:', error.response?.data || error.message);
    return false;
  }
}

// ============================================================
// PAYPAL: CREAR ORDEN
// ============================================================

router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { plan, period } = req.body;

    if (!['basic', 'premium', 'exclusive'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Plan invalido' });
    }

    if (!['monthly', 'annual'].includes(period)) {
      return res.status(400).json({ success: false, message: 'Periodo invalido' });
    }

    const prices = {
      basic:     { monthly: 9.99,  annual: 99.99  },
      premium:   { monthly: 19.99, annual: 199.99 },
      exclusive: { monthly: 29.99, annual: 299.99 },
    };

    const amount = prices[plan][period];
    const description = `Suscripcion Eva Strong - Plan ${plan.toUpperCase()} (${period === 'monthly' ? 'Mensual' : 'Anual'})`;

    const token = await getPayPalToken();

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: `${req.user._id}-${Date.now()}`,
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2),
          },
          description,
          custom_id: req.user._id.toString(),
        },
      ],
      payer: {
        email_address: req.user.email,
        name: { given_name: req.user.name },
      },
      application_context: {
        brand_name: 'EvaStrong',
        user_action: 'PAY_NOW',
        return_url: process.env.PAYPAL_RETURN_URL,
        cancel_url: process.env.PAYPAL_CANCEL_URL,
      },
    };

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const payment = await Payment.create({
      userId: req.user._id,
      amount,
      currency: 'USD',
      plan,
      subscriptionPeriod: period,
      status: 'pending',
      paypalOrderId: response.data.id,
      paymentMethod: 'paypal',
      description,
    });

    console.log(`Orden PayPal creada: Plan ${plan}, Periodo ${period}, Monto: $${amount} USD`);

    res.json({
      success: true,
      orderId: response.data.id,
      approvalLink: response.data.links.find((l) => l.rel === 'approve')?.href,
      payment: payment._id,
    });
  } catch (error) {
    console.error('PayPal Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
});

// ============================================================
// PAYPAL: CAPTURAR ORDEN
// ============================================================

router.post('/capture-order/:orderId', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;

    const token = await getPayPalToken();

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const captureData = response.data;

    // FIX #4: buscar por paypalOrderId (campo ahora en el schema)
    const payment = await Payment.findOne({ paypalOrderId: orderId });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Pago no encontrado' });
    }

    // FIX #5: verificar que la orden pertenece al usuario autenticado
    if (payment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    // FIX #1: usar 'approved' (que si esta en el enum del modelo)
    payment.status = 'approved';
    payment.paypalTransactionId = captureData.purchase_units[0].payments.captures[0].id;
    payment.completedAt = new Date();
    await payment.save();

    // Verificar que no exista ya una suscripcion activa para este pago
    const existingSub = await Subscription.findOne({ paymentId: payment._id });
    if (existingSub) {
      return res.json({ success: true, message: 'Pago ya procesado', payment, subscription: existingSub });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    if (payment.subscriptionPeriod === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription = await Subscription.create({
      userId: payment.userId,
      plan: payment.plan,
      period: payment.subscriptionPeriod,
      paymentId: payment._id,
      startDate,
      endDate,
      status: 'active',
      autoRenew: true,
    });

    await User.findByIdAndUpdate(payment.userId, {
      subscriptionPlan: payment.plan,
      subscriptionStatus: 'active',
    });

    res.json({ success: true, message: 'Pago capturado exitosamente', payment, subscription });
  } catch (error) {
    console.error('PayPal Capture Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
});

// ============================================================
// PAYPAL: WEBHOOK
// ============================================================

router.post('/webhook', async (req, res) => {
  try {
    // FIX #2: verificar firma del webhook antes de procesar
    if (process.env.PAYPAL_WEBHOOK_ID) {
      const isValid = await verifyPayPalWebhook(req.headers, req.body);
      if (!isValid) {
        console.warn('Webhook PayPal rechazado: firma invalida');
        return res.status(400).json({ error: 'Firma invalida' });
      }
    } else {
      console.warn('PAYPAL_WEBHOOK_ID no configurado — verificacion de firma omitida');
    }

    const event = req.body;
    console.log('PayPal Webhook Event:', event.event_type);

    switch (event.event_type) {
      case 'CHECKOUT.ORDER.COMPLETED':
        console.log('Order completed:', event.resource.id);
        break;

      case 'PAYMENT.CAPTURE.COMPLETED': {
        const transactionId = event.resource.id;
        const customUserId = event.resource.custom_id;

        // FIX #3: buscar por paypalTransactionId primero (ya procesado por capture-order)
        let payment = await Payment.findOne({ paypalTransactionId: transactionId });

        if (payment) {
          // Ya fue procesado por capture-order, no hacer nada
          console.log('Pago ya procesado por capture-order:', transactionId);
          break;
        }

        // Seguridad: buscar el pago pendiente mas reciente de este usuario
        payment = await Payment.findOneAndUpdate(
          { userId: customUserId, status: 'pending' },
          {
            paypalTransactionId: transactionId,
            status: 'approved',
            completedAt: new Date(),
          },
          { new: true, sort: { createdAt: -1 } }
        );

        if (!payment) {
          console.warn('Webhook: pago pendiente no encontrado para usuario:', customUserId);
          break;
        }

        await activateSubscription(payment);
        break;
      }

      case 'PAYMENT.CAPTURE.DECLINED':
        console.log('Payment declined, transaction id:', event.resource.id);
        break;

      case 'PAYMENT.CAPTURE.REFUNDED':
        console.log('Payment refunded:', event.resource.id);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// CANCELAR SUSCRIPCION
// ============================================================

router.post('/cancel-subscription', authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { userId: req.user._id, status: 'active' },
      { status: 'cancelled', cancelledAt: new Date() },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Suscripcion no encontrada' });
    }

    await User.findByIdAndUpdate(req.user._id, {
      subscriptionPlan: null,
      subscriptionStatus: 'cancelled',
    });

    res.json({ success: true, message: 'Suscripcion cancelada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// OBTENER SUSCRIPCION DEL USUARIO AUTENTICADO
// ============================================================

router.get('/subscription', authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, subscription: subscription || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// MERCADO PAGO: CREAR PREFERENCIA
// ============================================================

router.post('/mercado-pago/create-preference', authMiddleware, async (req, res) => {
  try {
    const { plan, period, currency = 'COP' } = req.body;

    if (!['basic', 'premium', 'exclusive'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Plan invalido' });
    }

    if (!['monthly', 'annual'].includes(period)) {
      return res.status(400).json({ success: false, message: 'Periodo invalido' });
    }

    if (!['COP', 'USD'].includes(currency)) {
      return res.status(400).json({ success: false, message: 'Moneda invalida (COP o USD)' });
    }

    const prices = {
      COP: {
        basic:     { monthly: 39900,  annual: 399900  },
        premium:   { monthly: 79900,  annual: 799900  },
        exclusive: { monthly: 119900, annual: 1199900 },
      },
      USD: {
        basic:     { monthly: 9.99,  annual: 99.99  },
        premium:   { monthly: 19.99, annual: 199.99 },
        exclusive: { monthly: 29.99, annual: 299.99 },
      },
    };

    const amount = prices[currency][plan][period];
    const description = `Suscripcion Eva Strong - Plan ${plan.toUpperCase()} (${period === 'monthly' ? 'Mensual' : 'Anual'})`;

    const preferenceData = {
      items: [
        {
          title: description,
          quantity: 1,
          unit_price: amount,
          currency_id: currency,
        },
      ],
      payer: {
        email: req.user.email,
        name: req.user.name,
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payments/success`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payments/pending`,
        failure: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payments/failure`,
      },
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/payments/webhook-mercado-pago`,
      external_reference: `${req.user._id}-${Date.now()}`,
      metadata: {
        userId: req.user._id.toString(),
        plan,
        period,
      },
    };

    const response = await axios.post(
      `${MERCADO_PAGO_API}/checkout/preferences`,
      preferenceData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const payment = await Payment.create({
      userId: req.user._id,
      amount,
      currency,
      plan,
      subscriptionPeriod: period,
      status: 'pending',
      mercadoPagoPreferenceId: response.data.id,
      paymentMethod: 'mercado_pago',
      description,
    });

    console.log(`Preferencia Mercado Pago creada: Plan ${plan}, Periodo ${period}, Monto: ${amount} ${currency}`);

    res.json({
      success: true,
      preferenceId: response.data.id,
      initPoint: response.data.init_point,
      payment: payment._id,
    });
  } catch (error) {
    console.error('Mercado Pago Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
});

// ============================================================
// MERCADO PAGO: WEBHOOK
// ============================================================

router.post('/webhook-mercado-pago', async (req, res) => {
  try {
    const { type, data } = req.body;
    console.log('Mercado Pago Webhook Event:', type);

    if (type === 'payment') {
      const mpPaymentId = data.id;

      // Re-fetch desde MP para verificar que el pago es real
      const paymentResponse = await axios.get(
        `${MERCADO_PAGO_API}/v1/payments/${mpPaymentId}`,
        {
          headers: { 'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` },
        }
      );

      const paymentData = paymentResponse.data;

      const payment = await Payment.findOneAndUpdate(
        { mercadoPagoPreferenceId: paymentData.preference_id },
        {
          mercadoPagoPaymentId: mpPaymentId,
          mercadoPagoStatus: paymentData.status,
          mercadoPagoStatusDetail: paymentData.status_detail,
          status: paymentData.status === 'approved' ? 'approved' : 'declined',
          webhookData: paymentData,
        },
        { new: true }
      );

      if (!payment) {
        return res.status(404).json({ success: false, message: 'Pago no encontrado' });
      }

      if (paymentData.status === 'approved') {
        await activateSubscription(payment);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Mercado Pago Webhook Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// MERCADO PAGO: ESTADO DEL PAGO
// ============================================================

router.get('/mercado-pago/payment/:paymentId', authMiddleware, async (req, res) => {
  try {
    const { paymentId } = req.params;

    const response = await axios.get(
      `${MERCADO_PAGO_API}/v1/payments/${paymentId}`,
      {
        headers: { 'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` },
      }
    );

    const mpData = response.data;

    // FIX #7: verificar que el pago pertenece al usuario autenticado
    const payment = await Payment.findOne({
      mercadoPagoPaymentId: paymentId,
      userId: req.user._id,
    });

    if (!payment) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    res.json({ success: true, payment: mpData });
  } catch (error) {
    console.error('Mercado Pago Get Payment Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
});

// ============================================================
// WOMPI: CREAR SESION DE PAGO
// ============================================================

router.post('/wompi/create-session', authMiddleware, async (req, res) => {
  try {
    const { plan, period } = req.body;

    if (!['basic', 'premium', 'exclusive'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Plan invalido' });
    }

    if (!['monthly', 'annual'].includes(period)) {
      return res.status(400).json({ success: false, message: 'Periodo invalido' });
    }

    // Precios en centavos de COP (Wompi requiere amount-in-cents)
    const prices = {
      basic:     { monthly: 3990000,   annual: 39990000  },
      premium:   { monthly: 7990000,   annual: 79990000  },
      exclusive: { monthly: 11990000,  annual: 119990000 },
    };

    const amountInCents = prices[plan][period];
    const currency = 'COP';
    const reference = `EVA-${req.user._id}-${Date.now()}`;
    const description = `EvaStrong Plan ${plan.toUpperCase()} ${period === 'monthly' ? 'Mensual' : 'Anual'}`;

    // Firma de integridad: SHA256(reference + amountInCents + currency + integritySecret)
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;
    const signatureString = `${reference}${amountInCents}${currency}${integritySecret}`;
    const integrityHash = crypto.createHash('sha256').update(signatureString).digest('hex');

    // URL de retorno tras pago
    const redirectUrl = process.env.WOMPI_REDIRECT_URL || 'https://evastrong-backend.onrender.com/payments/wompi/result';

    // Construir URL del checkout de Wompi
    const wompiBase = process.env.WOMPI_ENV === 'production'
      ? 'https://checkout.wompi.co/p/'
      : 'https://checkout.wompi.co/p/';

    const checkoutUrl = `${wompiBase}?public-key=${process.env.WOMPI_PUBLIC_KEY}` +
      `&currency=${currency}` +
      `&amount-in-cents=${amountInCents}` +
      `&reference=${reference}` +
      `&redirect-url=${encodeURIComponent(redirectUrl)}` +
      `&signature:integrity=${integrityHash}`;

    // Guardar pago pendiente en BD
    const payment = await Payment.create({
      userId: req.user._id,
      amount: amountInCents / 100,
      currency,
      plan,
      subscriptionPeriod: period,
      status: 'pending',
      wompiReference: reference,
      paymentMethod: 'wompi',
      description,
    });

    console.log(`Sesion Wompi creada: ${reference}, Plan ${plan}, ${amountInCents / 100} COP`);

    res.json({
      success: true,
      checkoutUrl,
      reference,
      payment: payment._id,
    });
  } catch (error) {
    console.error('Wompi Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// WOMPI: VERIFICAR ESTADO DE TRANSACCION (polling manual)
// ============================================================

router.get('/wompi/transaction/:reference', authMiddleware, async (req, res) => {
  try {
    const { reference } = req.params;

    // Verificar que la referencia pertenece al usuario
    const payment = await Payment.findOne({ wompiReference: reference, userId: req.user._id });
    if (!payment) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    // Consultar el estado en la API de Wompi
    const wompiApi = process.env.WOMPI_ENV === 'production'
      ? 'https://production.wompi.co/v1'
      : 'https://sandbox.wompi.co/v1';

    const response = await axios.get(
      `${wompiApi}/transactions?reference=${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}` },
      }
    );

    const transactions = response.data.data;
    if (!transactions || transactions.length === 0) {
      return res.json({ success: true, status: 'PENDING', payment: null });
    }

    const transaction = transactions[0];
    const approved = transaction.status === 'APPROVED';

    // Actualizar pago en BD
    await Payment.findOneAndUpdate(
      { wompiReference: reference },
      {
        wompiTransactionId: transaction.id,
        wompiStatus: transaction.status,
        status: approved ? 'approved' : transaction.status === 'DECLINED' ? 'declined' : 'pending',
        completedAt: approved ? new Date() : undefined,
      }
    );

    if (approved) {
      // Verificar que no exista ya una suscripcion para este pago
      const existingSub = await Subscription.findOne({ paymentId: payment._id });
      if (!existingSub) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        if (payment.subscriptionPeriod === 'monthly') {
          endDate.setMonth(endDate.getMonth() + 1);
        } else {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }

        await Subscription.create({
          userId: payment.userId,
          plan: payment.plan,
          period: payment.subscriptionPeriod,
          paymentId: payment._id,
          startDate,
          endDate,
          status: 'active',
          autoRenew: true,
        });

        await User.findByIdAndUpdate(payment.userId, {
          subscriptionPlan: payment.plan,
          subscriptionStatus: 'active',
        });

        console.log(`Suscripcion Wompi activada para usuario: ${payment.userId}`);
      }
    }

    res.json({ success: true, status: transaction.status, transactionId: transaction.id });
  } catch (error) {
    console.error('Wompi verify Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// WOMPI: WEBHOOK
// ============================================================

router.post('/wompi/webhook', async (req, res) => {
  try {
    const event = req.body;

    // Verificar firma del webhook (obligatorio en producción)
    const eventsSecret = process.env.WOMPI_EVENTS_SECRET;
    if (!eventsSecret && process.env.NODE_ENV === 'production') {
      console.error('❌ WOMPI_EVENTS_SECRET no configurado en producción');
      return res.status(500).json({ error: 'Configuración de webhook incompleta' });
    }

    if (eventsSecret) {
      if (!event.signature) {
        console.warn('Wompi webhook: sin firma — rechazado');
        return res.status(401).json({ error: 'Firma requerida' });
      }
      const { properties, checksum } = event.signature;
      const timestamp = event.timestamp;
      const values = properties.map((prop) => {
        const parts = prop.split('.');
        return parts.reduce((obj, key) => obj?.[key], event.data);
      });
      const toHash = values.join('') + timestamp + eventsSecret;
      const expected = crypto.createHash('sha256').update(toHash).digest('hex');
      if (expected !== checksum) {
        console.warn('Wompi webhook: firma inválida');
        return res.status(401).json({ error: 'Firma inválida' });
      }
    }

    if (event.event === 'transaction.updated') {
      const transaction = event.data?.transaction;
      if (!transaction) return res.json({ received: true });

      const payment = await Payment.findOneAndUpdate(
        { wompiReference: transaction.reference },
        {
          wompiTransactionId: transaction.id,
          wompiStatus: transaction.status,
          status: transaction.status === 'APPROVED' ? 'approved'
                : transaction.status === 'DECLINED' ? 'declined'
                : 'pending',
          completedAt: transaction.status === 'APPROVED' ? new Date() : undefined,
          webhookData: transaction,
        },
        { new: true }
      );

      if (payment && transaction.status === 'APPROVED') {
        await activateSubscription(payment);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Wompi Webhook Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
