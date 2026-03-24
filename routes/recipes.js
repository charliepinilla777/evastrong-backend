const express = require('express');
const jwt = require('jsonwebtoken');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { verifyToken } = require('../middleware/verifyToken');
const {
  NotFoundError,
  AuthorizationError,
  catchAsyncErrors,
} = require('../middleware/errorHandler');

const router = express.Router();

// Helper: obtener plan del usuario desde el token (opcional)
async function getUserPlan(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) return 'free';
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id || decoded._id).select('subscription');
    return user?.subscription?.plan || 'free';
  } catch (_) {
    return 'free';
  }
}

// Helper: qué accessLevels puede ver según su plan
function getAllowedLevels(plan) {
  if (plan === 'premium') return ['free', 'basic', 'premium'];
  if (plan === 'basic' || plan === 'trial') return ['free', 'basic'];
  return ['free'];
}

// ========== OBTENER RECETAS ==========

/**
 * GET /recipes
 * Retorna recetas accesibles + recetas bloqueadas (para mostrar el lock)
 * Query params: category, page, limit
 */
router.get('/', catchAsyncErrors(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;

  const userPlan = await getUserPlan(req);
  const allowedLevels = getAllowedLevels(userPlan);

  const baseFilter = { isActive: true };
  if (req.query.category) baseFilter.category = req.query.category;

  // Recetas accesibles (con datos completos)
  const accessibleFilter = { ...baseFilter, accessLevel: { $in: allowedLevels } };
  const recipes = await Recipe.find(accessibleFilter)
    .sort({ isFeatured: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Recipe.countDocuments(accessibleFilter);

  // Recetas bloqueadas (sin ingredientes ni pasos)
  const lockedFilter = { ...baseFilter, accessLevel: { $nin: allowedLevels } };
  const lockedRecipes = await Recipe.find(lockedFilter)
    .select('name category imageUrl accessLevel nutrition prepTime cookTime isFeatured')
    .sort({ isFeatured: -1, createdAt: -1 });

  res.json({
    success: true,
    data: {
      recipes,
      lockedRecipes,
      userPlan,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
}));

// ========== DETALLE DE RECETA ==========

/**
 * GET /recipes/:id
 * Detalle completo — verifica acceso según plan
 */
router.get('/:id', catchAsyncErrors(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe || !recipe.isActive) throw new NotFoundError('Receta no encontrada');

  const userPlan = await getUserPlan(req);
  const allowedLevels = getAllowedLevels(userPlan);

  if (!allowedLevels.includes(recipe.accessLevel)) {
    throw new AuthorizationError('Necesitas una suscripción para ver esta receta');
  }

  res.json({ success: true, data: recipe });
}));

// ========== CREAR RECETA (SOLO ADMIN) ==========

/**
 * POST /recipes
 */
router.post('/', verifyToken, catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user.id || req.user._id);
  if (!user || user.role !== 'admin') {
    throw new AuthorizationError('Solo admins pueden crear recetas');
  }

  const recipe = new Recipe(req.body);
  await recipe.save();

  res.status(201).json({ success: true, data: recipe });
}));

// ========== ACTUALIZAR RECETA (SOLO ADMIN) ==========

/**
 * PUT /recipes/:id
 */
router.put('/:id', verifyToken, catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user.id || req.user._id);
  if (!user || user.role !== 'admin') {
    throw new AuthorizationError('Solo admins pueden editar recetas');
  }

  const recipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!recipe) throw new NotFoundError('Receta no encontrada');

  res.json({ success: true, data: recipe });
}));

// ========== ELIMINAR RECETA (SOLO ADMIN) ==========

/**
 * DELETE /recipes/:id
 */
router.delete('/:id', verifyToken, catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user.id || req.user._id);
  if (!user || user.role !== 'admin') {
    throw new AuthorizationError('Solo admins pueden eliminar recetas');
  }

  await Recipe.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Receta eliminada exitosamente' });
}));

module.exports = router;
