const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Video = require('../models/Video');
const { authenticateToken } = require('../middleware/auth');
const {
  ValidationError,
  NotFoundError,
  AuthorizationError,
  catchAsyncErrors,
  ServerError,
} = require('../middleware/errorHandler');

const router = express.Router();

// ========== CONFIGURACIÓN DE MULTER (UPLOAD) ==========

// Crear directorio de uploads si no existe
const uploadDir = path.join(__dirname, '../uploads/videos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Validar que sea video
    const allowedMimes = [
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-matroska',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de video no soportado. Use MP4, WebM, MOV, AVI o MKV'));
    }
  },
});

// ========== OBTENER VIDEOS ==========

/**
 * GET /videos
 * Obtener todos los videos con filtros y paginación
 */
router.get('/', catchAsyncErrors(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters = { isActive: true, visibility: 'public' };

  // Filtros
  if (req.query.category) {
    filters.category = req.query.category;
  }

  if (req.query.difficulty) {
    filters.difficulty = req.query.difficulty;
  }

  if (req.query.exerciseName) {
    filters.exerciseName = { $regex: req.query.exerciseName, $options: 'i' };
  }

  if (req.query.search) {
    filters.$text = { $search: req.query.search };
  }

  // Verificar suscripción
  const userSubscriptionLevel = req.user?.subscription?.plan || 'free';
  filters.accessLevel = {
    $in: ['free', userSubscriptionLevel],
  };

  const total = await Video.countDocuments(filters);
  const videos = await Video.find(filters)
    .populate('uploadedBy', 'name avatar')
    .skip(skip)
    .limit(limit)
    .sort({ isFeatured: -1, createdAt: -1 });

  res.json({
    success: true,
    data: videos,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

/**
 * GET /videos/:id
 * Obtener video específico
 */
router.get('/:id', catchAsyncErrors(async (req, res) => {
  const video = await Video.findById(req.params.id)
    .populate('uploadedBy', 'name avatar email')
    .populate('relatedRoutineIds', 'title duration');

  if (!video) {
    throw new NotFoundError('Video no encontrado');
  }

  if (!video.isActive) {
    throw new NotFoundError('Este video no está disponible');
  }

  // Verificar acceso
  const userSubscriptionLevel = req.user?.subscription?.plan || 'free';
  if (
    video.accessLevel !== 'free' &&
    !['basic', 'premium', 'exclusive'].includes(userSubscriptionLevel)
  ) {
    throw new AuthorizationError(
      'Necesitas una suscripción para acceder a este video'
    );
  }

  // Incrementar vistas
  video.views += 1;
  await video.save();

  res.json({
    success: true,
    data: video,
  });
}));

/**
 * GET /videos/uploader/:uploaderId
 * Obtener videos de un usuario específico
 */
router.get('/uploader/:uploaderId', catchAsyncErrors(async (req, res) => {
  const videos = await Video.find({
    uploadedBy: req.params.uploaderId,
    isActive: true,
  })
    .populate('uploadedBy', 'name avatar')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: videos,
  });
}));

// ========== SUBIR VIDEO ==========

/**
 * POST /videos/upload
 * Subir nuevo video
 */
router.post(
  '/upload',
  authenticateToken,
  upload.single('video'),
  [
    body('title').notEmpty().trim().isLength({ min: 3, max: 100 }),
    body('description').optional().trim().isLength({ max: 1000 }),
    body('category').isIn([
      'exercise',
      'tutorial',
      'warmup',
      'cooldown',
      'meditation',
      'stretching',
      'other',
    ]),
    body('difficulty').isIn(['beginner', 'intermediate', 'advanced']),
    body('exerciseName').optional().trim(),
  ],
  catchAsyncErrors(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Eliminar archivo si hay error de validación
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      throw new ValidationError('Validación fallida');
    }

    if (!req.file) {
      throw new ValidationError('Por favor sube un archivo de video');
    }

    const {
      title,
      description,
      category,
      difficulty,
      exerciseName,
      muscleGroups,
      equipment,
      accessLevel,
      tags,
    } = req.body;

    // Crear documento de video
    const video = new Video({
      title,
      description,
      category,
      difficulty,
      exerciseName,
      uploadedBy: req.user.id,
      uploadedByName: req.user.name,
      video: {
        filename: req.file.filename,
        filepath: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
      muscleGroups: muscleGroups ? JSON.parse(muscleGroups) : [],
      equipment: equipment ? JSON.parse(equipment) : [],
      accessLevel: accessLevel || 'premium',
      tags: tags ? JSON.parse(tags) : [],
      visibility: 'unlisted', // Por defecto sin listar hasta revisión
    });

    await video.save();

    // Disparar evento de post-procesamiento (opcional)
    // Aquí podrías agregar ffmpeg para generar thumbnail y transcodificar

    res.status(201).json({
      success: true,
      message: 'Video subido exitosamente',
      data: video,
    });
  })
);

// ========== ACTUALIZAR VIDEO ==========

/**
 * PUT /videos/:id
 * Actualizar información del video
 */
router.put(
  '/:id',
  authenticateToken,
  catchAsyncErrors(async (req, res) => {
    const video = await Video.findById(req.params.id);

    if (!video) {
      throw new NotFoundError('Video no encontrado');
    }

    // Verificar autorización
    if (
      video.uploadedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      throw new AuthorizationError(
        'No tienes permiso para actualizar este video'
      );
    }

    // Campos actualizables
    const updateableFields = [
      'title',
      'description',
      'category',
      'difficulty',
      'exerciseName',
      'muscleGroups',
      'equipment',
      'instructions',
      'tags',
      'visibility',
      'accessLevel',
    ];

    updateableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        video[field] = req.body[field];
      }
    });

    await video.save();

    res.json({
      success: true,
      message: 'Video actualizado exitosamente',
      data: video,
    });
  })
);

