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

// Obtener token de acceso de PayPal
async function getPayPalToken() {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting PayPal token:', error);
    throw error;
  }
}

// ========== CREAR ORDEN DE PAGO CON PAYPAL ==========

router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { plan, period } = req.body;
    
    if (!['basic', 'premium'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Plan inválido' });
    }
    
    if (!['monthly', 'annual'].includes(period)) {
      return res.status(400).json({ success: false, message: 'Período inválido' });
    }
    
    // Precios en USD
    const prices = {
      basic: { monthly: 9.99, annual: 99.99 },
      premium: { monthly: 19.99, annual: 199.99 },
    };
    
    const amount = prices[plan][period];
    const currency = 'USD';
    const description = `Suscripción Eva Strong - Plan ${plan.toUpperCase()} (${period === 'monthly' ? 'Mensual' : 'Anual'})`
    
    console.log(`✅ Orden PayPal creada: Plan ${plan}, Período ${period}, Monto: $${amount} ${currency}`);
    
    // Obtener token de PayPal
    const token = await getPayPalToken();
    
    // Crear orden en PayPal
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
        name: {
          given_name: req.user.name,
        },
      },
      application_context: {
        brand_name: 'EvaStrong',
        user_action: 'PAY_NOW',
        return_url: `${process.env.PAYPAL_RETURN_URL}`,
        cancel_url: `${process.env.PAYPAL_CANCEL_URL}`,
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
    
    // Guardar pago en BD
    const payment = await Payment.create({
      userId: req.user._id,
      amount,
      plan,
      subscriptionPeriod: period,
      status: 'pending',
      paypalOrderId: response.data.id,
      description,
    });
    
    res.json({
      success: true,
      orderId: response.data.id,
      approvalLink: response.data.links.find((link) => link.rel === 'approve')?.href,
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

// ========== CAPTURAR PAGO EN PAYPAL ==========

router.post('/capture-order/:orderId', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;

    const token = await getPayPalToken();

    // Capturar la orden en PayPal
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

    // Actualizar pago en BD
    const payment = await Payment.findOneAndUpdate(
      { paypalOrderId: orderId },
      {
        status: 'completed',
        paypalTransactionId: captureData.purchase_units[0].payments.captures[0].id,
        completedAt: new Date(),
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado',
      });
    }

    // Crear suscripción
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

    // Actualizar usuario
    await User.findByIdAndUpdate(payment.userId, {
      subscriptionPlan: payment.plan,
      subscriptionStatus: 'active',
    });

    res.json({
      success: true,
      message: 'Pago capturado exitosamente',
      payment,
      subscription,
    });
  } catch (error) {
    console.error('PayPal Capture Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
});

// ========== WEBHOOK PAYPAL ==========

router.post('/webhook', async (req, res) => {
  try {
    const event = req.body;

    console.log('PayPal Webhook Event:', event.event_type);

    switch (event.event_type) {
      case 'CHECKOUT.ORDER.COMPLETED':
        // Orden completada - captura iniciada
        console.log('Order completed:', event.resource.id);
        break;

      case 'PAYMENT.CAPTURE.COMPLETED':
        // Pago capturado exitosamente
        const paymentId = event.resource.custom_id;
        const transactionId = event.resource.id;

        const payment = await Payment.findOneAndUpdate(
          { userId: paymentId },
          {
            status: 'completed',
            paypalTransactionId: transactionId,
            completedAt: new Date(),
          }
        );

        if (payment) {
          // Crear suscripción
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
        }
        break;

      case 'PAYMENT.CAPTURE.DECLINED':
        // Pago rechazado
        console.log('Payment declined:', event.resource);
        break;

      case 'PAYMENT.CAPTURE.REFUNDED':
        // Pago reembolsado
        console.log('Payment refunded:', event.resource.id);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========== CANCELAR SUSCRIPCIÓN ==========

router.post('/cancel-subscription', authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { userId: req.user._id, status: 'active' },
      { status: 'cancelled', cancelledAt: new Date() },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Suscripción no encontrada',
      });
    }

    // Actualizar usuario
    await User.findByIdAndUpdate(req.user._id, {
      subscriptionPlan: null,
      subscriptionStatus: 'cancelled',
    });

    res.json({
      success: true,
      message: 'Suscripción cancelada exitosamente',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ========== OBTENER SUSCRIPCIÓN ==========

router.get('/subscription', authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });

    if (!subscription) {
      return res.json({
        success: true,
        subscription: null,
      });
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

// ========== MERCADO PAGO: CREAR PREFERENCIA DE PAGO ==========

router.post('/mercado-pago/create-preference', authMiddleware, async (req, res) => {
  try {
    const { plan, period, currency = 'COP' } = req.body;
    
    if (!['basic', 'premium'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Plan inválido' });
    }
    
    if (!['monthly', 'annual'].includes(period)) {
      return res.status(400).json({ success: false, message: 'Período inválido' });
    }

    if (!['COP', 'USD'].includes(currency)) {
      return res.status(400).json({ success: false, message: 'Moneda inválida (COP o USD)' });
    }

    // Precios en COP (Pesos Colombianos) y USD
    const prices = {
      COP: {
        basic: { monthly: 39900, annual: 399900 },
        premium: { monthly: 79900, annual: 799900 },
      },
      USD: {
        basic: { monthly: 9.99, annual: 99.99 },
        premium: { monthly: 19.99, annual: 199.99 },
      },
    };

    const amount = prices[currency][plan][period];
    const description = `Suscripción Eva Strong - Plan ${plan.toUpperCase()} (${period === 'monthly' ? 'Mensual' : 'Anual'})`;

    // Crear preferencia en Mercado Pago
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

    // Realizar request a Mercado Pago
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

    // Guardar pago en BD
    const payment = await Payment.create({
      userId: req.user._id,
      amount,
      currency: currency,
      plan,
      subscriptionPeriod: period,
      status: 'pending',
      mercadoPagoPreferenceId: response.data.id,
      description,
      paymentMethod: 'mercado_pago',
    });

    console.log(`✅ Preferencia Mercado Pago creada: Plan ${plan}, Período ${period}, Monto: ${amount} ${currency}`);

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

// ========== MERCADO PAGO: WEBHOOK ==========

router.post('/webhook-mercado-pago', async (req, res) => {
  try {
    const { type, data } = req.body;

    console.log('Mercado Pago Webhook Event:', type);

    if (type === 'payment') {
      const paymentId = data.id;

      // Obtener detalles del pago desde Mercado Pago
      const paymentResponse = await axios.get(
        `${MERCADO_PAGO_API}/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          },
        }
      );

      const paymentData = paymentResponse.data;

      // Actualizar pago en BD
      const payment = await Payment.findOneAndUpdate(
        { mercadoPagoPreferenceId: paymentData.preference_id },
        {
          mercadoPagoPaymentId: paymentId,
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

      // Si el pago fue aprobado, crear suscripción
      if (paymentData.status === 'approved') {
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

        // Actualizar usuario
        await User.findByIdAndUpdate(payment.userId, {
          subscriptionPlan: payment.plan,
          subscriptionStatus: 'active',
        });

        console.log(`✅ Suscripción creada para usuario: ${payment.userId}`);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Mercado Pago Webhook Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// ========== MERCADO PAGO: OBTENER ESTADO DEL PAGO ==========

router.get('/mercado-pago/payment/:paymentId', authMiddleware, async (req, res) => {
  try {
    const { paymentId } = req.params;

    const response = await axios.get(
      `${MERCADO_PAGO_API}/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    );

    res.json({
      success: true,
      payment: response.data,
    });
  } catch (error) {
    console.error('Mercado Pago Get Payment Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
});

module.exports = router;
