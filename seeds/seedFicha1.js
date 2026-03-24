'use strict';

/**
 * seedFicha1.js
 * Agrega la rutina "Glúteos Fáciles en Casa" a la colección Routine.
 *
 * Uso:
 *   node seeds/seedFicha1.js
 *
 * Requiere MONGODB_URI en .env (o usa localhost/evastrong por defecto).
 */

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User    = require('../models/User');
const Routine = require('../models/Routine');

const ADMIN_EMAIL = 'eva@evastrong.app';
const ADMIN_NAME  = 'Eva Strong';
const ADMIN_PASS  = 'EvaStrong2025!';

function buildRoutines(instructorId) {
  return [
    // -----------------------------------------------------------------------
    // FICHA 1 — Glúteos Fáciles en Casa  |  free  |  beginner  |  25 min
    // -----------------------------------------------------------------------
    {
      title: 'Glúteos Fáciles en Casa',
      description:
        'Rutina sin equipo para tonificar glúteos y piernas en 25 min. ' +
        'Ideal para empezar con confianza y ver resultados rápidos.',
      category: 'strength',
      difficulty: 'beginner',
      duration: 25,
      instructor: instructorId,
      instructorName: ADMIN_NAME,
      objectives: [
        'Tonificar glúteos y piernas',
        'Mejorar fuerza básica',
        'Aumentar confianza en movimiento',
        'Reducir grasa en tren inferior',
      ],
      targetMuscles: ['glúteos', 'cuádriceps', 'isquiotibiales', 'core'],
      equipment: [],
      tags: ['gluteos', 'sin_material', '25min', 'free', 'beginner', 'sobrepeso'],
      accessLevel: 'free',
      isActive: true,
      isFeatured: true,
      mainCycles: 2,
      targetProfile: {
        ageRange: '18-35',
        level: 'principiante',
        constitutions: ['sobrepeso'],
        kneeSensitive: false,
        allowedPathologies: ['ninguna'],
      },
      blocks: {
        // -------------------------------------------------------------------
        // BLOQUE 1 — CALENTAMIENTO (5 min)
        // -------------------------------------------------------------------
        calentamiento: [
          {
            exerciseId: 'FICHA1_CAL_MARCHA_SITIO',
            name: 'Marcha en el sitio',
            shortDescription: 'Camina levantando rodillas suavemente sin saltos.',
            type: 'cardio_suave',
            zone: 'cuerpo_entero',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'FICHA1_CAL_CIRCULOS_CADERA',
            name: 'Círculos de cadera',
            shortDescription: 'Manos en caderas, rota suavemente en círculos amplios (30 seg por lado).',
            type: 'movilidad',
            zone: 'caderas',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
        ],
        // -------------------------------------------------------------------
        // BLOQUE 2 — PARTE PRINCIPAL (15 min, 2 ciclos)
        // -------------------------------------------------------------------
        principal: [
          {
            exerciseId: 'FICHA1_PUENTE_GLUTEOS',
            name: 'Puente de glúteos',
            shortDescription: 'Acostada, pies en suelo, sube cadera apretando glúteos.',
            type: 'fuerza',
            zone: 'glúteos',
            timeSeconds: 40,
            repetitions: '12',
            restSeconds: 20,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'FICHA1_PATADA_GLUTEOS_PULSADA',
            name: 'Patada de glúteos pulsada',
            shortDescription: 'De rodillas, extiende una pierna atrás y pulsa (10 rep por lado).',
            type: 'fuerza',
            zone: 'glúteos',
            timeSeconds: 40,
            repetitions: '10 por lado',
            restSeconds: 20,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'FICHA1_SENTADILLA_ELEVACION',
            name: 'Sentadilla con elevación',
            shortDescription: 'Baja en sentadilla, sube elevando una pierna lateral (10 rep por lado).',
            type: 'fuerza',
            zone: 'piernas',
            timeSeconds: 45,
            repetitions: '10 por lado',
            restSeconds: 30,
            kneeFriendly: true,
            order: 3,
          },
        ],
        // -------------------------------------------------------------------
        // BLOQUE 3 — ENFRIAMIENTO (5 min)
        // -------------------------------------------------------------------
        enfriamiento: [
          {
            exerciseId: 'FICHA1_ESTIR_ISQUIOS',
            name: 'Estiramiento de isquiotibiales',
            shortDescription: 'Sentada, extiende una pierna y toca el pie (30 seg por lado).',
            type: 'flexibilidad',
            zone: 'piernas',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'FICHA1_ESTIR_GLUTEOS',
            name: 'Estiramiento de glúteos',
            shortDescription: 'Acostada, cruza tobillo sobre rodilla opuesta y sostén (30 seg por lado).',
            type: 'flexibilidad',
            zone: 'glúteos',
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

// ---------------------------------------------------------------------------
// Función principal
// ---------------------------------------------------------------------------

async function seedFicha1() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong';

  console.log('Conectando a MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Conexión establecida.');

  // Buscar o crear el instructor
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

  console.log(`\nInsertando/actualizando ${routines.length} rutina(s)...`);

  for (const routineData of routines) {
    const result = await Routine.findOneAndUpdate(
      { title: routineData.title },
      { $set: routineData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ "${result.title}" — _id: ${result._id} — accessLevel: ${result.accessLevel}`);
  }

  console.log('\n✅ Seed Ficha 1 completado.');
  console.log('   🍑 Glúteos Fáciles en Casa  (free / beginner / 25 min)');
}

// ---------------------------------------------------------------------------
// Entrada
// ---------------------------------------------------------------------------

if (require.main === module) {
  seedFicha1()
    .then(() => {
      console.log('\n🏁 Proceso completado.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('💥 Error durante el seed:', err);
      process.exit(1);
    })
    .finally(() => {
      mongoose.disconnect();
    });
}

module.exports = { seedFicha1, buildRoutines };