// ========== PUBLICAR VIDEO ==========

/**
 * POST /videos/:id/publish
 * Hacer video público
 */
router.post(
  '/:id/publish',
  authenticateToken,
  catchAsyncErrors(async (req, res) => {
    const video = await Video.findById(req.params.id);

    if (!video) {
      throw new NotFoundError('Video no encontrado');
    }

    if (
      video.uploadedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      throw new AuthorizationError(
        'No tienes permiso para publicar este video'
      );
    }

    video.visibility = 'public';
    video.isActive = true;
    video.publishedAt = new Date();
    await video.save();

    res.json({
      success: true,
      message: 'Video publicado exitosamente',
      data: video,
    });
  })
);

// ========== ELIMINAR VIDEO ==========

/**
 * DELETE /videos/:id
 * Eliminar video
 */
router.delete(
  '/:id',
  authenticateToken,
  catchAsyncErrors(async (req, res) => {
    const video = await Video.findById(req.params.id);

    if (!video) {
      throw new NotFoundError('Video no encontrado');
    }

    if (
      video.uploadedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      throw new AuthorizationError(
        'No tienes permiso para eliminar este video'
      );
    }

    // Eliminar archivo del servidor
    if (video.video?.filepath && fs.existsSync(video.video.filepath)) {
      fs.unlinkSync(video.video.filepath);
    }

    await Video.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Video eliminado exitosamente',
    });
  })
);

// ========== RATING/VALORACIÓN ==========

/**
 * POST /videos/:id/rate
 * Valorar un video
 */
router.post(
  '/:id/rate',
  authenticateToken,
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().trim().isLength({ max: 500 }),
  ],
  catchAsyncErrors(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validación fallida');
    }

    const video = await Video.findById(req.params.id);

    if (!video) {
      throw new NotFoundError('Video no encontrado');
    }

    const { rating, comment } = req.body;

    // Remover rating anterior del mismo usuario si existe
    video.userRatings = video.userRatings.filter(
      (r) => r.userId.toString() !== req.user.id
    );

    // Agregar nuevo rating
    video.userRatings.push({
      userId: req.user.id,
      rating,
      comment,
    });

    // Recalcular promedio
    const totalRating = video.userRatings.reduce(
      (sum, r) => sum + r.rating,
      0
    );
    video.ratings.average = totalRating / video.userRatings.length;
    video.ratings.count = video.userRatings.length;

    await video.save();

    res.json({
      success: true,
      message: 'Valoración registrada',
      data: video.ratings,
    });
  })
);

// ========== OBTENER VIDEO PARA DESCARGAR/STREAM ==========

/**
 * GET /videos/:id/stream
 * Stream de video (para reproducción)
 */
router.get(
  '/:id/stream',
  catchAsyncErrors(async (req, res) => {
    const video = await Video.findById(req.params.id);

    if (!video || !video.video?.filepath) {
      throw new NotFoundError('Video no encontrado');
    }

    if (!fs.existsSync(video.video.filepath)) {
      throw new NotFoundError('Archivo de video no encontrado');
    }

    const stat = fs.statSync(video.video.filepath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.status(416).send(
          'Requested range not satisfiable\n' + start + ' >= ' + fileSize
        );
        return;
      }

      res.status(206).set({
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': end - start + 1,
        'Content-Type': video.video.mimeType,
      });

      const file = fs.createReadStream(video.video.filepath, {
        start,
        end,
      });
      file.pipe(res);
    } else {
      res.set({
        'Content-Length': fileSize,
        'Content-Type': video.video.mimeType,
      });

      const file = fs.createReadStream(video.video.filepath);
      file.pipe(res);
    }
  })
);

module.exports = router;
