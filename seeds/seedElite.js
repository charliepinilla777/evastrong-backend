'use strict';

/**
 * seedElite.js
 * Agrega 3 rutinas de nivel Elite (exclusive) a la colección Routine.
 *
 * Uso:
 *   node seeds/seedElite.js
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
    // E1 — HIIT Metabólico Elite | exclusive | advanced | 35 min
    // -----------------------------------------------------------------------
    {
      title: 'HIIT Metabólico Elite',
      description:
        'Entrenamiento de alta intensidad metabólica para mujeres avanzadas que buscan ' +
        'máximo rendimiento, quema de grasa y definición total en 35 min.',
      category: 'hiit',
      difficulty: 'advanced',
      duration: 35,
      instructor: instructorId,
      instructorName: ADMIN_NAME,
      objectives: [
        'Maximizar la quema de grasa en el menor tiempo posible',
        'Aumentar la capacidad metabólica basal',
        'Desarrollar resistencia cardiovascular avanzada',
        'Tonificar y definir cuerpo completo',
      ],
      targetMuscles: ['cuerpo_entero', 'core', 'glúteos', 'piernas', 'hombros'],
      equipment: [],
      tags: ['hiit', 'metabolico', 'elite', 'exclusive', 'advanced', '35min', 'sin_material', 'quema_grasa'],
      accessLevel: 'exclusive',
      isActive: true,
      isFeatured: true,
      mainCycles: 4,
      targetProfile: {
        ageRange: '18-35',
        level: 'avanzado',
        constitutions: ['normopeso', 'bajo_peso'],
        kneeSensitive: false,
        allowedPathologies: ['ninguna'],
      },
      blocks: {
        calentamiento: [
          {
            exerciseId: 'EHIIT_CAL_CARRERA_SITIO',
            name: 'Carrera en el sitio',
            shortDescription: 'Carrera moderada elevando rodillas, aumentando ritmo progresivamente.',
            type: 'cardio_suave',
            zone: 'cuerpo_entero',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'EHIIT_CAL_CIRCULOS_CADERAS',
            name: 'Círculos de caderas',
            shortDescription: 'Manos en caderas, traza círculos amplios activando movilidad articular.',
            type: 'movilidad',
            zone: 'caderas',
            timeSeconds: 40,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'EHIIT_CAL_SENTADILLA_EXPLOSIVA_SUAVE',
            name: 'Sentadillas explosivas suaves',
            shortDescription: 'Sentadillas rápidas sin salto, activando explosividad muscular.',
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
            exerciseId: 'EHIIT_BURPEE_COMPLETO',
            name: 'Burpee completo',
            shortDescription: 'De pie al suelo en plancha, flexión, salto con brazos arriba.',
            type: 'cardio_intenso',
            zone: 'cuerpo_entero',
            timeSeconds: 40,
            restSeconds: 15,
            kneeFriendly: false,
            order: 1,
          },
          {
            exerciseId: 'EHIIT_SALTO_CAJÓN',
            name: 'Salto al cajón imaginario',
            shortDescription: 'Salta con ambos pies aterrizando en cuclillas con control total.',
            type: 'cardio_intenso',
            zone: 'piernas_gluteos',
            timeSeconds: 35,
            restSeconds: 15,
            kneeFriendly: false,
            order: 2,
          },
          {
            exerciseId: 'EHIIT_PLANCHA_RODILLA_PECHO',
            name: 'Plancha con rodilla al pecho',
            shortDescription: 'En plancha alta, lleva cada rodilla al codo del mismo lado alternativamente.',
            type: 'cardio_intenso',
            zone: 'core_cuerpo_entero',
            timeSeconds: 35,
            restSeconds: 15,
            kneeFriendly: true,
            order: 3,
          },
          {
            exerciseId: 'EHIIT_SPRINT_SITIO',
            name: 'Sprint en el sitio',
            shortDescription: 'Carrera máxima en el lugar elevando rodillas al máximo posible.',
            type: 'cardio_intenso',
            zone: 'cuerpo_entero',
            timeSeconds: 30,
            restSeconds: 20,
            kneeFriendly: true,
            order: 4,
          },
        ],
        enfriamiento: [
          {
            exerciseId: 'EHIIT_ESTIR_FLEXORES_CADERA',
            name: 'Estiramiento de flexores de cadera',
            shortDescription: 'Una rodilla en suelo, empuja cadera hacia delante (45 seg/lado).',
            type: 'flexibilidad',
            zone: 'caderas_flexores',
            timeSeconds: 90,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'EHIIT_ESTIR_ISQUIO_PIE',
            name: 'Estiramiento de isquios en pie',
            shortDescription: 'De pie, pierna extendida en talón, inclina torso hacia ella (40 seg/lado).',
            type: 'flexibilidad',
            zone: 'isquiotibiales',
            timeSeconds: 80,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
        ],
      },
      publishedAt: new Date(),
    },

    // -----------------------------------------------------------------------
    // E2 — Pilates Abdomen y Cintura | exclusive | advanced | 40 min
    // -----------------------------------------------------------------------
    {
      title: 'Pilates Abdomen y Cintura',
      description:
        'Sesión de pilates avanzado centrada en el trabajo profundo del core para conseguir ' +
        'un abdomen plano y cintura definida. Requiere concentración y control total.',
      category: 'pilates',
      difficulty: 'advanced',
      duration: 40,
      instructor: instructorId,
      instructorName: ADMIN_NAME,
      objectives: [
        'Fortalecer y aplanar el abdomen profundo',
        'Definir y reducir la cintura',
        'Mejorar el control corporal y la coordinación',
        'Desarrollar la estabilidad espinal',
      ],
      targetMuscles: ['transverso_abdominal', 'oblicuos', 'core_profundo', 'lumbares', 'caderas'],
      equipment: ['esterilla'],
      tags: ['pilates', 'abdomen', 'cintura', 'elite', 'exclusive', 'advanced', '40min', 'core'],
      accessLevel: 'exclusive',
      isActive: true,
      isFeatured: true,
      mainCycles: 3,
      targetProfile: {
        ageRange: '18-35',
        level: 'avanzado',
        constitutions: ['normopeso', 'bajo_peso'],
        kneeSensitive: true,
        allowedPathologies: ['ninguna'],
      },
      blocks: {
        calentamiento: [
          {
            exerciseId: 'EPIL_CAL_RESPIRACION_PILATES',
            name: 'Respiración pilates',
            shortDescription: 'Inhala por nariz expandiendo costillas, exhala por boca vaciando abdomen.',
            type: 'movilidad',
            zone: 'core_respiracion',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'EPIL_CAL_ROLL_DOWN',
            name: 'Roll down',
            shortDescription: 'De pie, desciende vértebra a vértebra hasta colgar el torso y sube igual.',
            type: 'movilidad',
            zone: 'columna_espalda',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'EPIL_CAL_CIRCULOS_PIERNA_TUMBADA',
            name: 'Círculos de pierna tumbada',
            shortDescription: 'Tumbada, traza círculos controlados con una pierna extendida (ambos lados).',
            type: 'movilidad',
            zone: 'caderas_core',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 3,
          },
        ],
        principal: [
          {
            exerciseId: 'EPIL_THE_HUNDRED',
            name: 'The hundred',
            shortDescription: 'Piernas en tabletop, cabeza elevada, bombea brazos 100 tiempos respirando.',
            type: 'fuerza',
            zone: 'core_abdomen',
            timeSeconds: 60,
            restSeconds: 15,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'EPIL_ROLL_UP',
            name: 'Roll up',
            shortDescription: 'Tumbada, eleva el torso articulando columna hasta tocar los pies y baja.',
            type: 'fuerza',
            zone: 'abdomen_espalda',
            timeSeconds: 40,
            restSeconds: 15,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'EPIL_TIJERAS',
            name: 'Tijeras',
            shortDescription: 'Tumbada, alterna piernas extendidas subiendo y bajando en control.',
            type: 'fuerza',
            zone: 'core_piernas',
            timeSeconds: 40,
            restSeconds: 15,
            kneeFriendly: true,
            order: 3,
          },
          {
            exerciseId: 'EPIL_SIDE_KICK',
            name: 'Side kick',
            shortDescription: 'De lado, lanza la pierna superior al frente y atrás con control (ambos lados).',
            type: 'fuerza',
            zone: 'caderas_oblicuos',
            timeSeconds: 80,
            restSeconds: 15,
            kneeFriendly: true,
            order: 4,
          },
          {
            exerciseId: 'EPIL_TEASER_MOD',
            name: 'Teaser modificado',
            shortDescription: 'Sentada en V con piernas en tabletop, sube y baja controlando el core.',
            type: 'fuerza',
            zone: 'core_abdomen_profundo',
            timeSeconds: 35,
            restSeconds: 20,
            kneeFriendly: true,
            order: 5,
          },
          {
            exerciseId: 'EPIL_GIRO_SIRENA',
            name: 'Giro de sirena',
            shortDescription: 'Sentada lateral, estira un brazo al cielo y gira el torso (ambos lados).',
            type: 'fuerza',
            zone: 'oblicuos_cintura',
            timeSeconds: 80,
            restSeconds: 15,
            kneeFriendly: true,
            order: 6,
          },
        ],
        enfriamiento: [
          {
            exerciseId: 'EPIL_SWAN_DIVE',
            name: 'Swan dive',
            shortDescription: 'Boca abajo, manos bajo hombros, eleva pecho estirando abdomen.',
            type: 'flexibilidad',
            zone: 'abdomen_espalda',
            timeSeconds: 40,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'EPIL_CHILDS_POSE',
            name: 'Postura del niño de cierre',
            shortDescription: 'Rodillas abiertas, frente al suelo. Respira profundo y libera tensión.',
            type: 'flexibilidad',
            zone: 'espalda_caderas_core',
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
    // E3 — Transformación Corporal 360° | exclusive | advanced | 50 min
    // -----------------------------------------------------------------------
    {
      title: 'Transformación Corporal 360°',
      description:
        'Rutina funcional avanzada que trabaja todo el cuerpo con banda elástica y peso corporal. ' +
        'Diseñada para mujeres que buscan una transformación física completa y duradera.',
      category: 'functional',
      difficulty: 'advanced',
      duration: 50,
      instructor: instructorId,
      instructorName: ADMIN_NAME,
      objectives: [
        'Transformar y esculpir todo el cuerpo',
        'Aumentar fuerza funcional avanzada',
        'Desarrollar potencia y resistencia muscular',
        'Lograr definición corporal completa',
      ],
      targetMuscles: ['cuerpo_entero', 'glúteos', 'core', 'espalda', 'piernas', 'brazos', 'hombros'],
      equipment: ['banda elástica', 'esterilla'],
      tags: ['full_body', 'transformacion', 'banda_elastica', 'elite', 'exclusive', 'advanced', '50min', 'funcional'],
      accessLevel: 'exclusive',
      isActive: true,
      isFeatured: true,
      mainCycles: 3,
      targetProfile: {
        ageRange: '18-35',
        level: 'avanzado',
        constitutions: ['normopeso', 'bajo_peso'],
        kneeSensitive: false,
        allowedPathologies: ['ninguna'],
      },
      blocks: {
        calentamiento: [
          {
            exerciseId: 'E360_CAL_DINAMICO_COMPLETO',
            name: 'Calentamiento dinámico completo',
            shortDescription: 'Combinación de marcha, círculos de brazos y rotaciones de tronco en secuencia.',
            type: 'cardio_suave',
            zone: 'cuerpo_entero',
            timeSeconds: 90,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'E360_CAL_MOVILIDAD_CADERA',
            name: 'Movilidad de cadera',
            shortDescription: 'Círculos de cadera amplios y apertura de piernas alternada en suelo.',
            type: 'movilidad',
            zone: 'caderas_gluteos',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'E360_CAL_ACTIVACION_GLUTEO_BANDA',
            name: 'Activación de glúteos con banda',
            shortDescription: 'Banda en rodillas, sentadilla parcial con pequeñas aperturas laterales.',
            type: 'movilidad',
            zone: 'gluteos_abductores',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 3,
          },
        ],
        principal: [
          {
            exerciseId: 'E360_PESO_MUERTO_BANDA',
            name: 'Peso muerto con banda',
            shortDescription: 'Banda bajo pies, inclina torso con espalda recta tirando la banda hacia arriba.',
            type: 'fuerza',
            zone: 'isquiotibiales_gluteos_espalda',
            timeSeconds: 45,
            restSeconds: 20,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'E360_SENTADILLA_PRESS_BANDA',
            name: 'Sentadilla con press de banda',
            shortDescription: 'Banda bajo pies, sube de sentadilla empujando brazos al cielo.',
            type: 'fuerza',
            zone: 'piernas_gluteos_hombros',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'E360_REMO_BANDA',
            name: 'Remo con banda',
            shortDescription: 'Banda anclada al frente, inclínate y tira hacia las costillas con ambos brazos.',
            type: 'fuerza',
            zone: 'espalda_biceps',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 3,
          },
          {
            exerciseId: 'E360_ESTOCADA_ROTACION',
            name: 'Estocada con rotación de torso',
            shortDescription: 'Zancada adelante, gira el torso hacia la pierna delantera (40 seg/lado).',
            type: 'fuerza',
            zone: 'piernas_core_oblicuos',
            timeSeconds: 80,
            restSeconds: 20,
            kneeFriendly: true,
            order: 4,
          },
          {
            exerciseId: 'E360_PLANCHA_DINAMICA',
            name: 'Plancha dinámica',
            shortDescription: 'Alterna entre plancha de manos y plancha de antebrazos sin bajar caderas.',
            type: 'fuerza',
            zone: 'core_brazos_hombros',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 5,
          },
        ],
        enfriamiento: [
          {
            exerciseId: 'E360_ESTIR_TREN_INFERIOR',
            name: 'Estiramiento completo tren inferior',
            shortDescription: 'Secuencia: isquios, cuádriceps, glúteos y caderas (15 seg cada uno/lado).',
            type: 'flexibilidad',
            zone: 'tren_inferior_completo',
            timeSeconds: 90,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'E360_ESTIR_TREN_SUPERIOR',
            name: 'Estiramiento completo tren superior',
            shortDescription: 'Secuencia: pecho, hombros, espalda y brazos con respiración profunda.',
            type: 'flexibilidad',
            zone: 'tren_superior_completo',
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

async function seedElite() {
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
  console.log(`\nInsertando/actualizando ${routines.length} rutinas Elite...`);

  for (const routineData of routines) {
    const result = await Routine.findOneAndUpdate(
      { title: routineData.title },
      { $set: routineData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ "${result.title}" — _id: ${result._id} — accessLevel: ${result.accessLevel}`);
  }

  console.log('\n✅ Seed Elite completado.');
  console.log('   ⚡ HIIT Metabólico Elite          (exclusive / advanced / 35 min)');
  console.log('   🎯 Pilates Abdomen y Cintura       (exclusive / advanced / 40 min)');
  console.log('   🏆 Transformación Corporal 360°    (exclusive / advanced / 50 min)');
}

if (require.main === module) {
  seedElite()
    .then(() => { console.log('\n🏁 Proceso completado.'); process.exit(0); })
    .catch((err) => { console.error('💥 Error durante el seed:', err); process.exit(1); })
    .finally(() => { mongoose.disconnect(); });
}

module.exports = { seedElite, buildRoutines };
