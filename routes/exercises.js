const express = require('express');
const { body, validationResult } = require('express-validator');
const Exercise = require('../models/Exercise');
const { authenticateToken } = require('../middleware/auth');
const {
  ValidationError,
  NotFoundError,
  AuthorizationError,
  catchAsyncErrors,
} = require('../middleware/errorHandler');

const router = express.Router();

// ========== OBTENER EJERCICIOS ==========

/**
 * GET /exercises
 * Obtener todos los ejercicios (con paginación y filtros)
 */
router.get('/', catchAsyncErrors(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Filtros
  const filters = { isActive: true };

  if (req.query.type) {
    filters.type = req.query.type;
  }

  if (req.query.zone) {
    filters.zone = req.query.zone;
  }

  if (req.query.kneeFriendly !== undefined) {
    filters.kneeFriendly = req.query.kneeFriendly === 'true';
  }

  if (req.query.lowImpact !== undefined) {
    filters.lowImpact = req.query.lowImpact === 'true';
  }

  if (req.query.equipmentNeeded) {
    filters.equipmentNeeded = req.query.equipmentNeeded;
  }

  if (req.query.ageRange) {
    filters['suitableFor.ageRanges'] = req.query.ageRange;
  }

  if (req.query.level) {
    filters['suitableFor.levels'] = req.query.level;
  }

  if (req.query.constitution) {
    filters['suitableFor.constitutions'] = req.query.constitution;
  }

  if (req.query.search) {
    filters.$text = { $search: req.query.search };
  }

  const total = await Exercise.countDocuments(filters);
  const exercises = await Exercise.find(filters)
    .skip(skip)
    .limit(limit)
    .sort({ isFeatured: -1, name: 1 });

  res.json({
    success: true,
    data: exercises,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

/**
 * GET /exercises/:exerciseId
 * Obtener un ejercicio específico
 */
router.get('/:exerciseId', catchAsyncErrors(async (req, res) => {
  const exercise = await Exercise.findOne({
    exerciseId: req.params.exerciseId,
    isActive: true
  });

  if (!exercise) {
    throw new NotFoundError('Ejercicio no encontrado');
  }

  res.json({
    success: true,
    data: exercise,
  });
}));

/**
 * GET /exercises/compatible/:userId
 * Obtener ejercicios compatibles con el perfil de un usuario
 */
router.get('/compatible/:userId', authenticateToken, catchAsyncErrors(async (req, res) => {
  const User = require('../models/User');
  const user = await User.findById(req.params.userId);

  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  // Verificar que el usuario tenga perfil completo
  if (!user.ageRange || !user.constitution || !user.fitnessLevel) {
    throw new ValidationError('El perfil de fitness del usuario está incompleto');
  }

  const userProfile = {
    ageRange: user.ageRange,
    constitution: user.constitution,
    fitnessLevel: user.fitnessLevel,
    kneeSensitive: user.kneeSensitive,
    pathologies: user.pathologies
  };

  // Buscar ejercicios compatibles
  const compatibleExercises = await Exercise.find({
    isActive: true,
    'suitableFor.ageRanges': userProfile.ageRange,
    'suitableFor.constitutions': userProfile.constitution,
    'suitableFor.levels': userProfile.fitnessLevel === 'beginner' ? 'principiante' :
                         userProfile.fitnessLevel === 'intermediate' ? 'intermedio' : 'avanzado'
  });

  // Filtrar por compatibilidad detallada
  const filteredExercises = compatibleExercises.filter(exercise => {
    return exercise.isCompatibleWithProfile(userProfile);
  });

  res.json({
    success: true,
    data: filteredExercises,
    userProfile,
    count: filteredExercises.length
  });
}));

// ========== CREAR EJERCICIO (SOLO ADMIN) ==========

/**
 * POST /exercises
 * Crear nuevo ejercicio (requiere autenticación y rol de admin)
 */
router.post(
  '/',
  authenticateToken,
  [
    body('exerciseId').notEmpty().trim(),
    body('name').notEmpty().trim().isLength({ max: 100 }),
    body('shortDescription').notEmpty().trim().isLength({ max: 200 }),
    body('type').isIn(['fuerza', 'cardio_suave', 'movilidad', 'cardio_intenso', 'flexibilidad', 'equilibrio']),
    body('zone').isIn([
      'cuerpo_entero', 'tren_inferior', 'tren_superior', 'core',
      'piernas_gluteos', 'pecho_brazos', 'espalda', 'pantorrillas', 'hombros', 'abdomen'
    ]),
    body('kneeFriendly').isBoolean(),
    body('lowImpact').optional().isBoolean(),
    body('equipmentNeeded').isIn(['ninguno', 'silla', 'pared', 'mancuernas', 'bandas', 'colchoneta', 'todo']),
  ],
  catchAsyncErrors(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Validación fallida');
    }

    // Verificar que el usuario es admin
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new AuthorizationError('Solo administradores pueden crear ejercicios');
    }

    const {
      exerciseId,
      name,
      shortDescription,
      detailedDescription,
      type,
      zone,
      timeSeconds,
      repetitions,
      restSeconds,
      kneeFriendly,
      lowImpact,
      equipmentNeeded,
      suitableFor,
      imageUrl,
      videoUrl,
      thumbnailUrl,
      tags,
      difficulty,
      caloriesPerMinute
    } = req.body;

    // Verificar que el exerciseId no exista
    const existingExercise = await Exercise.findOne({ exerciseId });
    if (existingExercise) {
      throw new ValidationError('El ID del ejercicio ya existe');
    }

    const exercise = new Exercise({
      exerciseId,
      name,
      shortDescription,
      detailedDescription,
      type,
      zone,
      timeSeconds,
      repetitions,
      restSeconds,
      kneeFriendly,
      lowImpact,
      equipmentNeeded,
      suitableFor: suitableFor || {
        ageRanges: ['18-35', '36-55', '55+'],
        constitutions: ['bajo_peso', 'normopeso', 'sobrepeso', 'obesidad'],
        levels: ['principiante', 'intermedio', 'avanzado'],
        pathologies: ['ninguna']
      },
      imageUrl,
      videoUrl,
      thumbnailUrl,
      tags: tags || [],
      difficulty: difficulty || 3,
      caloriesPerMinute: caloriesPerMinute || 5,
    });

    await exercise.save();

    res.status(201).json({
      success: true,
      message: 'Ejercicio creado exitosamente',
      data: exercise,
    });
  })
);

// ========== ACTUALIZAR EJERCICIO ==========

/**
 * PUT /exercises/:exerciseId
 * Actualizar ejercicio (solo admin)
 */
router.put(
  '/:exerciseId',
  authenticateToken,
  catchAsyncErrors(async (req, res) => {
    const exercise = await Exercise.findOne({ exerciseId: req.params.exerciseId });

    if (!exercise) {
      throw new NotFoundError('Ejercicio no encontrado');
    }

    // Verificar autorización
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new AuthorizationError('No tienes permiso para actualizar este ejercicio');
    }

    // Actualizar campos permitidos
    const updateableFields = [
      'name',
      'shortDescription',
      'detailedDescription',
      'type',
      'zone',
      'timeSeconds',
      'repetitions',
      'restSeconds',
      'kneeFriendly',
      'lowImpact',
      'equipmentNeeded',
      'suitableFor',
      'imageUrl',
      'videoUrl',
      'thumbnailUrl',
      'tags',
      'difficulty',
      'caloriesPerMinute',
      'isActive',
      'isFeatured'
    ];

    updateableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        exercise[field] = req.body[field];
      }
    });

    await exercise.save();

    res.json({
      success: true,
      message: 'Ejercicio actualizado exitosamente',
      data: exercise,
    });
  })
);

