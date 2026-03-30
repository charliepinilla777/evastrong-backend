const express = require('express');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { authenticateToken } = require('../middleware/auth');
const { catchAsyncErrors } = require('../middleware/errorHandler');

const router = express.Router();

// ========== LÓGICA DE MAPEO PERFIL → DIETA ==========

/**
 * Dado el perfil del usuario, devuelve:
 * - nutritionFilter: filtros MongoDB sobre campos nutrition.*
 * - tagIncludes: tags relevantes para búsqueda de fallback
 * - dietLabel: nombre del plan asignado
 * - dietIcon: emoji representativo
 */
function buildDietCriteria(userProfile) {
  const { constitution, pathologies, ageRange, goals = [] } = userProfile;

  let nutritionFilter = {};
  const tagIncludes = [];
  let dietLabel = 'Plan Equilibrado';
  let dietIcon = '🥗';

  // ── Constitución corporal ──────────────────────────────────────────────────
  if (constitution === 'obesidad') {
    nutritionFilter['nutrition.calories'] = { $lte: 350 };
    tagIncludes.push('bajas_calorias', 'light', 'sin_azucar', 'bajo_grasa');
    dietLabel = 'Plan Control de Peso';
    dietIcon = '⚖️';
  } else if (constitution === 'sobrepeso') {
    nutritionFilter['nutrition.calories'] = { $lte: 450 };
    tagIncludes.push('bajas_calorias', 'light', 'bajo_grasa');
    dietLabel = 'Plan Déficit Saludable';
    dietIcon = '⚖️';
  } else if (constitution === 'bajo_peso') {
    nutritionFilter['nutrition.calories'] = { $gte: 400 };
    tagIncludes.push('altas_calorias', 'proteico', 'energizante');
    dietLabel = 'Plan Ganancia de Masa';
    dietIcon = '💪';
  } else {
    // normopeso — sin restricción calórica
    dietLabel = 'Plan Equilibrado';
    dietIcon = '🌿';
  }

  // ── Objetivos (pueden sobreescribir el label) ──────────────────────────────
  if (goals.includes('muscle_gain') || goals.includes('masa_muscular')) {
    nutritionFilter['nutrition.protein'] = { $gte: 15 };
    tagIncludes.push('proteico', 'musculacion');
    dietLabel = 'Plan Musculación';
    dietIcon = '💪';
  } else if (goals.includes('weight_loss') || goals.includes('perdida_peso')) {
    // Asegurar límite calórico aunque la constitución sea normopeso
    if (!nutritionFilter['nutrition.calories']) {
      nutritionFilter['nutrition.calories'] = { $lte: 400 };
    }
    tagIncludes.push('bajas_calorias', 'saciante');
    dietLabel = 'Plan Pérdida de Peso';
    dietIcon = '🔥';
  } else if (goals.includes('endurance') || goals.includes('resistencia')) {
    tagIncludes.push('energia', 'carbohidratos', 'pre_entreno');
    dietLabel = 'Plan Resistencia';
    dietIcon = '⚡';
  }

  // ── Patologías (restricciones médicas, máxima prioridad) ──────────────────
  if (pathologies === 'cardiaca') {
    nutritionFilter['nutrition.fat'] = { $lte: 12 };
    tagIncludes.push('cardiaco', 'bajo_sodio', 'bajo_grasa');
    dietLabel = 'Plan Cardio Saludable';
    dietIcon = '❤️';
  } else if (pathologies === 'metabolica') {
    nutritionFilter['nutrition.carbs'] = { $lte: 35 };
    tagIncludes.push('bajo_azucar', 'sin_azucar', 'diabetico');
    dietLabel = 'Plan Metabólico';
    dietIcon = '🩺';
  } else if (pathologies === 'respiratoria') {
    tagIncludes.push('antiinflamatorio', 'vitamina_c', 'suave');
    dietLabel = 'Plan Respiratorio';
    dietIcon = '🫁';
  }

  // ── Rango de edad ─────────────────────────────────────────────────────────
  if (ageRange === '55+') {
    tagIncludes.push('suave', 'digestivo', 'antiinflamatorio');
    if (dietLabel === 'Plan Equilibrado') {
      dietLabel = 'Plan Wellness 55+';
      dietIcon = '🌸';
    }
  }

  return { nutritionFilter, tagIncludes, dietLabel, dietIcon };
}

