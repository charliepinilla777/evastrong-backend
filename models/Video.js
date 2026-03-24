const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Modelo de Video
 * Almacena información sobre videos de ejercicios individuales
 */
const videoSchema = new Schema({
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
    maxlength: 1000,
  },
  
  // Archivo del video
  video: {
    // Para videos locales
    filename: String,
    filepath: String,
    mimeType: String,
    size: Number, // Tamaño en bytes
    
    // Para videos en cloud (S3, Cloudinary, etc)
    cloudUrl: String,
    cloudId: String,
    
    // Metadatos del video
    duration: Number, // Duración en segundos
    width: Number,
    height: Number,
    bitrate: Number,
  },

  // Thumbnail/Portada
  thumbnail: {
    url: String,
    cloudId: String,
  },

  // Transcoding (múltiples resoluciones)
  transcodedVersions: [
    {
      resolution: String, // '360p', '720p', '1080p'
      url: String,
      size: Number,
    },
  ],

  // Información del upload
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadedByName: String,

  // Categorización
  category: {
    type: String,
    enum: ['exercise', 'tutorial', 'warmup', 'cooldown', 'meditation', 'stretching', 'other'],
    default: 'exercise',
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate',
  },

  // Detalles de ejercicio
  exerciseName: String,
  muscleGroups: [String], // ['chest', 'triceps', 'shoulders']
  equipment: [String], // ['dumbbells', 'bench', 'mat']
  
  // Instrucciones
  instructions: [
    {
      step: Number,
      description: String,
      timestamp: Number, // Segundo del video donde se muestra
    },
  ],

  // Estadísticas
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  userRatings: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // Visibilidad
  visibility: {
    type: String,
    enum: ['private', 'unlisted', 'public'],
    default: 'public',
  },
  accessLevel: {
    type: String,
    enum: ['free', 'basic', 'premium', 'exclusive'],
    default: 'premium',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },

  // Metadatos
  tags: [String],
  keywords: [String],

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

  // Relacionados
  relatedRoutineIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Routine',
    },
  ],
});

// Middleware para actualizar updatedAt
videoSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Índices
videoSchema.index({ uploadedBy: 1 });
videoSchema.index({ category: 1, difficulty: 1 });
videoSchema.index({ exerciseName: 1 });
videoSchema.index({ isFeatured: 1, isActive: 1 });
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Video', videoSchema);
