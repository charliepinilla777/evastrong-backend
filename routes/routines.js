const express = require('express');
const { body, validationResult } = require('express-validator');
const Routine = require('../models/Routine');
const User = require('../models/User');
const WorkoutHistory = require('../models/WorkoutHistory');
const AccessLog = require('../models/AccessLog');
const { authenticateToken } = require('../middleware/auth');
const { verifyToken } = require('../middleware/verifyToken');
const { checkSubscription, checkSubscriptionLevel } = require('../middleware/checkSubscription');
const { checkFeatureAccess } = require('../middleware/checkFeatureAccess');
const {
  ValidationError,
  NotFoundError,
  AuthorizationError,
  catchAsyncErrors,
} = require('../middleware/errorHandler');

const router = express.Router();

// ========== OBTENER RUTINAS ==========

/**
 * GET /routines
 * Obtener todas las rutinas (público)
 */
router.get('/', catchAsyncErrors(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Filtros
  const filters = { isActive: true };

  if (req.query.category) {
    filters.category = req.query.category;
  }

  if (req.query.level) {
    filters.level = req.query.level;
  }

  if (req.query.duration) {
    filters.duration = req.query.duration;
  }

  const routines = await Routine.find(filters)
    .populate('instructor', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Routine.countDocuments(filters);

  res.json({
    success: true,
    data: {
      routines,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// ========== RUTINAS PREMIUM (PROTEGIDAS) ==========

/**
 * GET /routines/premium
 * Obtener rutinas premium (requiere suscripción básica)
 */
router.get('/premium', 
  verifyToken, 
  checkSubscription, 
  checkFeatureAccess('premium_workouts'),
  catchAsyncErrors(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = { 
      isActive: true, 
      isPremium: true 
    };

    if (req.query.category) {
      filters.category = req.query.category;
    }

    const routines = await Routine.find(filters)
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Routine.countDocuments(filters);

    res.json({
      success: true,
      data: {
        routines,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        subscriptionInfo: req.subscriptionInfo
      }
    });
  })
);

/**
 * GET /routines/personal-training
 * Obtener rutinas de entrenamiento personal (requiere suscripción premium)
 */
router.get('/personal-training',
  verifyToken,
  checkSubscription,
  checkSubscriptionLevel('premium'),
  checkFeatureAccess('personal_training'),
  catchAsyncErrors(async (req, res) => {
    const routines = await Routine.find({
      isActive: true,
      category: 'personal_training',
      targetPlan: 'premium'
    }).populate('instructor', 'name avatar');

    res.json({
      success: true,
      data: {
        routines,
        subscriptionInfo: req.subscriptionInfo
      }
    });
  })
);

/**
 * POST /routines/custom
 * Crear rutina personalizada (requiere suscripción premium)
 */
router.post('/custom',
  verifyToken,
  checkSubscription,
  checkSubscriptionLevel('premium'),
  checkFeatureAccess('custom_routines', 'create'),
  [
    body('title').notEmpty().trim().isLength({ max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    body('exercises').isArray().withMessage('Los ejercicios deben ser un array'),
    body('exercises.*.exerciseId').notEmpty().withMessage('ID de ejercicio requerido'),
    body('exercises.*.duration').isInt({ min: 1 }).withMessage('Duración debe ser positiva')
  ],
  catchAsyncErrors(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Datos inválidos', errors.array());
    }

    const { title, description, exercises, category, level } = req.body;

    const routine = new Routine({
      title,
      description,
      exercises,
      category: category || 'custom',
      level: level || 'intermediate',
      createdBy: req.user._id,
      isCustom: true,
      isPremium: true,
      targetPlan: 'premium'
    });

    await routine.save();

    // Log de creación
    await AccessLog.logAccess({
      userId: req.user._id,
      feature: 'custom_routines',
      accessType: 'create',
      result: 'granted',
      requestInfo: {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress,
        timestamp: new Date()
      },
      metadata: {
        resourceId: routine._id,
        resourceType: 'routine'
      }
    });

    res.status(201).json({
      success: true,
      data: {
        routine,
        message: 'Rutina personalizada creada exitosamente'
      }
    });
  })
);

// ========== HISTORIAL Y FAVORITOS (deben ir ANTES de /:id) ==========

/**
 * GET /routines/history
 * Devuelve el historial de entrenamientos del usuario. Requiere auth.
 */
router.get('/history', authenticateToken, catchAsyncErrors(async (req, res) => {
  const limit = parseInt(req.query.limit) || 30;

  const records = await WorkoutHistory.find({ user: req.user.id })
    .sort({ completedAt: -1 })
    .limit(limit);

  const totalMinutes  = records.reduce((sum, r) => sum + r.durationMinutes,   0);
  const totalCalories = records.reduce((sum, r) => sum + r.caloriesEstimated, 0);

  res.json({
    success: true,
    data: {
      records,
      stats: {
        totalWorkouts: records.length,
        totalMinutes,
        totalCalories,
      },
    },
  });
}));

/**
 * GET /routines/favorites
 * Devuelve las rutinas favoritas del usuario. Requiere auth.
 */
router.get('/favorites', authenticateToken, catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: 'favoriteRoutines',
    match: { isActive: true },
  });

  if (!user) throw new NotFoundError('Usuario no encontrado');

  res.json({
    success: true,
    data: { routines: user.favoriteRoutines },
  });
}));

// ========== RUTINAS EXISTENTES (SIN PROTECCIÓN) ==========

/**
 * GET /routines/:id
 * Obtener una rutina específica
 */
router.get('/:id', catchAsyncErrors(async (req, res) => {
  const routine = await Routine.findById(req.params.id).populate(
    'instructor',
    'name avatar email'
  );

  if (!routine) {
    throw new NotFoundError('Rutina no encontrada');
  }

  if (!routine.isActive) {
    throw new NotFoundError('Esta rutina no está disponible');
  }

  // Verificar acceso
  const userSubscriptionLevel = req.user?.subscription?.plan || 'free';
  if (
    routine.accessLevel !== 'free' &&
    !['basic', 'premium', 'exclusive'].includes(userSubscriptionLevel)
  ) {
    throw new AuthorizationError(
      'Necesitas una suscripción para acceder a esta rutina'
    );
  }

  // Incrementar vistas
  routine.views += 1;
  await routine.save();

  res.json({
    success: true,
    data: routine,
  });
}));

/**
 * GET /routines/instructor/:instructorId
 * Obtener rutinas de un instructor específico
 */
router.get('/instructor/:instructorId', catchAsyncErrors(async (req, res) => {
  const routines = await Routine.find({
    instructor: req.params.instructorId,
    isActive: true,
  })
    .populate('instructor', 'name avatar')
    .sort({ publishedAt: -1 });

  res.json({
    success: true,
    data: routines,
  });
}));

// ========== CREAR RUTINA (SOLO INSTRUCTORES) ==========

/**
 * POST /routines
 * Crear nueva rutina (requiere autenticación y rol de instructor)
 */
router.post(
  '/',
  authenticateToken,
  [
    body('title').notEmpty().trim().isLength({ max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    body('category').isIn([
      'strength',
      'cardio',
      'flexibility',
      'hiit',
      'pilates',
      'yoga',
      'crossfit',
      'functional',
      'other',
    ]),
    body('difficulty').isIn(['beginner', 'intermediate', 'advanced', 'expert']),
    body('duration').isInt({ min: 1, max: 300 }),
    body('accessLevel').isIn(['free', 'basic', 'premium', 'exclusive']),
  ],
  catchAsyncErrors(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validación fallida');
    }

    // Verificar que el usuario es instructor
    const user = await User.findById(req.user.id);
    if (user.role !== 'instructor' && user.role !== 'admin') {
      throw new AuthorizationError(
        'Solo instructores pueden crear rutinas'
      );
    }

    const { title, description, category, difficulty, duration, accessLevel, exercises, objectives, targetMuscles, equipment } = req.body;

    const routine = new Routine({
      title,
      description,
      category,
      difficulty,
      duration,
      instructor: req.user.id,
      instructorName: user.name,
      accessLevel,
      exercises: exercises || [],
      objectives: objectives || [],
      targetMuscles: targetMuscles || [],
      equipment: equipment || [],
      isActive: false, // Por defecto no activa hasta que se publique
    });

    await routine.save();

    res.status(201).json({
      success: true,
      message: 'Rutina creada exitosamente',
      data: routine,
    });
  })
);

// ========== ACTUALIZAR RUTINA ==========

/**
 * PUT /routines/:id
 * Actualizar rutina (solo el instructor creador o admin)
 */
router.put(
  '/:id',
  authenticateToken,
  catchAsyncErrors(async (req, res) => {
    const routine = await Routine.findById(req.params.id);

    if (!routine) {
      throw new NotFoundError('Rutina no encontrada');
    }

    // Verificar autorización
    if (
      routine.instructor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      throw new AuthorizationError(
        'No tienes permiso para actualizar esta rutina'
      );
    }

    // Actualizar campos permitidos
    const updateableFields = [
      'title',
      'description',
      'category',
      'difficulty',
      'duration',
      'exercises',
      'objectives',
      'targetMuscles',
      'equipment',
      'tags',
      'accessLevel',
    ];

    updateableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        routine[field] = req.body[field];
      }
    });

    await routine.save();

    res.json({
      success: true,
      message: 'Rutina actualizada exitosamente',
      data: routine,
    });
  })
);