// ========== ENDPOINT PRINCIPAL ==========

/**
 * GET /diet-recommendations/personalized
 * Devuelve recetas recomendadas según el perfil físico del usuario
 */
router.get('/personalized', authenticateToken, catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    'ageRange constitution fitnessLevel pathologies goals plan'
  );

  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }

  // Si el perfil no está completo, indicarlo sin error
  if (!user.constitution || !user.ageRange) {
    return res.json({
      success: true,
      data: {
        profileComplete: false,
        recommendations: [],
        dietLabel: null,
        dietIcon: null,
      },
    });
  }

  const userProfile = {
    constitution: user.constitution,
    ageRange: user.ageRange,
    fitnessLevel: user.fitnessLevel,
    pathologies: user.pathologies || 'ninguna',
    goals: user.goals || [],
  };

  const { nutritionFilter, tagIncludes, dietLabel, dietIcon } =
    buildDietCriteria(userProfile);

  // Determinar niveles de acceso según el plan del usuario
  const plan = user.plan || 'free';
  let allowedLevels = ['free'];
  if (plan === 'basic') allowedLevels = ['free', 'basic'];
  if (plan === 'premium' || plan === 'exclusive') allowedLevels = ['free', 'basic', 'premium'];

  const baseFilter = { isActive: true, accessLevel: { $in: allowedLevels } };

  // 1ª búsqueda: recetas que cumplen los filtros nutricionales del perfil
  let recipes = [];
  if (Object.keys(nutritionFilter).length > 0) {
    recipes = await Recipe.find({ ...baseFilter, ...nutritionFilter })
      .sort({ isFeatured: -1, 'nutrition.protein': -1 })
      .limit(8);
  }

  // 2ª búsqueda (fallback): por tags si no hay suficientes resultados
  if (recipes.length < 4 && tagIncludes.length > 0) {
    const tagRecipes = await Recipe.find({ ...baseFilter, tags: { $in: tagIncludes } })
      .sort({ isFeatured: -1 })
      .limit(8);

    const seen = new Set(recipes.map((r) => r._id.toString()));
    for (const r of tagRecipes) {
      if (!seen.has(r._id.toString())) {
        recipes.push(r);
        seen.add(r._id.toString());
      }
    }
  }

  // 3ª búsqueda (fallback final): recetas destacadas accesibles
  if (recipes.length < 4) {
    const featured = await Recipe.find(baseFilter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(8);

    const seen = new Set(recipes.map((r) => r._id.toString()));
    for (const r of featured) {
      if (!seen.has(r._id.toString())) {
        recipes.push(r);
        seen.add(r._id.toString());
      }
    }
  }

  res.json({
    success: true,
    data: {
      profileComplete: true,
      dietLabel,
      dietIcon,
      userProfile: {
        constitution: userProfile.constitution,
        ageRange: userProfile.ageRange,
        pathologies: userProfile.pathologies,
        goals: userProfile.goals,
      },
      recommendations: recipes.slice(0, 8).map((r) => ({
        _id: r._id,
        name: r.name,
        description: r.description,
        imageUrl: r.imageUrl,
        category: r.category,
        accessLevel: r.accessLevel,
        nutrition: r.nutrition,
        prepTime: r.prepTime,
        cookTime: r.cookTime,
        tags: r.tags,
        isFeatured: r.isFeatured,
      })),
    },
  });
}));

module.exports = router;
