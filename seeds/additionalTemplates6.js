const mongoose = require('mongoose');
const RoutineTemplate = require('../models/RoutineTemplate');

// Fichas 5-8: nuevas plantillas bilingües (ES principal, EN traducción)
const fichas5to8 = [

  // ──────────────────────────────────────────────
  // FICHA 5 — FREE | Tren Superior Sin Equipamiento
  // ──────────────────────────────────────────────
  {
    templateId: 'FICHA_5_UPPER_FREE',
    name: 'Tren Superior Suave Sin Equipamiento',
    nameEn: 'Gentle Upper Body Without Equipment',
    description: 'Rutina de 20 minutos para tonificar brazos, espalda y pecho solo con el peso corporal. Perfecta para empezar a ganar fuerza sin ningún equipamiento.',
    descriptionEn: '20-minute routine to tone arms, back and chest using only bodyweight. Perfect to start building strength without any equipment.',
    accessLevel: 'free',
    targetProfile: {
      ageRange: '18-35',
      level: 'principiante',
      constitutions: ['normopeso'],
      kneeSensitive: true,
      allowedPathologies: ['ninguna'],
    },
    baseDurationMinutes: 20,
    adjustableDurations: [15, 20],
    mainCycles: 2,
    category: 'fuerza',
    intensity: 'baja',
    isFeatured: false,
    tags: ['tren_superior', 'sin_equipamiento', 'principiante', 'free', '20min', 'rodilla_sensible'],
    blocks: {
      calentamiento: [
        {
          exerciseId: 'CAL_MARCHA_BRAZOS_ACTIVOS',
          name: 'Marcha Con Brazos Activos',
          nameEn: 'March With Active Arms',
          shortDescription: 'Marcha en el sitio moviendo los brazos hacia adelante y atrás.',
          shortDescriptionEn: 'March in place while moving your arms forward and back.',
          type: 'cardio_suave',
          zone: 'cuerpo_entero',
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1,
        },
        {
          exerciseId: 'CAL_CIRCULOS_BRAZOS',
          name: 'Círculos de Brazos',
          nameEn: 'Arm Circles',
          shortDescription: 'De pie, haz grandes círculos con ambos brazos.',
          shortDescriptionEn: 'Standing, make big circles with both arms.',
          type: 'movilidad',
          zone: 'hombros',
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 2,
        },
      ],
      principal: [
        {
          exerciseId: 'FLEX_PARED',
          name: 'Flexiones en Pared',
          nameEn: 'Wall Push-Ups',
          shortDescription: 'Manos en la pared, cuerpo inclinado, dobla y extiende los brazos.',
          shortDescriptionEn: 'Hands on the wall, body inclined, bend and extend your arms.',
          type: 'fuerza',
          zone: 'pecho_triceps',
          baseRepetitions: '12',
          restSeconds: 30,
          kneeFriendly: true,
          order: 1,
        },
        {
          exerciseId: 'REMO_INCLINADO_SIN_PESO',
          name: 'Remo Inclinado Sin Peso',
          nameEn: 'Bent-Over Row Without Weight',
          shortDescription: 'Inclina el tronco hacia adelante, deja colgar los brazos y tira hacia las costillas.',
          shortDescriptionEn: 'Lean your torso forward, let your arms hang and pull towards your ribs.',
          type: 'fuerza',
          zone: 'espalda',
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 2,
        },
        {
          exerciseId: 'ELEV_BRAZOS_T',
          name: 'Elevación de Brazos en T',
          nameEn: 'T-Shape Arm Raises',
          shortDescription: 'Brazos extendidos a los lados en T, haz pequeños círculos controlados.',
          shortDescriptionEn: 'Arms out to the sides in a T, make small controlled circles.',
          type: 'fuerza',
          zone: 'hombros',
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 3,
        },
      ],
      enfriamiento: [
        {
          exerciseId: 'ESTIR_PECHO_PARED',
          name: 'Estiramiento de Pecho en Pared',
          nameEn: 'Chest Stretch on Wall',
          shortDescription: 'Mano en la pared, rota el tronco hacia el lado contrario.',
          shortDescriptionEn: 'Hand on the wall, rotate your torso away from the wall.',
          type: 'flexibilidad',
          zone: 'pecho',
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1,
        },
      ],
    },
  },

  // ──────────────────────────────────────────────
  // FICHA 6 — BASIC | Cardio Suave Plus (obesidad)
  // ──────────────────────────────────────────────
  {
    templateId: 'FICHA_6_CARDIO_BASIC',
    name: 'Cardio Suave Plus para Empezar',
    nameEn: 'Gentle Cardio Plus to Get Started',
    description: '20 minutos de cardio de bajo impacto, ideal para mujeres con sobrepeso u obesidad que quieren empezar a moverse sin dolor articular.',
    descriptionEn: '20 minutes of low-impact cardio, ideal for women with overweight or obesity who want to start moving without joint pain.',
    accessLevel: 'basic',
    targetProfile: {
      ageRange: '36-55',
      level: 'principiante',
      constitutions: ['sobrepeso', 'obesidad'],
      kneeSensitive: true,
      allowedPathologies: ['cardiaca', 'metabolica'],
    },
    baseDurationMinutes: 20,
    adjustableDurations: [15, 20],
    mainCycles: 2,
    category: 'cardio',
    intensity: 'baja',
    isFeatured: true,
    tags: ['cardio_suave', 'bajo_impacto', 'obesidad', 'sobrepeso', 'basic', '20min', 'rodilla_sensible'],
    blocks: {
      calentamiento: [
        {
          exerciseId: 'CAL_PASOS_LATERALES_SUAVES',
          name: 'Pasos Laterales Suaves',
          nameEn: 'Gentle Side Steps',
          shortDescription: 'Paso a un lado y vuelve al centro, alternando, sin saltos.',
          shortDescriptionEn: 'Step to one side and back to center, alternating, without jumps.',
          type: 'cardio_suave',
          zone: 'cuerpo_entero',
          baseTimeSeconds: 60,
          restSeconds: 15,
          kneeFriendly: true,
          order: 1,
        },
        {
          exerciseId: 'CAL_ROTACIONES_TRONCO',
          name: 'Rotaciones de Tronco',
          nameEn: 'Torso Rotations',
          shortDescription: 'De pie, pies abiertos, rota el tronco a derecha e izquierda.',
          shortDescriptionEn: 'Standing, feet wide, rotate your torso right and left.',
          type: 'movilidad',
          zone: 'core_espalda',
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 2,
        },
      ],
      principal: [
        {
          exerciseId: 'PASO_ADELANTE_ATRAS',
          name: 'Paso Adelante y Atrás',
          nameEn: 'Step Forward and Back',
          shortDescription: 'Da un paso suave hacia adelante y vuelve al centro, alternando pies.',
          shortDescriptionEn: 'Take a gentle step forward and return to center, alternating feet.',
          type: 'cardio_suave',
          zone: 'piernas',
          baseTimeSeconds: 45,
          restSeconds: 20,
          kneeFriendly: true,
          order: 1,
        },
        {
          exerciseId: 'MARCHA_RODILLA_BAJA',
          name: 'Marcha Con Rodilla Baja',
          nameEn: 'March With Low Knee Lift',
          shortDescription: 'Sube la rodilla solo un poco, sin impacto.',
          shortDescriptionEn: 'Raise your knee just a little, without impact.',
          type: 'cardio_suave',
          zone: 'piernas_core',
          baseTimeSeconds: 45,
          restSeconds: 20,
          kneeFriendly: true,
          order: 2,
        },
        {
          exerciseId: 'TOQUE_PUNTA_FRENTE',
          name: 'Toque de Punta al Frente',
          nameEn: 'Front Toe Taps',
          shortDescription: 'Toca el suelo o la punta del pie por delante, alternando piernas.',
          shortDescriptionEn: 'Tap the floor or the tip of your foot in front, alternating legs.',
          type: 'cardio_suave',
          zone: 'piernas_core',
          baseTimeSeconds: 45,
          restSeconds: 20,
          kneeFriendly: true,
          order: 3,
        },
      ],
      enfriamiento: [
        {
          exerciseId: 'ESTIR_PANTORRILLA_PARED',
          name: 'Estiramiento de Pantorrilla en Pared',
          nameEn: 'Calf Stretch on Wall',
          shortDescription: 'Un pie atrás, talón en el suelo, inclina el cuerpo hacia la pared.',
          shortDescriptionEn: 'One foot back, heel on the floor, lean your body towards the wall.',
          type: 'flexibilidad',
          zone: 'pantorrillas',
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1,
        },
      ],
    },
  },

  // ──────────────────────────────────────────────
  // FICHA 7 — PREMIUM | Fuerza Cuerpo Completo Con Mancuernas
  // ──────────────────────────────────────────────
  {
    templateId: 'FICHA_7_FULLBODY_PREMIUM',
    name: 'Fuerza Cuerpo Completo Con Mancuernas',
    nameEn: 'Full Body Strength With Dumbbells',
    description: '30 minutos de fuerza en todo el cuerpo usando mancuernas ligeras para mujeres intermedias que buscan definición y un metabolismo más activo.',
    descriptionEn: '30 minutes of full body strength using light dumbbells for intermediate women who want definition and a faster metabolism.',
    accessLevel: 'premium',
    targetProfile: {
      ageRange: '18-35',
      level: 'intermedio',
      constitutions: ['normopeso', 'sobrepeso'],
      kneeSensitive: false,
      allowedPathologies: ['ninguna'],
    },
    baseDurationMinutes: 30,
    adjustableDurations: [20],
    mainCycles: 3,
    category: 'fuerza',
    intensity: 'moderada',
    isFeatured: true,
    tags: ['cuerpo_completo', 'fuerza', 'mancuernas', 'premium', '30min', 'intermedio'],
    blocks: {
      calentamiento: [
        {
          exerciseId: 'CAL_JUMPING_JACKS_MOD',
          name: 'Jumping Jacks Modificados',
          nameEn: 'Modified Jumping Jacks',
          shortDescription: 'Saca una pierna al lado mientras subes los brazos, sin salto.',
          shortDescriptionEn: 'Step one leg out to the side while raising your arms, no jump.',
          type: 'cardio_suave',
          zone: 'cuerpo_entero',
          baseTimeSeconds: 60,
          restSeconds: 15,
          kneeFriendly: true,
          order: 1,
        },
        {
          exerciseId: 'CAL_ROTACIONES_HOMBROS',
          name: 'Rotaciones de Hombros',
          nameEn: 'Shoulder Rotations',
          shortDescription: 'Haz grandes círculos de hombros hacia adelante y atrás.',
          shortDescriptionEn: 'Make big shoulder circles forward and backward.',
          type: 'movilidad',
          zone: 'hombros',
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 2,
        },
      ],
      principal: [
        {
          exerciseId: 'SENTADILLA_PRESS_HOMBROS',
          name: 'Sentadilla a Press de Hombros',
          nameEn: 'Squat to Shoulder Press',
          shortDescription: 'Sentadilla con mancuernas, luego presiónolas hacia arriba al levantarte.',
          shortDescriptionEn: 'Squat with dumbbells, then press them overhead as you stand up.',
          type: 'fuerza',
          zone: 'piernas_gluteos_hombros',
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: false,
          order: 1,
        },
        {
          exerciseId: 'PESO_MUERTO_RUMANO',
          name: 'Peso Muerto Rumano',
          nameEn: 'Romanian Deadlift',
          shortDescription: 'Inclina el tronco, mancuernas pegadas a las piernas, levanta apretando los glúteos.',
          shortDescriptionEn: 'Lean your torso forward, dumbbells close to your legs, stand up squeezing your glutes.',
          type: 'fuerza',
          zone: 'isquios_gluteos',
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: false,
          order: 2,
        },
        {
          exerciseId: 'REMO_MANCUERNAS_INCLINADO',
          name: 'Remo con Mancuernas Inclinada',
          nameEn: 'Bent-Over Dumbbell Row',
          shortDescription: 'Inclina el tronco y tira de los pesos hacia las costillas.',
          shortDescriptionEn: 'Lean your torso forward and pull the weights towards your ribs.',
          type: 'fuerza',
          zone: 'espalda',
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 3,
        },
        {
          exerciseId: 'PLANCHA_RODILLAS_MANCUERNAS',
          name: 'Plancha con Rodillas',
          nameEn: 'Kneeling Plank',
          shortDescription: 'Rodillas y antebrazos en el suelo, mantén el cuerpo en línea recta.',
          shortDescriptionEn: 'Knees and forearms on the floor, keep your body in a straight line.',
          type: 'fuerza',
          zone: 'core',
          baseTimeSeconds: 30,
          restSeconds: 30,
          kneeFriendly: true,
          order: 4,
        },
      ],
      enfriamiento: [
        {
          exerciseId: 'ESTIR_GLUTEOS_TUMBADA',
          name: 'Estiramiento de Glúteos Tumbada',
          nameEn: 'Lying Glute Stretch',
          shortDescription: 'Tumbada boca arriba, cruza un tobillo sobre la rodilla contraria y tira de la pierna hacia el pecho.',
          shortDescriptionEn: 'Lying on your back, cross one ankle over the opposite knee and gently pull the leg towards your chest.',
          type: 'flexibilidad',
          zone: 'gluteos',
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1,
        },
      ],
    },
  },

  // ──────────────────────────────────────────────
  // FICHA 8 — EXCLUSIVE | Core y Movilidad 55+ Elite
  // ──────────────────────────────────────────────
  {
    templateId: 'FICHA_8_CORE_55PLUS',
    name: 'Core y Movilidad 55+ Elite',
    nameEn: 'Core & Mobility 55+ Elite',
    description: 'Sesión de 25 minutos enfocada en el core, equilibrio y movilidad suave para mujeres activas mayores de 55 años, ideal para mantener la independencia y la estabilidad.',
    descriptionEn: '25-minute session focused on core, balance and gentle mobility for active women 55+, ideal to maintain independence and stability.',
    accessLevel: 'exclusive',
    targetProfile: {
      ageRange: '55+',
      level: 'intermedio',
      constitutions: ['normopeso', 'sobrepeso'],
      kneeSensitive: true,
      allowedPathologies: ['cardiaca', 'respiratoria'],
    },
    baseDurationMinutes: 25,
    adjustableDurations: [20],
    mainCycles: 2,
    category: 'flexibilidad',
    intensity: 'baja',
    isFeatured: false,
    tags: ['core', 'movilidad', '55plus', 'exclusive', 'bajo_impacto', 'rodilla_sensible', '25min'],
    blocks: {
      calentamiento: [
        {
          exerciseId: 'CAL_MARCHA_APOYO_SILLA',
          name: 'Marcha Con Apoyo en Silla',
          nameEn: 'Chair-Supported March',
          shortDescription: 'Marcha en el sitio sujetando el respaldo de una silla, sin impacto.',
          shortDescriptionEn: 'March in place while holding onto the back of a chair, no impact.',
          type: 'cardio_suave',
          zone: 'cuerpo_entero',
          baseTimeSeconds: 60,
          restSeconds: 15,
          kneeFriendly: true,
          order: 1,
        },
        {
          exerciseId: 'CAL_CIRCULOS_TOBILLO_MUNECA',
          name: 'Círculos de Tobillo y Muñeca',
          nameEn: 'Ankle and Wrist Circles',
          shortDescription: 'Sentada, rota suavemente los tobillos y las muñecas.',
          shortDescriptionEn: 'Seated, gently rotate your ankles and wrists.',
          type: 'movilidad',
          zone: 'articulaciones',
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 2,
        },
      ],
      principal: [
        {
          exerciseId: 'BIRD_DOG_APOYO',
          name: 'Bird Dog Con Apoyo',
          nameEn: 'Supported Bird Dog',
          shortDescription: 'A cuatro patas, extiende el brazo y la pierna opuestos.',
          shortDescriptionEn: 'On hands and knees, extend opposite arm and leg.',
          type: 'fuerza',
          zone: 'core_espalda',
          baseTimeSeconds: 60,
          restSeconds: 20,
          kneeFriendly: true,
          order: 1,
        },
        {
          exerciseId: 'MEDIA_SENTADILLA_APOYO',
          name: 'Media Sentadilla Con Apoyo',
          nameEn: 'Supported Half Squat',
          shortDescription: 'De pie, manos en la silla, baja un poco y vuelve a subir.',
          shortDescriptionEn: 'Standing, hands on a chair, lower slightly and stand back up.',
          type: 'fuerza',
          zone: 'piernas_gluteos',
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 2,
        },
        {
          exerciseId: 'ELEV_RODILLA_APOYO',
          name: 'Elevación de Rodilla Con Apoyo',
          nameEn: 'Knee Lift With Support',
          shortDescription: 'De pie, agarrada a la silla, sube una rodilla a la vez.',
          shortDescriptionEn: 'Standing and holding the chair, lift one knee at a time.',
          type: 'cardio_suave',
          zone: 'core_piernas',
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 3,
        },
      ],
      enfriamiento: [
        {
          exerciseId: 'POSTURA_NINO_SILLA',
          name: 'Postura del Niño en Silla',
          nameEn: "Chair Child's Pose",
          shortDescription: 'Sentada, inclina el tronco sobre los muslos, brazos extendidos al frente.',
          shortDescriptionEn: 'Seated, lean your torso over your thighs, arms reaching forward.',
          type: 'flexibilidad',
          zone: 'espalda_caderas',
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1,
        },
      ],
    },
  },
];

async function loadFichas5to8() {
  console.log('Conectando a MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong');

  console.log('📋 Cargando fichas 5-8 (bilingüe)...');
  let added = 0, updated = 0;

  for (const template of fichas5to8) {
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

  console.log(`\n📊 Fichas 5-8: ${added} añadidas, ${updated} actualizadas`);
}

module.exports = { loadFichas5to8 };

if (require.main === module) {
  require('dotenv').config();
  loadFichas5to8()
    .then(() => process.exit(0))
    .catch(err => { console.error('❌', err); process.exit(1); });
}