// ========== PUBLICAR RUTINA ==========

/**
 * POST /routines/:id/publish
 * Publicar rutina
 */
router.post(
  '/:id/publish',
  authenticateToken,
  catchAsyncErrors(async (req, res) => {
    const routine = await Routine.findById(req.params.id);

    if (!routine) {
      throw new NotFoundError('Rutina no encontrada');
    }

    if (
      routine.instructor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      throw new AuthorizationError(
        'No tienes permiso para publicar esta rutina'
      );
    }

    routine.isActive = true;
    routine.publishedAt = new Date();
    await routine.save();

    res.json({
      success: true,
      message: 'Rutina publicada exitosamente',
      data: routine,
    });
  })
);

// ========== ELIMINAR RUTINA ==========

/**
 * DELETE /routines/:id
 * Eliminar rutina (solo instructor creador o admin)
 */
router.delete(
  '/:id',
  authenticateToken,
  catchAsyncErrors(async (req, res) => {
    const routine = await Routine.findById(req.params.id);

    if (!routine) {
      throw new NotFoundError('Rutina no encontrada');
    }

    if (
      routine.instructor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      throw new AuthorizationError(
        'No tienes permiso para eliminar esta rutina'
      );
    }

    await Routine.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Rutina eliminada exitosamente',
    });
  })
);

