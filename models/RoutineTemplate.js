const mongoose = require('mongoose');

/**
 * Modelo de Plantilla de Rutina
 * Almacena plantillas predefinidas para generar rutinas personalizadas
 */
const routineTemplateSchema = new mongoose.Schema({
  // Identificación básica
  templateId: {
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
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },

  // Perfil objetivo
  targetProfile: {
    ageRange: {
      type: String,
      enum: ['18-35', '36-55', '55+'],
      required: true,
    },
    level: {
      type: String,
      enum: ['principiante', 'intermedio', 'avanzado'],
      required: true,
    },
    constitutions: [{
      type: String,
      enum: ['bajo_peso', 'normopeso', 'sobrepeso', 'obesidad']
    }],
    kneeSensitive: {
      type: Boolean,
      required: true,
    },
    allowedPathologies: [{
      type: String,
      enum: ['ninguna', 'cardiaca', 'respiratoria', 'metabolica', 'otra']
    }],
  },

  // Configuración de tiempo
  baseDurationMinutes: {
    type: Number,
    required: true,
    min: 5,
    max: 60,
  },
  adjustableDurations: [{
    type: Number,
    enum: [10, 15, 20],
  }],
  mainCycles: {
    type: Number,
    default: 2,
    min: 1,
    max: 5,
  },

  // Estructura de bloques
  blocks: {
    calentamiento: [{
      exerciseId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      shortDescription: String,
      type: {
        type: String,
        enum: ['fuerza', 'cardio_suave', 'movilidad', 'cardio_intenso', 'flexibilidad', 'equilibrio'],
      },
      zone: String,
      baseTimeSeconds: Number,
      baseRepetitions: String,
      restSeconds: {
        type: Number,
        default: 0,
      },
      kneeFriendly: {
        type: Boolean,
        default: true,
      },
      order: {
        type: Number,
        default: 0,
      },
    }],
    principal: [{
      exerciseId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      shortDescription: String,
      type: {
        type: String,
        enum: ['fuerza', 'cardio_suave', 'movilidad', 'cardio_intenso', 'flexibilidad', 'equilibrio'],
      },
      zone: String,
      baseTimeSeconds: Number,
      baseRepetitions: String,
      restSeconds: {
        type: Number,
        default: 20,
      },
      kneeFriendly: {
        type: Boolean,
        default: true,
      },
      order: {
        type: Number,
        default: 0,
      },
    }],
    enfriamiento: [{
      exerciseId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      shortDescription: String,
      type: {
        type: String,
        enum: ['fuerza', 'cardio_suave', 'movilidad', 'cardio_intenso', 'flexibilidad', 'equilibrio'],
      },
      zone: String,
      baseTimeSeconds: Number,
      baseRepetitions: String,
      restSeconds: {
        type: Number,
        default: 0,
      },
      kneeFriendly: {
        type: Boolean,
        default: true,
      },
      order: {
        type: Number,
        default: 0,
      },
    }],
  },

  // Reglas de ajuste (Mixed para permitir claves numéricas y objetos anidados libres)
  adjustmentRules: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      timeMultipliers: { 10: 0.7, 15: 1.0, 20: 1.3 },
      cycleAdjustments: {
        principiante: { min: 1, max: 2 },
        intermedio: { min: 2, max: 3 },
        avanzado: { min: 3, max: 5 },
      },
    },
  },

  // Metadatos
  tags: [String],
  category: {
    type: String,
    enum: ['fuerza', 'cardio', 'flexibilidad', 'hiit', 'pilates', 'yoga', 'funcional', 'bajo_impacto'],
    default: 'funcional',
  },
  intensity: {
    type: String,
    enum: ['muy_baja', 'baja', 'moderada', 'alta', 'muy_alta'],
    default: 'moderada',
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
routineTemplateSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Índices para búsqueda rápida
routineTemplateSchema.index({ templateId: 1 });
routineTemplateSchema.index({ 'targetProfile.ageRange': 1 });
routineTemplateSchema.index({ 'targetProfile.level': 1 });
routineTemplateSchema.index({ 'targetProfile.kneeSensitive': 1 });
routineTemplateSchema.index({ category: 1, intensity: 1 });
routineTemplateSchema.index({ baseDurationMinutes: 1 });
routineTemplateSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Método para verificar compatibilidad con perfil de usuario
routineTemplateSchema.methods.isCompatibleWithProfile = function(userProfile) {
  // Verificar rango de edad
  if (this.targetProfile.ageRange !== userProfile.ageRange) {
    return false;
  }

  // Verificar nivel
  if (this.targetProfile.level !== userProfile.fitnessLevel) {
    return false;
  }

  // Verificar constitución
  if (!this.targetProfile.constitutions.includes(userProfile.constitution)) {
    return false;
  }

  // Verificar rodillas sensibles
  if (this.targetProfile.kneeSensitive !== userProfile.kneeSensitive) {
    return false;
  }

  // Verificar patologías
  if (!this.targetProfile.allowedPathologies.includes(userProfile.pathologies) &&
      !this.targetProfile.allowedPathologies.includes('ninguna')) {
    return false;
  }

  return true;
};

// Método para generar rutina personalizada desde plantilla
routineTemplateSchema.methods.generatePersonalizedRoutine = function(userProfile, customTime = null) {
  const targetTime = customTime || userProfile.dailyTime || this.baseDurationMinutes;
  const timeMultiplier = this.adjustmentRules.timeMultipliers[targetTime] || 1.0;
  
  // Ajustar ciclos según nivel
  const cycleRange = this.adjustmentRules.cycleAdjustments[this.targetProfile.level];
  const adjustedCycles = userProfile.fitnessLevel === 'principiante' ? 
    cycleRange.min : 
    (userProfile.fitnessLevel === 'avanzado' ? cycleRange.max : cycleRange.min + 1);

  const routine = {
    name: this.name,
    description: this.description,
    duration: targetTime,
    mainCycles: adjustedCycles,
    targetProfile: this.targetProfile,
    blocks: {
      calentamiento: [],
      principal: [],
      enfriamiento: []
    }
  };

  // Procesar cada bloque
  ['calentamiento', 'principal', 'enfriamiento'].forEach(blockType => {
    routine.blocks[blockType] = this.blocks[blockType].map(exercise => {
      const adjustedExercise = { ...exercise };
      
      // Ajustar tiempos
      if (exercise.baseTimeSeconds) {
        adjustedExercise.timeSeconds = Math.round(exercise.baseTimeSeconds * timeMultiplier);
      }
      
      // Ajustar descansos según nivel
      if (blockType === 'principal') {
        const restMultiplier = userProfile.fitnessLevel === 'principiante' ? 1.5 : 
                              (userProfile.fitnessLevel === 'avanzado' ? 0.8 : 1.0);
        adjustedExercise.restSeconds = Math.round(exercise.restSeconds * restMultiplier);
      }
      
      return adjustedExercise;
    });
  });

  return routine;
};

module.exports = mongoose.model('RoutineTemplate', routineTemplateSchema);
