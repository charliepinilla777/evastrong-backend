const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Modelo de Rutina de Ejercicio
 * Almacena información sobre rutinas de entrenamiento
 */
const routineSchema = new Schema({
  // Información básica
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'hiit', 'pilates', 'yoga', 'crossfit', 'functional', 'other'],
    default: 'other',
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner',
  },
  duration: {
    // Duración en minutos
    type: Number,
    required: true,
    min: 1,
    max: 300,
  },

  // Instructor/Creador
  instructor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  instructorName: String,

  // Traducciones al inglés (opcionales)
  titleEn: { type: String, trim: true, maxlength: 100 },
  descriptionEn: { type: String, trim: true, maxlength: 500 },

  // Descripción detallada
  objectives: [String], // Objetivos de la rutina
  targetMuscles: [String], // Músculos objetivo
  equipment: [String], // Equipo necesario

  // Video principal
  video: {
    // URL del video (puede ser YouTube, Vimeo, etc)
    url: String,
    // Si es subida local, guardar información del archivo
    videoId: String,
    thumbnail: String,
    duration: Number, // Duración del video en segundos
  },

  // Ejercicios en la rutina (estructura modular)
  blocks: {
    calentamiento: [{
      exerciseId: { type: String, required: true },
      name: { type: String, required: true },
      nameEn: String,
      shortDescription: String,
      shortDescriptionEn: String,
      type: {
        type: String,
        enum: ['fuerza', 'cardio_suave', 'movilidad', 'cardio_intenso', 'flexibilidad', 'equilibrio'],
      },
      zone: String,
      timeSeconds: Number,
      sets: { type: Number, default: 1, min: 1 },
      repetitions: String,
      restSeconds: { type: Number, default: 0 },
      kneeFriendly: { type: Boolean, default: true },
      order: { type: Number, default: 0 },
    }],
    principal: [{
      exerciseId: { type: String, required: true },
      name: { type: String, required: true },
      nameEn: String,
      shortDescription: String,
      shortDescriptionEn: String,
      type: {
        type: String,
        enum: ['fuerza', 'cardio_suave', 'movilidad', 'cardio_intenso', 'flexibilidad', 'equilibrio'],
      },
      zone: String,
      timeSeconds: Number,
      sets: { type: Number, default: 3, min: 1 },
      repetitions: String,
      restSeconds: { type: Number, default: 20 },
      kneeFriendly: { type: Boolean, default: true },
      order: { type: Number, default: 0 },
    }],
    enfriamiento: [{
      exerciseId: { type: String, required: true },
      name: { type: String, required: true },
      nameEn: String,
      shortDescription: String,
      shortDescriptionEn: String,
      type: {
        type: String,
        enum: ['fuerza', 'cardio_suave', 'movilidad', 'cardio_intenso', 'flexibilidad', 'equilibrio'],
      },
      zone: String,
      timeSeconds: Number,
      sets: { type: Number, default: 1, min: 1 },
      repetitions: String,
      restSeconds: { type: Number, default: 0 },
      kneeFriendly: { type: Boolean, default: true },
      order: { type: Number, default: 0 },
    }],
  },
  
  // Configuración de la rutina
  mainCycles: {
    type: Number,
    default: 2,
    min: 1,
    max: 5,
  },
  
  // Perfil objetivo para compatibilidad
  targetProfile: {
    ageRange: {
      type: String,
      enum: ['18-35', '36-55', '55+'],
    },
    level: {
      type: String,
      enum: ['principiante', 'intermedio', 'avanzado'],
    },
    constitutions: [{
      type: String,
      enum: ['bajo_peso', 'normopeso', 'sobrepeso', 'obesidad']
    }],
    kneeSensitive: {
      type: Boolean,
      default: false,
    },
    allowedPathologies: [{
      type: String,
      enum: ['ninguna', 'cardiaca', 'respiratoria', 'metabolica', 'otra']
    }],
  },

  // Estadísticas
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  favorites: {
    type: Number,
    default: 0,
  },

  // Suscriptores que pueden ver esta rutina
  accessLevel: {
    type: String,
    enum: ['free', 'basic', 'premium', 'exclusive'],
    default: 'premium',
  },

  // Metadatos
  tags: [String],
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
  publishedAt: Date,
});

// Middleware para actualizar updatedAt
routineSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Índices para búsqueda rápida
routineSchema.index({ category: 1, difficulty: 1 });
routineSchema.index({ instructor: 1 });
routineSchema.index({ isFeatured: 1, isActive: 1 });
routineSchema.index({ title: 'text', description: 'text', tags: 'text' });
routineSchema.index({ 'targetProfile.ageRange': 1 });
routineSchema.index({ 'targetProfile.level': 1 });
routineSchema.index({ 'targetProfile.kneeSensitive': 1 });

// Método para verificar compatibilidad con perfil de usuario
routineSchema.methods.isCompatibleWithProfile = function(userProfile) {
  // Verificar rango de edad
  if (this.targetProfile.ageRange && this.targetProfile.ageRange !== userProfile.ageRange) {
    return false;
  }

  // Verificar nivel
  const levelMap = {
    'beginner': 'principiante',
    'intermediate': 'intermedio',
    'advanced': 'avanzado'
  };
  if (this.targetProfile.level && this.targetProfile.level !== levelMap[userProfile.fitnessLevel]) {
    return false;
  }

  // Verificar constitución
  if (this.targetProfile.constitutions && 
      this.targetProfile.constitutions.length > 0 && 
      !this.targetProfile.constitutions.includes(userProfile.constitution)) {
    return false;
  }

  // Verificar rodillas sensibles
  if (this.targetProfile.kneeSensitive !== userProfile.kneeSensitive) {
    return false;
  }

  // Verificar patologías
  if (this.targetProfile.allowedPathologies && 
      this.targetProfile.allowedPathologies.length > 0 && 
      !this.targetProfile.allowedPathologies.includes(userProfile.pathologies) &&
      !this.targetProfile.allowedPathologies.includes('ninguna')) {
    return false;
  }

  return true;
};

module.exports = mongoose.model('Routine', routineSchema);