// ========== RATING/VALORACIÓN ==========

/**
 * POST /routines/:id/rate
 * Valorar una rutina
 */
router.post(
  '/:id/rate',
  authenticateToken,
  [body('rating').isInt({ min: 1, max: 5 })],
  catchAsyncErrors(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Rating debe estar entre 1 y 5');
    }

    const routine = await Routine.findById(req.params.id);

    if (!routine) {
      throw new NotFoundError('Rutina no encontrada');
    }

    const { rating } = req.body;

    // Actualizar rating promedio
    const totalRating = routine.rating * routine.ratingCount + rating;
    routine.ratingCount += 1;
    routine.rating = totalRating / routine.ratingCount;

    await routine.save();

    res.json({
      success: true,
      message: 'Valoración registrada',
      data: {
        rating: routine.rating,
        ratingCount: routine.ratingCount,
      },
    });
  })
);

// ========== HISTORIAL DE ENTRENAMIENTOS ==========

/**
 * POST /routines/history
 * Guarda un entrenamiento completado. Requiere auth.
 */
router.post('/history', authenticateToken, catchAsyncErrors(async (req, res) => {
  const { routineName, routineId, category, durationMinutes, caloriesEstimated } = req.body;

  if (!routineName || !durationMinutes) {
    throw new ValidationError('routineName y durationMinutes son requeridos');
  }

  const record = await WorkoutHistory.create({
    user: req.user.id,
    routineName,
    routineId: routineId || null,
    category: category || 'general',
    durationMinutes,
    caloriesEstimated: caloriesEstimated || Math.round(durationMinutes * 8),
  });

  res.status(201).json({
    success: true,
    data: { record },
  });
}));

// ========== FAVORITOS (toggle) ==========

/**
 * POST /routines/:id/favorite
 * Agrega o quita una rutina de favoritos (toggle). Requiere auth.
 */
router.post('/:id/favorite', authenticateToken, catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new NotFoundError('Usuario no encontrado');

  const routineId = req.params.id;
  const routine = await Routine.findById(routineId);
  if (!routine) throw new NotFoundError('Rutina no encontrada');

  const index = user.favoriteRoutines.findIndex(
    (id) => id.toString() === routineId
  );

  let isFavorite;
  if (index === -1) {
    user.favoriteRoutines.push(routineId);
    isFavorite = true;
  } else {
    user.favoriteRoutines.splice(index, 1);
    isFavorite = false;
  }

  await user.save();

  res.json({
    success: true,
    data: { isFavorite, favoriteCount: user.favoriteRoutines.length },
  });
}));

module.exports = router;
