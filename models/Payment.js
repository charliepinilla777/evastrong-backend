const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Información del pago
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'ARS', // Pesos argentinos
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined', 'cancelled', 'refunded'],
    default: 'pending',
  },
  
  // PayPal
  paypalOrderId: String,
  paypalTransactionId: String,

  // Mercado Pago
  mercadoPagoPaymentId: String,
  mercadoPagoPreferenceId: String,
  mercadoPagoStatus: String,
  mercadoPagoStatusDetail: String,

  // Wompi
  wompiTransactionId: String,
  wompiReference: String,
  wompiStatus: String,

  // Información de pago
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'wallet', 'paypal', 'mercado_pago', 'wompi'],
  },
  
  // Plan/Suscripción
  plan: {
    type: String,
    enum: ['basic', 'premium', 'exclusive'],
    required: true,
  },
  subscriptionPeriod: {
    type: String,
    enum: ['monthly', 'annual'],
    default: 'monthly',
  },
  
  // Descripción
  description: String,
  
  // Recibos/Comprobantes
  receipt: String,
  invoiceNumber: String,
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: Date,
  completedAt: Date,
  refundedAt: Date,
  
  // Logs
  webhookData: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

// Índices para historial de pagos y lookups de webhooks
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });

// sparse: true porque no todos los pagos usan todos los proveedores
// unique: true para evitar pagos duplicados si el webhook llega dos veces
paymentSchema.index({ paypalOrderId: 1 },         { sparse: true, unique: true });
paymentSchema.index({ mercadoPagoPaymentId: 1 },  { sparse: true, unique: true });
paymentSchema.index({ wompiTransactionId: 1 },    { sparse: true, unique: true });

module.exports = mongoose.model('Payment', paymentSchema);
