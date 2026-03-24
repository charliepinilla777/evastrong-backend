const express = require('express');
const axios = require('axios');
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

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

        // Verificar que no exista ya una suscripcion para este pago
        const existingSub = await Subscription.findOne({ paymentId: payment._id });
        if (existingSub) break;

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

        console.log(`Suscripcion creada via webhook para usuario: ${payment.userId}`);
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

          console.log(`Suscripcion creada para usuario: ${payment.userId}`);
        }
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

module.exports = router;
