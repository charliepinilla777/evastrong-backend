const mongoose = require('mongoose');

/**
 * Modelo de Ejercicio Individual
 * Almacena información detallada sobre cada ejercicio
 */
const exerciseSchema = new mongoose.Schema({
  // Identificación básica
  exerciseId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  detailedDescription: {
    type: String,
    trim: true,
    maxlength: 1000,
  },

  // Características del ejercicio
  type: {
    type: String,
    enum: ['fuerza', 'cardio_suave', 'movilidad', 'cardio_intenso', 'flexibilidad', 'equilibrio'],
    required: true,
  },
  zone: {
    type: String,
    enum: [
      'cuerpo_entero',
      'tren_inferior',
      'tren_superior',
      'core',
      'piernas_gluteos',
      'pecho_brazos',
      'espalda',
      'pantorrillas',
      'hombros',
      'abdomen'
    ],
    required: true,
  },

  // Parámetros de ejecución
  timeSeconds: {
    type: Number,
    min: 5,
    max: 300,
  },
  repetitions: {
    type: String, // Ej: "10-12", "15", "AMRAP"
  },
  restSeconds: {
    type: Number,
    min: 0,
    max: 120,
    default: 20,
  },

  // Restricciones y compatibilidad
  kneeFriendly: {
    type: Boolean,
    default: true,
  },
  lowImpact: {
    type: Boolean,
    default: false,
  },
  equipmentNeeded: {
    type: String,
    enum: ['ninguno', 'silla', 'pared', 'mancuernas', 'bandas', 'colchoneta', 'todo'],
    default: 'ninguno',
  },

  // Perfiles compatibles
  suitableFor: {
    ageRanges: [{
      type: String,
      enum: ['18-35', '36-55', '55+']
    }],
    constitutions: [{
      type: String,
      enum: ['bajo_peso', 'normopeso', 'sobrepeso', 'obesidad']
    }],
    levels: [{
      type: String,
      enum: ['principiante', 'intermedio', 'avanzado']
    }],
    pathologies: [{
      type: String,
      enum: ['ninguna', 'cardiaca', 'respiratoria', 'metabolica', 'otra']
    }]
  },

  // Multimedia
  imageUrl: String,
  videoUrl: String,
  thumbnailUrl: String,

  // Metadatos
  tags: [String],
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  caloriesPerMinute: {
    type: Number,
    min: 1,
    max: 20,
    default: 5,
  },

  // Estado
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },

  // Auditoría
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Middleware para actualizar updatedAt
exerciseSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Índices para búsqueda rápida
exerciseSchema.index({ exerciseId: 1 });
exerciseSchema.index({ type: 1, zone: 1 });
exerciseSchema.index({ kneeFriendly: 1, lowImpact: 1 });
exerciseSchema.index({ 'suitableFor.ageRanges': 1 });
exerciseSchema.index({ 'suitableFor.constitutions': 1 });
exerciseSchema.index({ 'suitableFor.levels': 1 });
exerciseSchema.index({ name: 'text', shortDescription: 'text', tags: 'text' });

// Método para verificar compatibilidad con perfil de usuario
exerciseSchema.methods.isCompatibleWithProfile = function(userProfile) {
  // Verificar rango de edad
  if (!this.suitableFor.ageRanges.includes(userProfile.ageRange)) {
    return false;
  }

  // Verificar constitución
  if (!this.suitableFor.constitutions.includes(userProfile.constitution)) {
    return false;
  }

  // Verificar nivel
  const levelMap = {
    'beginner': 'principiante',
    'intermediate': 'intermedio',
    'advanced': 'avanzado'
  };
  if (!this.suitableFor.levels.includes(levelMap[userProfile.fitnessLevel])) {
    return false;
  }

  // Verificar rodillas sensibles
  if (userProfile.kneeSensitive && !this.kneeFriendly) {
    return false;
  }

  // Verificar patologías
  if (userProfile.pathologies !== 'ninguna' && 
      !this.suitableFor.pathologies.includes(userProfile.pathologies) &&
      !this.suitableFor.pathologies.includes('ninguna')) {
    return false;
  }

  return true;
};

module.exports = mongoose.model('Exercise', exerciseSchema);
