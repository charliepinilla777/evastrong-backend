const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Plan
  plan: {
    type: String,
    enum: ['basic', 'premium'],
    required: true,
  },
  
  // Período
  period: {
    type: String,
    enum: ['monthly', 'annual'],
    default: 'monthly',
  },
  
  // Fechas
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: Date,
  nextBillingDate: Date,
  
  // Estado
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'pending',
  },
  
  // Mercado Pago
  mercadoPagoSubscriptionId: String,
  mercadoPagoCustomerId: String,
  
  // Precio
  amount: Number,
  currency: {
    type: String,
    default: 'ARS',
  },
  
  // Auto-renovación
  autoRenew: {
    type: Boolean,
    default: true,
  },
  
  // Cancelación
  cancelledAt: Date,
  cancelReason: String,
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
