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
  
  // Suscripción
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free',
    },
    active: {
      type: Boolean,
      default: false,
    },
    startDate: Date,
    endDate: Date,
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
}, { timestamps: true });

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

// Método para generar JWT
userSchema.methods.generateJWT = function () {
  return require('jsonwebtoken').sign(
    { id: this._id, email: this.email },
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
