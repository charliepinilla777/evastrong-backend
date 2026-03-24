const express = require('express');
const jwt = require('jsonwebtoken');
const Plan = require('../models/Plan');
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

function getAllowedLevels(plan) {
  if (plan === 'premium') return ['free', 'basic', 'premium'];
  if (plan === 'basic' || plan === 'trial') return ['free', 'basic'];
  return ['free'];
}

/**
 * GET /plans
 * Retorna los 7 planes semanales (siempre visibles)
 * Las comidas se marcan como bloqueadas según el plan del usuario
 */
router.get('/', catchAsyncErrors(async (req, res) => {
  const userPlan = await getUserPlan(req);
  const allowedLevels = getAllowedLevels(userPlan);

  const plans = await Plan.find({ isActive: true })
    .sort({ dayNumber: 1 })
    .populate({
      path: 'meals.recipe',
      select: 'name category imageUrl accessLevel nutrition prepTime cookTime',
    });

  // Marcar comidas bloqueadas según el plan del usuario
  const enriched = plans.map((plan) => {
    const planObj = plan.toObject();
    planObj.meals = planObj.meals.map((meal) => ({
      ...meal,
      isLocked: meal.recipe
        ? !allowedLevels.includes(meal.recipe.accessLevel)
        : false,
    }));
    planObj.userPlan = userPlan;
    return planObj;
  });

  res.json({ success: true, data: enriched });
}));

/**
 * GET /plans/:id
 * Detalle de un plan con recetas completas (ingredientes y pasos si es accesible)
 */
router.get('/:id', catchAsyncErrors(async (req, res) => {
  const userPlan = await getUserPlan(req);
  const allowedLevels = getAllowedLevels(userPlan);

  const plan = await Plan.findById(req.params.id).populate({
    path: 'meals.recipe',
  });

  if (!plan || !plan.isActive) throw new NotFoundError('Plan no encontrado');

  const planObj = plan.toObject();

  // Ocultar ingredientes/pasos de recetas bloqueadas
  planObj.meals = planObj.meals.map((meal) => {
    const isLocked = meal.recipe
      ? !allowedLevels.includes(meal.recipe.accessLevel)
      : false;
    if (isLocked && meal.recipe) {
      const { ingredients, steps, ...rest } = meal.recipe;
      meal.recipe = rest;
    }
    return { ...meal, isLocked };
  });

  planObj.userPlan = userPlan;

  res.json({ success: true, data: planObj });
}));

/**
 * POST /plans — Solo admin
 */
router.post('/', verifyToken, catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user.id || req.user._id);
  if (!user || user.role !== 'admin') {
    throw new AuthorizationError('Solo admins pueden crear planes');
  }
  const plan = new Plan(req.body);
  await plan.save();
  res.status(201).json({ success: true, data: plan });
}));

/**
 * PUT /plans/:id — Solo admin
 */
router.put('/:id', verifyToken, catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user.id || req.user._id);
  if (!user || user.role !== 'admin') {
    throw new AuthorizationError('Solo admins pueden editar planes');
  }
  const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  if (!plan) throw new NotFoundError('Plan no encontrado');
  res.json({ success: true, data: plan });
}));

/**
 * DELETE /plans/:id — Solo admin
 */
router.delete('/:id', verifyToken, catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user.id || req.user._id);
  if (!user || user.role !== 'admin') {
    throw new AuthorizationError('Solo admins pueden eliminar planes');
  }
  await Plan.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Plan eliminado exitosamente' });
}));

module.exports = router;
