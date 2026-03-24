const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const RoutineTemplate = require('../models/RoutineTemplate');
const Exercise = require('../models/Exercise');
const { authenticateToken } = require('../middleware/auth');
const {
  ValidationError,
  NotFoundError,
  catchAsyncErrors,
} = require('../middleware/errorHandler');

const router = express.Router();

// ========== OBTENER RUTINA RECOMENDADA ==========

/**
 * GET /routine-recommendations/personalized
 * Obtener rutina personalizada basada en el perfil del usuario
 */
router.get('/personalized', authenticateToken, catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user.id);
  
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
    pathologies: user.pathologies,
    dailyTime: user.dailyTime || 15
  };

  // Buscar plantillas compatibles
  const compatibleTemplates = await RoutineTemplate.find({
    isActive: true,
    'targetProfile.ageRange': userProfile.ageRange,
    'targetProfile.level': userProfile.fitnessLevel,
    'targetProfile.constitutions': userProfile.constitution,
    'targetProfile.kneeSensitive': userProfile.kneeSensitive,
    'targetProfile.allowedPathologies': {
      $in: [userProfile.pathologies, 'ninguna']
    }
  }).sort({ isFeatured: -1, createdAt: -1 });

  if (compatibleTemplates.length === 0) {
    throw new NotFoundError('No se encontraron rutinas compatibles con tu perfil');
  }

  // Seleccionar la mejor plantilla (priorizar featured)
  const selectedTemplate = compatibleTemplates[0];
  
  // Generar rutina personalizada
  const personalizedRoutine = selectedTemplate.generatePersonalizedRoutine(userProfile);

  res.json({
    success: true,
    data: {
      routine: personalizedRoutine,
      template: {
        templateId: selectedTemplate.templateId,
        name: selectedTemplate.name,
        description: selectedTemplate.description
      },
      userProfile
    }
  });
}));

/**
 * GET /routine-recommendations/templates
 * Obtener todas las plantillas de rutinas disponibles
 */
router.get('/templates', authenticateToken, catchAsyncErrors(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Filtros
  const filters = { isActive: true };

  if (req.query.ageRange) {
    filters['targetProfile.ageRange'] = req.query.ageRange;
  }

  if (req.query.level) {
    filters['targetProfile.level'] = req.query.level;
  }

  if (req.query.kneeSensitive !== undefined) {
    filters['targetProfile.kneeSensitive'] = req.query.kneeSensitive === 'true';
  }

  if (req.query.category) {
    filters.category = req.query.category;
  }

  if (req.query.intensity) {
    filters.intensity = req.query.intensity;
  }

  const total = await RoutineTemplate.countDocuments(filters);
  const templates = await RoutineTemplate.find(filters)
    .select('-blocks') // No incluir bloques para reducir tamaño
    .skip(skip)
    .limit(limit)
    .sort({ isFeatured: -1, createdAt: -1 });

  res.json({
    success: true,
    data: templates,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

/**
 * GET /routine-recommendations/templates/:templateId
 * Obtener detalles de una plantilla específica
 */
router.get('/templates/:templateId', authenticateToken, catchAsyncErrors(async (req, res) => {
  const template = await RoutineTemplate.findOne({
    templateId: req.params.templateId,
    isActive: true
  });

  if (!template) {
    throw new NotFoundError('Plantilla no encontrada');
  }

  res.json({
    success: true,
    data: template,
  });
}));

/**
 * POST /routine-recommendations/generate
 * Generar rutina personalizada desde una plantilla específica
 */
router.post('/generate', authenticateToken, [
  body('templateId').notEmpty().trim(),
  body('customTime').optional().isInt({ min: 10, max: 20 }),
], catchAsyncErrors(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validación fallida');
  }

  const user = await User.findById(req.user.id);
  
  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  const { templateId, customTime } = req.body;

  const template = await RoutineTemplate.findOne({
    templateId: templateId,
    isActive: true
  });

  if (!template) {
    throw new NotFoundError('Plantilla no encontrada');
  }

  const userProfile = {
    ageRange: user.ageRange,
    constitution: user.constitution,
    fitnessLevel: user.fitnessLevel,
    kneeSensitive: user.kneeSensitive,
    pathologies: user.pathologies,
    dailyTime: user.dailyTime || 15
  };

  // Verificar compatibilidad
  if (!template.isCompatibleWithProfile(userProfile)) {
    throw new ValidationError('La plantilla no es compatible con tu perfil');
  }

  // Generar rutina personalizada
  const personalizedRoutine = template.generatePersonalizedRoutine(userProfile, customTime);

  res.json({
    success: true,
    data: {
      routine: personalizedRoutine,
      template: {
        templateId: template.templateId,
        name: template.name,
        description: template.description
      },
      userProfile
    }
  });
}));

// ========== PERFIL DE USUARIO ==========

/**
 * GET /routine-recommendations/profile
 * Obtener perfil de fitness del usuario actual
 */
router.get('/profile', authenticateToken, catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    'ageRange constitution fitnessLevel kneeSensitive pathologies dailyTime age gender'
  );

  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  res.json({
    success: true,
    data: user,
  });
}));

/**
 * PUT /routine-recommendations/profile
 * Actualizar perfil de fitness del usuario
 */
router.put('/profile', authenticateToken, [
  body('ageRange').isIn(['18-35', '36-55', '55+']),
  body('constitution').isIn(['bajo_peso', 'normopeso', 'sobrepeso', 'obesidad']),
  body('fitnessLevel').isIn(['beginner', 'intermediate', 'advanced']),
  body('kneeSensitive').isBoolean(),
  body('pathologies').isIn(['ninguna', 'cardiaca', 'respiratoria', 'metabolica', 'otra']),
  body('dailyTime').optional().isInt({ min: 10, max: 20 }),
], catchAsyncErrors(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validación fallida');
  }

  const user = await User.findById(req.user.id);
  
  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  const { ageRange, constitution, fitnessLevel, kneeSensitive, pathologies, dailyTime } = req.body;

  // Actualizar campos del perfil
  user.ageRange = ageRange;
  user.constitution = constitution;
  user.fitnessLevel = fitnessLevel;
  user.kneeSensitive = kneeSensitive;
  user.pathologies = pathologies;
  if (dailyTime) {
    user.dailyTime = dailyTime;
  }

  await user.save();

  res.json({
    success: true,
    message: 'Perfil actualizado exitosamente',
    data: {
      ageRange: user.ageRange,
      constitution: user.constitution,
      fitnessLevel: user.fitnessLevel,
      kneeSensitive: user.kneeSensitive,
      pathologies: user.pathologies,
      dailyTime: user.dailyTime
    }
  });
}));

module.exports = router;