// ========== ELIMINAR EJERCICIO ==========

/**
 * DELETE /exercises/:exerciseId
 * Eliminar ejercicio (solo admin)
 */
router.delete(
  '/:exerciseId',
  authenticateToken,
  catchAsyncErrors(async (req, res) => {
    const exercise = await Exercise.findOne({ exerciseId: req.params.exerciseId });

    if (!exercise) {
      throw new NotFoundError('Ejercicio no encontrado');
    }

    // Verificar autorización
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new AuthorizationError('No tienes permiso para eliminar este ejercicio');
    }

    // Soft delete
    exercise.isActive = false;
    await exercise.save();

    res.json({
      success: true,
      message: 'Ejercicio eliminado exitosamente',
    });
  })
);

// ========== CATEGORÍAS Y TIPOS ==========

/**
 * GET /exercises/types
 * Obtener todos los tipos de ejercicios disponibles
 */
router.get('/meta/types', catchAsyncErrors(async (req, res) => {
  const types = ['fuerza', 'cardio_suave', 'movilidad', 'cardio_intenso', 'flexibilidad', 'equilibrio'];
  
  res.json({
    success: true,
    data: types,
  });
}));

/**
 * GET /exercises/zones
 * Obtener todas las zonas de ejercicios disponibles
 */
router.get('/meta/zones', catchAsyncErrors(async (req, res) => {
  const zones = [
    'cuerpo_entero', 'tren_inferior', 'tren_superior', 'core',
    'piernas_gluteos', 'pecho_brazos', 'espalda', 'pantorrillas', 'hombros', 'abdomen'
  ];
  
  res.json({
    success: true,
    data: zones,
  });
}));

/**
 * GET /exercises/equipment
 * Obtener todos los tipos de equipos disponibles
 */
router.get('/meta/equipment', catchAsyncErrors(async (req, res) => {
  const equipment = ['ninguno', 'silla', 'pared', 'mancuernas', 'bandas', 'colchoneta', 'todo'];
  
  res.json({
    success: true,
    data: equipment,
  });
}));

module.exports = router;
