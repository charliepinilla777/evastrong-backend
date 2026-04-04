const mongoose = require('mongoose');
const RoutineTemplate = require('../models/RoutineTemplate');

// Fichas 1-4: plantillas bilingüe (ES principal, EN traducción)
const fichas1to4 = [

  // ──────────────────────────────────────────────
  // FICHA 1 — FREE | Glúteos Fáciles en Casa
  // ──────────────────────────────────────────────
  {
    templateId: 'FICHA_1_GLUTEOS_FREE',
    name: 'Glúteos Fáciles en Casa',
    nameEn: 'Easy Glutes at Home',
    description: 'Rutina sin equipamiento para tonificar glúteos y piernas en 25 minutos. Perfecta para empezar con confianza y ver resultados rápidos.',
    descriptionEn: 'No-equipment routine to tone glutes and legs in 25 minutes. Perfect to start with confidence and see fast results.',
    accessLevel: 'free',
    targetProfile: {
      ageRange: '18-35',
      level: 'principiante',
      constitutions: ['sobrepeso'],
      kneeSensitive: false,
      allowedPathologies: ['ninguna'],
    },
    baseDurationMinutes: 25,
    adjustableDurations: [20],
    mainCycles: 2,
    category: 'fuerza',
    intensity: 'baja',
    isFeatured: true,
    tags: ['gluteos', 'sin_equipamiento', '25min', 'free', 'principiante', 'sobrepeso'],
    blocks: {
      calentamiento: [
        {
          exerciseId: 'CAL_MARCHA_SITIO',
          name: 'Marcha en el Sitio',
          nameEn: 'March in Place',
          shortDescription: 'Camina en el sitio levantando suavemente las rodillas sin saltar.',
          shortDescriptionEn: 'Walk in place, gently lifting your knees without jumping.',
          type: 'cardio_suave',
          zone: 'cuerpo_entero',
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1,
        },
        {
          exerciseId: 'CAL_CIRCULOS_CADERA',
          name: 'Círculos de Cadera',
          nameEn: 'Hip Circles',
          shortDescription: 'Manos en la cadera, rota suavemente en círculos.',
          shortDescriptionEn: 'Hands on hips, gently rotate your hips in circles.',
          type: 'movilidad',
          zone: 'caderas',
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 2,
        },
      ],
      principal: [
        {
          exerciseId: 'PUENTE_GLUTEOS_BASICO',
          name: 'Puente de Glúteos',
          nameEn: 'Glute Bridge',
          shortDescription: 'Tumbada boca arriba, pies en el suelo, eleva la cadera apretando los glúteos.',
          shortDescriptionEn: 'Lying on your back, feet on the floor, lift your hips by squeezing the glutes.',
          type: 'fuerza',
          zone: 'gluteos',
          baseRepetitions: '12',
          restSeconds: 20,
          kneeFriendly: true,
          order: 1,
        },
        {
          exerciseId: 'PATADA_GLUTEO_PULSO',
          name: 'Patada de Glúteo con Pulso',
          nameEn: 'Pulsed Glute Kickback',
          shortDescription: 'A cuatro patas, extiende una pierna hacia atrás y pulsa.',
          shortDescriptionEn: 'On your knees, extend one leg back and pulse.',
          type: 'fuerza',
          zone: 'gluteos',
          baseRepetitions: '10 por lado',
          restSeconds: 20,
          kneeFriendly: true,
          order: 2,
        },
        {
          exerciseId: 'SENTADILLA_ELEV_LATERAL',
          name: 'Sentadilla con Elevación Lateral de Pierna',
          nameEn: 'Squat With Side Leg Raise',
          shortDescription: 'Baja a sentadilla, luego levántate y sube una pierna al lado.',
          shortDescriptionEn: 'Lower into a squat, then stand and lift one leg to the side.',
          type: 'fuerza',
          zone: 'piernas',
          baseRepetitions: '10 por lado',
          restSeconds: 30,
          kneeFriendly: false,
          order: 3,
        },
      ],
      enfriamiento: [
        {
          exerciseId: 'ESTIR_ISQUIOTIBIALES',
          name: 'Estiramiento de Isquiotibiales',
          nameEn: 'Hamstring Stretch',
          shortDescription: 'Sentada, extiende una pierna y alcanza tu pie.',
          shortDescriptionEn: 'Seated, extend one leg and reach for your foot.',
          type: 'flexibilidad',
          zone: 'piernas',
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1,
        },
        {
          exerciseId: 'ESTIR_GLUTEOS_SUELO',
          name: 'Estiramiento de Glúteos en Suelo',
          nameEn: 'Glute Stretch',
          shortDescription: 'Tumbada boca arriba, cruza un tobillo sobre la rodilla contraria.',
          shortDescriptionEn: 'Lying on your back, cross one ankle over the opposite knee.',
          type: 'flexibilidad',
          zone: 'gluteos',
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 2,
        },
      ],
    },
  },

  // ──────────────────────────────────────────────
  // FICHA 2 — BASIC | HIIT Piernas con Banda
  // ──────────────────────────────────────────────
  {
    templateId: 'FICHA_2_HIIT_PIERNAS_BASIC',
    name: 'HIIT Piernas con Banda',
    nameEn: 'HIIT Legs With Band',
    description: 'Entrenamiento dinámico de 30 minutos con banda para quemar grasa y fortalecer las piernas. Progresión intermedia para resultados visibles.',
    descriptionEn: 'Dynamic 30-minute band workout to burn fat and strengthen legs. Intermediate progression for visible results.',
    accessLevel: 'basic',
    targetProfile: {
      ageRange: '36-55',
      level: 'intermedio',
      constitutions: ['normopeso'],
      kneeSensitive: true,
      allowedPathologies: ['metabolica'],
    },
    baseDurationMinutes: 30,
    adjustableDurations: [20],
    mainCycles: 3,
    category: 'hiit',
    intensity: 'alta',
    isFeatured: false,
    tags: ['hiit', 'piernas', 'banda_elastica', '30min', 'basic', 'rodilla_sensible', '36-55'],
    blocks: {
      calentamiento: [
        {
          exerciseId: 'CAL_PUENTE_BANDA',
          name: 'Puente de Glúteos con Banda',
          nameEn: 'Glute Bridge With Band',
          shortDescription: 'Eleva la cadera con la banda colocada alrededor de los muslos.',
          shortDescriptionEn: 'Lift your hips with the band placed around your thighs.',
          type: 'movilidad',
          zone: 'caderas',
          baseTimeSeconds: 45,
          restSeconds: 10,
          kneeFriendly: true,
          order: 1,
        },
        {
          exerciseId: 'CAL_ACTIVACION_CUADRICEPS',
          name: 'Activación de Cuádriceps',
          nameEn: 'Quadriceps Set',
          shortDescription: 'Tumbada, presiona la rodilla hacia abajo contra una toalla.',
          shortDescriptionEn: 'Lying down, press your knee down against a towel.',
          type: 'movilidad',
          zone: 'piernas',
          baseTimeSeconds: 60,
          restSeconds: 10,
          kneeFriendly: true,
          order: 2,
        },
      ],
      principal: [
        {
          exerciseId: 'SENTADILLA_BULGARA_BANDA',
          name: 'Sentadilla Búlgara con Banda',
          nameEn: 'Bulgarian Split Squat',
          shortDescription: 'Pie trasero en una silla, baja con control usando la banda.',
          shortDescriptionEn: 'Back foot on a chair, lower with control using the band.',
          type: 'fuerza',
          zone: 'gluteos_cuadriceps',
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 1,
        },
        {
          exerciseId: 'PATADA_LATERAL_BANDA',
          name: 'Patada Lateral con Banda',
          nameEn: 'Lateral Band Kick',
          shortDescription: 'Banda en los tobillos, levanta una pierna al lado.',
          shortDescriptionEn: 'Band around ankles, lift one leg out to the side.',
          type: 'cardio_intenso',
          zone: 'gluteos',
          baseTimeSeconds: 80,
          restSeconds: 20,
          kneeFriendly: true,
          order: 2,
        },
        {
          exerciseId: 'ALMEJA_BANDA',
          name: 'Almeja con Banda',
          nameEn: 'Clamshell',
          shortDescription: 'Tumbada de lado, abre la rodilla superior contra la banda.',
          shortDescriptionEn: 'Lying on your side, open the top knee against the band.',
          type: 'fuerza',
          zone: 'gluteos',
          baseTimeSeconds: 80,
          restSeconds: 30,
          kneeFriendly: true,
          order: 3,
        },
      ],
      enfriamiento: [
        {
          exerciseId: 'ESTIR_PALOMA',
          name: 'Estiramiento de la Paloma',
          nameEn: 'Pigeon Stretch',
          shortDescription: 'Una pierna doblada al frente, la otra extendida atrás.',
          shortDescriptionEn: 'One leg bent in front, the other extended back.',
          type: 'flexibilidad',
          zone: 'caderas',
          baseTimeSeconds: 90,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1,
        },
      ],
    },
  },

  // ──────────────────────────────────────────────
  // FICHA 3 — PREMIUM | Pilates Cuerpo Completo Intermedio
  // ──────────────────────────────────────────────
  {
    templateId: 'FICHA_3_PILATES_PREMIUM',
    name: 'Pilates Cuerpo Completo Intermedio',
    nameEn: 'Intermediate Full Body Pilates',
    description: '35 minutos de Pilates para fortalecer el core y mejorar la flexibilidad. Perfecto para el equilibrio y la postura en el día a día.',
    descriptionEn: '35 minutes of Pilates to strengthen the core and improve flexibility. Perfect for balance and everyday posture.',
    accessLevel: 'premium',
    targetProfile: {
      ageRange: '36-55',
      level: 'intermedio',
      constitutions: ['normopeso'],
      kneeSensitive: false,
      allowedPathologies: ['ninguna'],
    },
    baseDurationMinutes: 35,
    adjustableDurations: [20],
    mainCycles: 2,
    category: 'pilates',
    intensity: 'moderada',
    isFeatured: true,
    tags: ['pilates', 'core', 'cuerpo_completo', '35min', 'premium', 'intermedio'],
    blocks: {
      calentamiento: [
        {
          exerciseId: 'CAL_CIRCULOS_BRAZOS_PILATES',
          name: 'Círculos de Brazos',
          nameEn: 'Arm Circles',
          shortDescription: 'Tumbada boca arriba, rota los brazos en círculos.',
          shortDescriptionEn: 'Lying on your back, rotate your arms in circles.',
          type: 'movilidad',
          zone: 'hombros_espalda',
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1,
        },
        {
          exerciseId: 'CAL_GATO_VACA',
          name: 'Gato-Vaca',
          nameEn: 'Cat–Cow',
          shortDescription: 'A cuatro patas, alterna entre arquear y redondear la espalda.',
          shortDescriptionEn: 'On all fours, alternate between arching and rounding your back.',
          type: 'movilidad',
          zone: 'espalda',
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 2,
        },
      ],
      principal: [
        {
          exerciseId: 'PILATES_CIEN',
          name: 'Los Cien',
          nameEn: 'Hundred',
          shortDescription: 'Tumbada boca arriba, piernas en tabla, bombea los brazos arriba y abajo.',
          shortDescriptionEn: 'Lying on your back, legs in tabletop, pump your arms up and down.',
          type: 'fuerza',
          zone: 'abdominales',
          baseTimeSeconds: 60,
          restSeconds: 20,
          kneeFriendly: true,
          order: 1,
        },
        {
          exerciseId: 'PILATES_INCORPORARSE',
          name: 'Incorporarse (Roll Up)',
          nameEn: 'Roll Up',
          shortDescription: 'Tumbada boca arriba, sube el tronco lentamente.',
          shortDescriptionEn: 'Lying on your back, slowly roll your torso up.',
          type: 'fuerza',
          zone: 'core',
          baseRepetitions: '10',
          restSeconds: 20,
          kneeFriendly: true,
          order: 2,
        },
        {
          exerciseId: 'PILATES_ESTIR_UNA_PIERNA',
          name: 'Estiramiento de Una Pierna',
          nameEn: 'Single Leg Stretch',
          shortDescription: 'Lleva una rodilla al pecho, luego alterna piernas.',
          shortDescriptionEn: 'Bring one knee to the chest, then alternate legs.',
          type: 'fuerza',
          zone: 'abdominales',
          baseTimeSeconds: 80,
          restSeconds: 30,
          kneeFriendly: true,
          order: 3,
        },
      ],
      enfriamiento: [
        {
          exerciseId: 'ESTIR_COLUMNA_PILATES',
          name: 'Estiramiento de Columna',
          nameEn: 'Spinal Stretch',
          shortDescription: 'Sentada, inclina el tronco hacia adelante sobre las piernas.',
          shortDescriptionEn: 'Seated, bend your torso forward over your legs.',
          type: 'flexibilidad',
          zone: 'espalda',
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1,
        },
      ],
    },
  },

  // ──────────────────────────────────────────────
  // FICHA 4 — EXCLUSIVE | Yoga de Equilibrio Avanzado
  // ──────────────────────────────────────────────
  {
    templateId: 'FICHA_4_YOGA_EXCLUSIVE',
    name: 'Yoga de Equilibrio Avanzado',
    nameEn: 'Advanced Balance Yoga',
    description: 'Secuencia de 40 minutos para una flexibilidad avanzada y una mente fuerte. Posturas desafiantes para el dominio del cuerpo completo.',
    descriptionEn: '40-minute sequence for advanced flexibility and a strong mind. Challenging poses for full body mastery.',
    accessLevel: 'exclusive',
    targetProfile: {
      ageRange: '55+',
      level: 'avanzado',
      constitutions: ['bajo_peso', 'normopeso', 'sobrepeso', 'obesidad'],
      kneeSensitive: false,
      allowedPathologies: ['cardiaca'],
    },
    baseDurationMinutes: 40,
    adjustableDurations: [20],
    mainCycles: 3,
    category: 'yoga',
    intensity: 'moderada',
    isFeatured: false,
    tags: ['yoga', 'avanzado', 'equilibrio', '40min', 'exclusive', '55plus', 'flexibilidad'],
    blocks: {
      calentamiento: [
        {
          exerciseId: 'YOGA_POSTURA_MONTANA',
          name: 'Postura de la Montaña',
          nameEn: 'Mountain Pose',
          shortDescription: 'De pie, brazos arriba, presiona los pies en el suelo.',
          shortDescriptionEn: 'Standing, arms up, press your feet into the floor.',
          type: 'cardio_suave',
          zone: 'cuerpo_entero',
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1,
        },
        {
          exerciseId: 'YOGA_FLEXION_ADELANTE',
          name: 'Flexión Hacia Adelante',
          nameEn: 'Forward Fold',
          shortDescription: 'De pie, inclina el tronco hacia adelante para alcanzar los pies.',
          shortDescriptionEn: 'Standing, bend your torso forward to reach your feet.',
          type: 'movilidad',
          zone: 'espalda',
          baseTimeSeconds: 45,
          restSeconds: 0,
          kneeFriendly: true,
          order: 2,
        },
      ],
      principal: [
        {
          exerciseId: 'YOGA_TRIANGULO_EXTENDIDO',
          name: 'Triángulo Extendido',
          nameEn: 'Extended Triangle',
          shortDescription: 'Piernas abiertas, una mano al suelo, el otro brazo hacia arriba.',
          shortDescriptionEn: 'Legs apart, one hand to the floor, the other arm reaching up.',
          type: 'movilidad',
          zone: 'piernas_core',
          baseTimeSeconds: 120,
          restSeconds: 20,
          kneeFriendly: true,
          order: 1,
        },
        {
          exerciseId: 'YOGA_GUERRERO_III',
          name: 'Guerrero III',
          nameEn: 'Warrior III',
          shortDescription: 'Pierna trasera levantada, brazos extendidos al frente.',
          shortDescriptionEn: 'Back leg lifted, arms extended forward.',
          type: 'equilibrio',
          zone: 'cuerpo_entero',
          baseTimeSeconds: 90,
          restSeconds: 30,
          kneeFriendly: true,
          order: 2,
        },
        {
          exerciseId: 'YOGA_ARBOL_AVANZADO',
          name: 'Postura del Árbol Avanzada',
          nameEn: 'Advanced Tree Pose',
          shortDescription: 'Pie colocado alto en el muslo contrario, brazos sobre la cabeza.',
          shortDescriptionEn: 'Foot placed high on the opposite thigh, arms overhead.',
          type: 'equilibrio',
          zone: 'piernas_core',
          baseTimeSeconds: 120,
          restSeconds: 30,
          kneeFriendly: true,
          order: 3,
        },
      ],
      enfriamiento: [
        {
          exerciseId: 'YOGA_POSTURA_NINO',
          name: 'Postura del Niño',
          nameEn: "Child's Pose",
          shortDescription: 'Rodillas en el suelo, tronco hacia adelante, brazos extendidos.',
          shortDescriptionEn: 'Knees on the floor, torso forward, arms extended.',
          type: 'flexibilidad',
          zone: 'espalda_caderas',
          baseTimeSeconds: 90,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1,
        },
      ],
    },
  },
];

async function loadFichas1to4() {
  console.log('Conectando a MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong');

  console.log('📋 Cargando fichas 1-4 (bilingüe)...');
  let added = 0, updated = 0;

  for (const template of fichas1to4) {
    const existing = await RoutineTemplate.findOne({ templateId: template.templateId });
    if (existing) {
      await RoutineTemplate.findOneAndUpdate(
        { templateId: template.templateId },
        template,
        { runValidators: true }
      );
      console.log(`  ✏️  Actualizada: ${template.name}`);
      updated++;
    } else {
      await RoutineTemplate.create(template);
      console.log(`  ✅ Creada: ${template.name}`);
      added++;
    }
  }

  console.log(`\n📊 Fichas 1-4: ${added} añadidas, ${updated} actualizadas`);
}

module.exports = { loadFichas1to4 };

if (require.main === module) {
  require('dotenv').config();
  loadFichas1to4()
    .then(() => process.exit(0))
    .catch(err => { console.error('❌', err); process.exit(1); });
}
