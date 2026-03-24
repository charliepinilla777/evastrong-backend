require('dotenv').config();
const mongoose = require('mongoose');
const Plan = require('../models/Plan');
const Recipe = require('../models/Recipe');
const connectDB = require('../config/database');

// Helper: buscar receta por nombre (búsqueda parcial, case-insensitive)
async function findRecipe(partialName) {
  // Escapar caracteres especiales de regex
  const escaped = partialName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const recipe = await Recipe.findOne({
    name: { $regex: escaped, $options: 'i' },
    isActive: true,
  });
  if (!recipe) {
    console.warn(`  ⚠️  Receta no encontrada: "${partialName}"`);
    return null;
  }
  return recipe._id;
}

async function seedPlans() {
  try {
    await connectDB();
    console.log('\n📅 Iniciando seed de planes semanales...\n');

    // Eliminar planes existentes
    const deleted = await Plan.deleteMany({});
    console.log(`🗑️  ${deleted.deletedCount} planes anteriores eliminados\n`);

    // ==================== DÍA 1 ====================
    console.log('📌 Construyendo Día 1...');
    const dia1 = new Plan({
      name: 'Día 1: Pérdida de peso saludable',
      dayNumber: 1,
      theme: 'perdida_peso',
      description: 'Plan equilibrado enfocado en déficit calórico saludable. Alto en proteína y fibra para preservar músculo mientras se pierde grasa. Sin hambre y sin restricciones extremas.',
      accessLevel: 'free',
      nutrition: { caloriesMin: 1170, caloriesMax: 1450 },
      meals: [
        {
          mealType: 'desayuno',
          label: 'Desayuno',
          recipe: await findRecipe('Omelette ligero + tostada'),
          optional: false,
        },
        {
          mealType: 'snack_manana',
          label: 'Snack mañana',
          recipe: await findRecipe('Snack mañana – Yogur'),
          optional: false,
        },
        {
          mealType: 'almuerzo',
          label: 'Almuerzo',
          recipe: await findRecipe('Almuerzo – Ensalada ligera'),
          optional: false,
        },
        {
          mealType: 'snack_tarde',
          label: 'Snack tarde',
          recipe: await findRecipe('Snack tarde – Zanahoria'),
          optional: false,
        },
        {
          mealType: 'cena',
          label: 'Cena',
          recipe: await findRecipe('Cena – Tacos de lechuga'),
          optional: false,
        },
        {
          mealType: 'post_entreno',
          label: 'Post-entreno (opcional)',
          recipe: await findRecipe('Post-entreno – Shake proteína'),
          optional: true,
          note: 'Solo si entrenaste hoy. Suma ~280 kcal.',
        },
      ].filter(m => m.recipe !== null),
    });

    await dia1.save();
    console.log(`  ✅ ${dia1.name} creado (${dia1.meals.length} comidas)\n`);

    // ==================== DÍA 2 ====================
    console.log('📌 Construyendo Día 2...');
    const dia2 = new Plan({
      name: 'Día 2: Cola y piernas (carbos estratégicos)',
      dayNumber: 2,
      theme: 'gluteos_piernas',
      description: 'Plan diseñado para días de entrenamiento de glúteos y piernas. Más carbohidratos de calidad alrededor del entreno para mayor rendimiento y recuperación muscular.',
      accessLevel: 'free',
      nutrition: { caloriesMin: 1420, caloriesMax: 1600 },
      meals: [
        {
          mealType: 'desayuno',
          label: 'Desayuno',
          recipe: await findRecipe('D2 – Desayuno avena para glúteos'),
          optional: false,
        },
        {
          mealType: 'snack_manana',
          label: 'Pre-entreno',
          recipe: await findRecipe('Banana con mantequilla de maní'),
          optional: false,
          note: 'Consumir 30–45 min antes del entreno de glúteos/piernas.',
        },
        {
          mealType: 'almuerzo',
          label: 'Almuerzo',
          recipe: await findRecipe('Bowl de pollo, camote y brócoli'),
          optional: false,
        },
        {
          mealType: 'snack_tarde',
          label: 'Post-entreno',
          recipe: await findRecipe('D2 – Snack post entreno yogur proteico'),
          optional: false,
          note: 'Dentro de los 60 minutos posteriores al entreno.',
        },
        {
          mealType: 'cena',
          label: 'Cena',
          recipe: await findRecipe('Cena de salmón y quinoa para glúteos'),
          optional: false,
        },
        {
          mealType: 'post_entreno',
          label: 'Batido noche (opcional)',
          recipe: await findRecipe('D2 – Batido noche recuperación'),
          optional: true,
          note: 'Solo si el entreno fue muy intenso. Tomar 1–2h antes de dormir.',
        },
      ].filter(m => m.recipe !== null),
    });

    await dia2.save();
    console.log(`  ✅ ${dia2.name} creado (${dia2.meals.length} comidas)\n`);

    // ==================== DÍA 3 ====================
    console.log('📌 Construyendo Día 3...');
    const dia3 = new Plan({
      name: 'Día 3: Piel radiante y ojeras (antiinflamatorio)',
      dayNumber: 3,
      theme: 'piel_radiante',
      description: 'Plan antiinflamatorio diseñado para mejorar la piel, reducir ojeras y combatir la inflamación desde adentro. Rico en antioxidantes, omega-3 y vitaminas esenciales para la piel.',
      accessLevel: 'free',
      nutrition: { caloriesMin: 1150, caloriesMax: 1380 },
      meals: [
        {
          mealType: 'desayuno',
          label: 'Desayuno',
          recipe: await findRecipe('Batido antiinflamatorio piel radiante'),
          optional: false,
        },
        {
          mealType: 'snack_manana',
          label: 'Snack mañana',
          recipe: await findRecipe('D3 – Snack frutos rojos y nueces'),
          optional: false,
        },
        {
          mealType: 'almuerzo',
          label: 'Almuerzo',
          recipe: await findRecipe('D3 – Almuerzo ensalada salmón y aguacate'),
          optional: false,
        },
        {
          mealType: 'snack_tarde',
          label: 'Snack tarde',
          recipe: await findRecipe('Shot antiinflamatorio para ojeras y piel'),
          optional: false,
          note: 'Tomar como shot concentrado para máximo efecto antiinflamatorio.',
        },
        {
          mealType: 'cena',
          label: 'Cena',
          recipe: await findRecipe('D3 – Cena crema de calabaza y zanahoria'),
          optional: false,
        },
        {
          mealType: 'post_entreno',
          label: 'Snack noche (opcional)',
          recipe: await findRecipe('Snack piel radiante (yogur, frutos rojos y cacao)'),
          optional: true,
          note: 'Opcional como snack de noche. Rico en antioxidantes.',
        },
      ].filter(m => m.recipe !== null),
    });

    await dia3.save();
    console.log(`  ✅ ${dia3.name} creado (${dia3.meals.length} comidas)\n`);

    // ==================== DÍA 4 ====================
    console.log('📌 Construyendo Día 4...');
    const dia4 = new Plan({
      name: 'Día 4: Pérdida de peso + saciedad (fibra alta)',
      dayNumber: 4,
      theme: 'saciedad',
      description: 'Plan enfocado en alta saciedad con fibra de calidad. Ideal para días con más hambre. Las legumbres y la fibra soluble mantienen el azúcar estable y la sensación de plenitud durante horas.',
      accessLevel: 'free',
      nutrition: { caloriesMin: 1180, caloriesMax: 1400 },
      meals: [
        {
          mealType: 'desayuno',
          label: 'Desayuno',
          recipe: await findRecipe('D4 – Desayuno bowl avena y manzana'),
          optional: false,
        },
        {
          mealType: 'snack_manana',
          label: 'Snack mañana',
          recipe: await findRecipe('D4 – Snack mañana manzana con almendras'),
          optional: false,
        },
        {
          mealType: 'almuerzo',
          label: 'Almuerzo',
          recipe: await findRecipe('Bowl vegetariano de judías pintas y arroz'),
          optional: false,
        },
        {
          mealType: 'snack_tarde',
          label: 'Snack tarde',
          recipe: await findRecipe('D4 – Snack tarde yogur light con frutos rojos'),
          optional: false,
        },
        {
          mealType: 'cena',
          label: 'Cena',
          recipe: await findRecipe('D4 – Cena sopa de verduras y pollo'),
          optional: false,
        },
        {
          mealType: 'post_entreno',
          label: 'Post-entreno (opcional)',
          recipe: await findRecipe('Batido verde quema grasa'),
          optional: true,
          note: 'Solo si entrenaste. Ayuda a la recuperación y quema grasa.',
        },
      ].filter(m => m.recipe !== null),
    });

    await dia4.save();
    console.log(`  ✅ ${dia4.name} creado (${dia4.meals.length} comidas)\n`);

    // ==================== DÍA 5 ====================
    console.log('📌 Construyendo Día 5...');
    const dia5 = new Plan({
      name: 'Día 5: Cola y piernas (glúteos heavy)',
      dayNumber: 5,
      theme: 'gluteos_heavy',
      description: 'Plan para el día de entrenamiento más intenso de glúteos y piernas. Alta carga calórica y proteica para soportar el volumen de entrenamiento, maximizar el crecimiento muscular y acelerar la recuperación.',
      accessLevel: 'free',
      nutrition: { caloriesMin: 1500, caloriesMax: 1720 },
      meals: [
        {
          mealType: 'desayuno',
          label: 'Desayuno',
          recipe: await findRecipe('Avena proteica para glúteos'),
          optional: false,
        },
        {
          mealType: 'snack_manana',
          label: 'Pre-entreno',
          recipe: await findRecipe('D5 – Snack pre entreno tostada con plátano'),
          optional: false,
          note: 'Consumir 30–45 min antes del entreno de glúteos/piernas.',
        },
        {
          mealType: 'almuerzo',
          label: 'Almuerzo',
          recipe: await findRecipe('Bowl de pollo, camote y brócoli'),
          optional: false,
        },
        {
          mealType: 'snack_tarde',
          label: 'Post-entreno',
          recipe: await findRecipe('Arroz con atún rápido'),
          optional: false,
          note: 'Dentro de los 60 minutos posteriores al entreno.',
        },
        {
          mealType: 'cena',
          label: 'Cena',
          recipe: await findRecipe('Ensalada power de salmón y quinoa'),
          optional: false,
        },
        {
          mealType: 'post_entreno',
          label: 'Batido noche (opcional)',
          recipe: await findRecipe('Shake de proteína con avena'),
          optional: true,
          note: 'Solo si el entreno fue muy intenso. Tomar 1–2h antes de dormir.',
        },
      ].filter(m => m.recipe !== null),
    });

    await dia5.save();
    console.log(`  ✅ ${dia5.name} creado (${dia5.meals.length} comidas)\n`);

    // ==================== DÍA 6 ====================
    console.log('📌 Construyendo Día 6...');
    const dia6 = new Plan({
      name: 'Día 6: Piel y bienestar general',
      dayNumber: 6,
      theme: 'bienestar',
      description: 'Plan de recuperación y bienestar integral. Alimentos hidratantes, antiinflamatorios y ricos en colágeno para nutrir la piel, reducir el estrés oxidativo y preparar el cuerpo para la semana siguiente.',
      accessLevel: 'free',
      nutrition: { caloriesMin: 1200, caloriesMax: 1430 },
      meals: [
        {
          mealType: 'desayuno',
          label: 'Desayuno',
          recipe: await findRecipe('D6 – Desayuno yogur piel radiante'),
          optional: false,
        },
        {
          mealType: 'snack_manana',
          label: 'Snack mañana',
          recipe: await findRecipe('D6 – Snack mañana zanahoria y pepino'),
          optional: false,
        },
        {
          mealType: 'almuerzo',
          label: 'Almuerzo',
          recipe: await findRecipe('Sándwich de pollo antiinflamatorio'),
          optional: false,
        },
        {
          mealType: 'snack_tarde',
          label: 'Snack tarde',
          recipe: await findRecipe('D6 – Snack tarde té verde con limón y fruta'),
          optional: false,
        },
        {
          mealType: 'cena',
          label: 'Cena',
          recipe: await findRecipe('D6 – Cena ensalada de atún y aguacate'),
          optional: false,
        },
        {
          mealType: 'post_entreno',
          label: 'Batido (opcional)',
          recipe: await findRecipe('Batido antiinflamatorio piel radiante'),
          optional: true,
          note: 'Opcional en días de actividad ligera. Potencia la recuperación de la piel.',
        },
      ].filter(m => m.recipe !== null),
    });

    await dia6.save();
    console.log(`  ✅ ${dia6.name} creado (${dia6.meals.length} comidas)\n`);

    // ==================== DÍA 7 ====================
    console.log('📌 Construyendo Día 7...');
    const dia7 = new Plan({
      name: 'Día 7: Mix equilibrado (descanso activo)',
      dayNumber: 7,
      theme: 'equilibrado',
      description: 'Plan mixto y equilibrado para el día de descanso activo. Combina lo mejor de todos los días: proteína para mantener músculo, fibra para la digestión, antioxidantes para la piel y carbos para recargar energía.',
      accessLevel: 'free',
      nutrition: { caloriesMin: 1300, caloriesMax: 1520 },
      meals: [
        {
          mealType: 'desayuno',
          label: 'Desayuno',
          recipe: await findRecipe('D7 – Desayuno bowl mexicano saludable'),
          optional: false,
        },
        {
          mealType: 'snack_manana',
          label: 'Snack mañana',
          recipe: await findRecipe('D7 – Snack mañana yogur con fruta pequeña'),
          optional: false,
        },
        {
          mealType: 'almuerzo',
          label: 'Almuerzo',
          recipe: await findRecipe('D7 – Almuerzo ensalada de lentejas y pollo'),
          optional: false,
        },
        {
          mealType: 'snack_tarde',
          label: 'Snack tarde',
          recipe: await findRecipe('D7 – Snack tarde frutos secos'),
          optional: false,
        },
        {
          mealType: 'cena',
          label: 'Cena',
          recipe: await findRecipe('D7 – Cena bowl ligero verduras y huevo'),
          optional: false,
        },
        {
          mealType: 'post_entreno',
          label: 'Post-entreno (opcional)',
          recipe: await findRecipe('Wrap de pollo y aguacate'),
          optional: true,
          note: 'Solo si hiciste actividad física hoy. Ayuda a cerrar el ciclo semanal con proteína.',
        },
      ].filter(m => m.recipe !== null),
    });

    await dia7.save();
    console.log(`  ✅ ${dia7.name} creado (${dia7.meals.length} comidas)\n`);

    // ==================== RESUMEN ====================
    const total = await Plan.countDocuments();
    console.log(`\n✨ Seed de planes completado — ${total} plan(es) en la base de datos\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed de planes:', error);
    process.exit(1);
  }
}

seedPlans();
