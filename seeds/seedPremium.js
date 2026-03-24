'use strict';

/**
 * seedPremium.js
 * Agrega 3 rutinas de nivel Premium a la colección Routine.
 *
 * Uso:
 *   node seeds/seedPremium.js
 */

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');
const Routine  = require('../models/Routine');

const ADMIN_EMAIL = 'eva@evastrong.app';
const ADMIN_NAME  = 'Eva Strong';
const ADMIN_PASS  = 'EvaStrong2025!';

function buildRoutines(instructorId) {
  return [

    // -----------------------------------------------------------------------
    // P1 — HIIT Express Quema Grasa | premium | intermediate | 30 min
    // -----------------------------------------------------------------------
    {
      title: 'HIIT Express Quema Grasa',
      description:
        'Rutina de alta intensidad por intervalos para quemar grasa en solo 30 min. ' +
        'Sin material, máximo resultado en poco tiempo.',
      category: 'hiit',
      difficulty: 'intermediate',
      duration: 30,
      instructor: instructorId,
      instructorName: ADMIN_NAME,
      objectives: [
        'Acelerar el metabolismo y quemar grasa',
        'Mejorar la capacidad cardiovascular',
        'Tonificar cuerpo completo',
        'Aumentar energía y resistencia',
      ],
      targetMuscles: ['cuerpo_entero', 'glúteos', 'piernas', 'core', 'hombros'],
      equipment: [],
      tags: ['hiit', 'quema_grasa', 'premium', 'intermediate', '30min', 'sin_material', 'cardio'],
      accessLevel: 'premium',
      isActive: true,
      isFeatured: true,
      mainCycles: 3,
      targetProfile: {
        ageRange: '18-35',
        level: 'intermedio',
        constitutions: ['normopeso', 'sobrepeso'],
        kneeSensitive: false,
        allowedPathologies: ['ninguna'],
      },
      blocks: {
        calentamiento: [
          {
            exerciseId: 'PHIIT_CAL_MARCHA_RAPIDA',
            name: 'Marcha rápida en el sitio',
            shortDescription: 'Elevar rodillas al ritmo rápido, balanceando brazos con energía.',
            type: 'cardio_suave',
            zone: 'cuerpo_entero',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'PHIIT_CAL_SENTADILLA_ACTIVACION',
            name: 'Sentadillas de activación',
            shortDescription: 'Sentadillas lentas y profundas para activar piernas y glúteos.',
            type: 'movilidad',
            zone: 'piernas_gluteos',
            timeSeconds: 30,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'PHIIT_CAL_SALTOS_ESTRELLA_SUAVE',
            name: 'Saltos de estrella suaves',
            shortDescription: 'Jumping jack a ritmo moderado para elevar la frecuencia cardíaca.',
            type: 'cardio_suave',
            zone: 'cuerpo_entero',
            timeSeconds: 30,
            restSeconds: 0,
            kneeFriendly: true,
            order: 3,
          },
        ],
        principal: [
          {
            exerciseId: 'PHIIT_JUMPING_JACKS',
            name: 'Jumping jacks',
            shortDescription: 'Saltos laterales clásicos abriendo brazos y piernas a máxima velocidad.',
            type: 'cardio_intenso',
            zone: 'cuerpo_entero',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'PHIIT_SENTADILLA_SALTO',
            name: 'Sentadilla con salto',
            shortDescription: 'Baja en sentadilla y explota hacia arriba con salto controlado.',
            type: 'cardio_intenso',
            zone: 'piernas_gluteos',
            timeSeconds: 35,
            restSeconds: 20,
            kneeFriendly: false,
            order: 2,
          },
          {
            exerciseId: 'PHIIT_MOUNTAIN_CLIMBER',
            name: 'Mountain climber',
            shortDescription: 'En plancha alta, llevar rodillas alternadas al pecho con rapidez.',
            type: 'cardio_intenso',
            zone: 'core_cuerpo_entero',
            timeSeconds: 35,
            restSeconds: 20,
            kneeFriendly: true,
            order: 3,
          },
          {
            exerciseId: 'PHIIT_BURPEE_MODIFICADO',
            name: 'Burpee modificado',
            shortDescription: 'Agáchate, lleva pies atrás en plancha, vuelve y salta.',
            type: 'cardio_intenso',
            zone: 'cuerpo_entero',
            timeSeconds: 35,
            restSeconds: 25,
            kneeFriendly: true,
            order: 4,
          },
        ],
        enfriamiento: [
          {
            exerciseId: 'PHIIT_ESTIR_CUADRICEPS',
            name: 'Estiramiento de cuádriceps en pie',
            shortDescription: 'De pie, sujeta el tobillo y lleva el talón al glúteo (30 seg por lado).',
            type: 'flexibilidad',
            zone: 'cuadriceps',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'PHIIT_RESPIRACION_ABDOMINAL',
            name: 'Respiración abdominal de cierre',
            shortDescription: 'Tumbada, inhala lento hinchando abdomen, exhala soltando todo.',
            type: 'movilidad',
            zone: 'cuerpo_entero',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
        ],
      },
      publishedAt: new Date(),
    },

    // -----------------------------------------------------------------------
    // P2 — Yoga Restaurativo para Espalda | premium | beginner | 35 min
    // -----------------------------------------------------------------------
    {
      title: 'Yoga Restaurativo para Espalda',
      description:
        'Secuencia de yoga suave diseñada para aliviar tensión en espalda, cuello y caderas. ' +
        'Perfecta para mujeres con trabajo sedentario o molestias posturales.',
      category: 'yoga',
      difficulty: 'beginner',
      duration: 35,
      instructor: instructorId,
      instructorName: ADMIN_NAME,
      objectives: [
        'Aliviar tensión en espalda baja y cuello',
        'Mejorar flexibilidad de cadera y columna',
        'Reducir el estrés y la ansiedad',
        'Corregir la postura diaria',
      ],
      targetMuscles: ['espalda', 'caderas', 'cuello', 'isquiotibiales', 'core_profundo'],
      equipment: ['esterilla'],
      tags: ['yoga', 'espalda', 'premium', 'beginner', '35min', 'rodillas_delicadas', 'postura', 'relajacion'],
      accessLevel: 'premium',
      isActive: true,
      isFeatured: true,
      mainCycles: 2,
      targetProfile: {
        ageRange: '36-55',
        level: 'principiante',
        constitutions: ['normopeso', 'bajo_peso'],
        kneeSensitive: true,
        allowedPathologies: ['ninguna', 'otra'],
      },
      blocks: {
        calentamiento: [
          {
            exerciseId: 'PYOGA_CAL_RESPIRACION',
            name: 'Respiración consciente',
            shortDescription: 'Sentada cómoda, inhala 4 tiempos, exhala 6. Conecta con el cuerpo.',
            type: 'movilidad',
            zone: 'cuerpo_entero',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'PYOGA_CAL_GATO_VACA',
            name: 'Gato–vaca',
            shortDescription: 'En cuatro patas, arquea y redondea espalda al ritmo de la respiración.',
            type: 'movilidad',
            zone: 'espalda_columna',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'PYOGA_CAL_CIRCULOS_CUELLO',
            name: 'Círculos de cuello',
            shortDescription: 'Sentada, traza semicírculos suaves con la cabeza de hombro a hombro.',
            type: 'movilidad',
            zone: 'cuello_hombros',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 3,
          },
        ],
        principal: [
          {
            exerciseId: 'PYOGA_POSTURA_NINO',
            name: 'Postura del niño',
            shortDescription: 'Rodillas abiertas, frente al suelo, brazos extendidos al frente.',
            type: 'flexibilidad',
            zone: 'espalda_caderas',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'PYOGA_TORSION_SUPINA',
            name: 'Torsión supina',
            shortDescription: 'Tumbada, lleva rodilla al lado opuesto y extiende brazo contrario (40 seg/lado).',
            type: 'flexibilidad',
            zone: 'espalda_oblicuos',
            timeSeconds: 80,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'PYOGA_PERRO_BOCA_ABAJO_MOD',
            name: 'Perro boca abajo modificado',
            shortDescription: 'Manos en suelo, caderas arriba, alterna talones para estirar isquios.',
            type: 'flexibilidad',
            zone: 'espalda_isquiotibiales',
            timeSeconds: 40,
            restSeconds: 0,
            kneeFriendly: true,
            order: 3,
          },
          {
            exerciseId: 'PYOGA_GUERRERO_I',
            name: 'Guerrero I',
            shortDescription: 'Paso amplio adelante, rodilla doblada, brazos al cielo (40 seg/lado).',
            type: 'equilibrio',
            zone: 'piernas_caderas_espalda',
            timeSeconds: 80,
            restSeconds: 0,
            kneeFriendly: true,
            order: 4,
          },
          {
            exerciseId: 'PYOGA_PUENTE_SUAVE',
            name: 'Puente de yoga suave',
            shortDescription: 'Tumbada, sube caderas despacio y sostén, respirando profundo.',
            type: 'movilidad',
            zone: 'espalda_gluteos',
            timeSeconds: 40,
            restSeconds: 15,
            kneeFriendly: true,
            order: 5,
          },
        ],
        enfriamiento: [
          {
            exerciseId: 'PYOGA_PIERNAS_PARED',
            name: 'Piernas en la pared',
            shortDescription: 'Tumbada, eleva piernas apoyadas en la pared para drenar y relajar.',
            type: 'flexibilidad',
            zone: 'piernas_espalda',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'PYOGA_SAVASANA',
            name: 'Savasana guiada',
            shortDescription: 'Tumbada, ojos cerrados, libera tensión de cada parte del cuerpo.',
            type: 'movilidad',
            zone: 'cuerpo_entero',
            timeSeconds: 90,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
        ],
      },
      publishedAt: new Date(),
    },

    // -----------------------------------------------------------------------
    // P3 — Full Body Escultura | premium | intermediate | 40 min
    // -----------------------------------------------------------------------
    {
      title: 'Full Body Escultura',
      description:
        'Rutina completa de tonificación para definir y esculpir todo el cuerpo en 40 min. ' +
        'Combina fuerza funcional con ejercicios compuestos para máxima eficiencia.',
      category: 'strength',
      difficulty: 'intermediate',
      duration: 40,
      instructor: instructorId,
      instructorName: ADMIN_NAME,
      objectives: [
        'Tonificar y definir todo el cuerpo',
        'Aumentar fuerza funcional',
        'Mejorar la composición corporal',
        'Desarrollar resistencia muscular',
      ],
      targetMuscles: ['glúteos', 'piernas', 'core', 'espalda', 'hombros', 'brazos'],
      equipment: [],
      tags: ['full_body', 'escultura', 'tonificacion', 'premium', 'intermediate', '40min', 'sin_material'],
      accessLevel: 'premium',
      isActive: true,
      isFeatured: true,
      mainCycles: 3,
      targetProfile: {
        ageRange: '18-35',
        level: 'intermedio',
        constitutions: ['normopeso', 'bajo_peso'],
        kneeSensitive: false,
        allowedPathologies: ['ninguna'],
      },
      blocks: {
        calentamiento: [
          {
            exerciseId: 'PFB_CAL_JUMPING_JACKS',
            name: 'Jumping jacks de calentamiento',
            shortDescription: 'Saltos laterales a ritmo moderado para elevar temperatura corporal.',
            type: 'cardio_suave',
            zone: 'cuerpo_entero',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'PFB_CAL_ROTACION_CADERA',
            name: 'Rotaciones de cadera',
            shortDescription: 'De pie, manos en caderas, círculos amplios en ambas direcciones.',
            type: 'movilidad',
            zone: 'caderas',
            timeSeconds: 40,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'PFB_CAL_SENTADILLA_CALENTAMIENTO',
            name: 'Sentadillas de calentamiento',
            shortDescription: 'Sentadillas lentas tocando talones al bajar para activar articulaciones.',
            type: 'movilidad',
            zone: 'piernas_gluteos',
            timeSeconds: 40,
            restSeconds: 0,
            kneeFriendly: true,
            order: 3,
          },
        ],
        principal: [
          {
            exerciseId: 'PFB_SENTADILLA_BULGARA',
            name: 'Sentadilla búlgara',
            shortDescription: 'Pie trasero elevado en silla, baja la rodilla sin tocar suelo (40 seg/lado).',
            type: 'fuerza',
            zone: 'piernas_gluteos',
            timeSeconds: 80,
            restSeconds: 25,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'PFB_FLEXIONES_ESTANDAR',
            name: 'Flexiones estándar',
            shortDescription: 'Cuerpo recto desde cabeza a talones, baja el pecho sin tocar suelo.',
            type: 'fuerza',
            zone: 'pecho_brazos_core',
            timeSeconds: 40,
            restSeconds: 25,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'PFB_ZANCADA_REVERSE',
            name: 'Zancada inversa',
            shortDescription: 'Da un paso atrás bajando la rodilla trasera cerca del suelo (40 seg/lado).',
            type: 'fuerza',
            zone: 'piernas_gluteos',
            timeSeconds: 80,
            restSeconds: 20,
            kneeFriendly: true,
            order: 3,
          },
          {
            exerciseId: 'PFB_PLANCHA_LATERAL',
            name: 'Plancha lateral',
            shortDescription: 'Apoyada en antebrazo y pie, eleva cadera y mantén estable (35 seg/lado).',
            type: 'fuerza',
            zone: 'core_oblicuos',
            timeSeconds: 70,
            restSeconds: 20,
            kneeFriendly: true,
            order: 4,
          },
          {
            exerciseId: 'PFB_SUPERMAN',
            name: 'Superman',
            shortDescription: 'Boca abajo, eleva brazos y piernas simultáneamente apretando glúteos.',
            type: 'fuerza',
            zone: 'espalda_gluteos',
            timeSeconds: 35,
            restSeconds: 20,
            kneeFriendly: true,
            order: 5,
          },
        ],
        enfriamiento: [
          {
            exerciseId: 'PFB_ESTIR_CADERA',
            name: 'Estiramiento de flexores de cadera',
            shortDescription: 'Una rodilla en suelo, inclina cadera hacia delante (45 seg/lado).',
            type: 'flexibilidad',
            zone: 'caderas_flexores',
            timeSeconds: 90,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'PFB_ESTIR_ESPALDA_SUELO',
            name: 'Estiramiento de espalda en suelo',
            shortDescription: 'Tumbada, abraza rodillas al pecho y mece suavemente.',
            type: 'flexibilidad',
            zone: 'espalda_lumbar',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
        ],
      },
      publishedAt: new Date(),
    },

  ];
}

async function seedPremium() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong';

  console.log('Conectando a MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Conexión establecida.');

  let instructor = await User.findOne({ email: ADMIN_EMAIL });
  if (!instructor) {
    console.log(`Instructor no encontrado. Creando "${ADMIN_EMAIL}"...`);
    const hashedPassword = await bcrypt.hash(ADMIN_PASS, 12);
    instructor = await User.create({
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      password: hashedPassword,
      provider: 'local',
      role: 'admin',
      emailVerified: true,
      fitnessLevel: 'advanced',
      active: true,
      subscription: {
        plan: 'premium',
        active: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        trialUsed: true,
      },
    });
    console.log(`Instructor creado: ${instructor._id}`);
  } else {
    console.log(`Instructor encontrado: ${instructor._id}`);
  }

  const routines = buildRoutines(instructor._id);
  console.log(`\nInsertando/actualizando ${routines.length} rutinas Premium...`);

  for (const routineData of routines) {
    const result = await Routine.findOneAndUpdate(
      { title: routineData.title },
      { $set: routineData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ "${result.title}" — _id: ${result._id} — accessLevel: ${result.accessLevel}`);
  }

  console.log('\n✅ Seed Premium completado.');
  console.log('   🔥 HIIT Express Quema Grasa       (premium / intermediate / 30 min)');
  console.log('   🧘 Yoga Restaurativo para Espalda  (premium / beginner    / 35 min)');
  console.log('   💪 Full Body Escultura             (premium / intermediate / 40 min)');
}

if (require.main === module) {
  seedPremium()
    .then(() => { console.log('\n🏁 Proceso completado.'); process.exit(0); })
    .catch((err) => { console.error('💥 Error durante el seed:', err); process.exit(1); })
    .finally(() => { mongoose.disconnect(); });
}

module.exports = { seedPremium, buildRoutines };
