const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Información básica
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: String,
  
  // Autenticación
  password: {
    type: String, // Solo para registro manual (opcional)
  },
  googleId: String,
  appleId: String,
  provider: {
    type: String,
    enum: ['google', 'apple', 'local'],
    default: 'local',
  },
  
  // Verificación
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Perfil de usuario
  phone: String,
  age: Number,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  goals: [String], // ['weight_loss', 'muscle_gain', 'endurance', etc]
  
  // Perfil de fitness para rutinas personalizadas
  ageRange: {
    type: String,
    enum: ['18-35', '36-55', '55+'],
  },
  constitution: {
    type: String,
    enum: ['bajo_peso', 'normopeso', 'sobrepeso', 'obesidad'],
  },
  kneeSensitive: {
    type: Boolean,
    default: false,
  },
  pathologies: {
    type: String,
    enum: ['ninguna', 'cardiaca', 'respiratoria', 'metabolica', 'otra'],
    default: 'ninguna',
  },
  dailyTime: {
    type: Number,
    enum: [10, 15, 20],
    default: 15,
  },
  
  // Suscripción
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'trial', 'basic', 'premium'],
      default: 'trial',
    },
    active: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    trialUsed: {
      type: Boolean,
      default: false,
    },
    mercadoPagoSubscriptionId: String,
  },
  
  // Contraseña recuperación
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
  active: {
    type: Boolean,
    default: true,
  },
  
  // Rol de usuario
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, { timestamps: true });

// Inicializar período de prueba de 5 días para nuevos usuarios
userSchema.pre('save', async function (next) {
  // Si es un nuevo usuario y no tiene subscription configurada
  if (this.isNew && !this.subscription.endDate) {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 5); // 5 días de prueba
    
    this.subscription.plan = 'trial';
    this.subscription.active = true;
    this.subscription.startDate = new Date();
    this.subscription.endDate = trialEndDate;
    this.subscription.trialUsed = true;
  }
  
  next();
});

// Hash password antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function (passwordInput) {
  return await bcrypt.compare(passwordInput, this.password);
};

// Método para verificar si el usuario tiene acceso activo
userSchema.methods.hasActiveSubscription = function () {
  if (!this.subscription.active) return false;
  
  // Si es trial, verificar si no expiró
  if (this.subscription.plan === 'trial') {
    const now = new Date();
    return now <= this.subscription.endDate;
  }
  
  // Para planes pagos, verificar fecha de expiración
  if (['basic', 'premium'].includes(this.subscription.plan)) {
    if (!this.subscription.endDate) return true; // Sin fecha de fin = ilimitado
    const now = new Date();
    return now <= this.subscription.endDate;
  }
  
  return false;
};

// Método para obtener días restantes de prueba
userSchema.methods.getTrialDaysRemaining = function () {
  if (this.subscription.plan !== 'trial') return 0;
  
  const now = new Date();
  const endDate = new Date(this.subscription.endDate);
  const diffTime = endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};

// Método para generar JWT
userSchema.methods.generateJWT = function () {
  return require('jsonwebtoken').sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// No retornar password en respuestas
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  delete user.emailVerificationToken;
  return user;
};

module.exports = mongoose.model('User', userSchema);
