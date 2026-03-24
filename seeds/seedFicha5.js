'use strict';

/**
 * seedFicha5.js
 * Agrega la rutina "Tren Superior Suave sin Equipo" a la colección Routine.
 *
 * Uso:
 *   node seeds/seedFicha5.js
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
    // FICHA 5 — Tren Superior Suave sin Equipo | free | beginner | 20 min
    // -----------------------------------------------------------------------
    {
      title: 'Tren Superior Suave sin Equipo',
      description:
        'Rutina de 20 min para tonificar brazos, espalda y pecho solo con peso corporal, ' +
        'ideal para empezar a ganar fuerza sin materiales.',
      category: 'functional',
      difficulty: 'beginner',
      duration: 20,
      instructor: instructorId,
      instructorName: ADMIN_NAME,
      objectives: [
        'Fortalecer tren superior básico',
        'Mejorar postura diaria',
        'Activar core sin impacto',
        'Preparar el cuerpo para rutinas más intensas',
      ],
      targetMuscles: ['hombros', 'espalda', 'pecho', 'tríceps', 'bíceps', 'core'],
      equipment: [],
      tags: ['tren_superior', 'sin_material', 'beginner', 'free', '20min', 'rodillas_delicadas'],
      accessLevel: 'free',
      isActive: true,
      isFeatured: false,
      mainCycles: 2,
      targetProfile: {
        ageRange: '18-35',
        level: 'principiante',
        constitutions: ['normopeso'],
        kneeSensitive: true,
        allowedPathologies: ['ninguna'],
      },
      blocks: {
        // -------------------------------------------------------------------
        // BLOQUE 1 — CALENTAMIENTO (5-7 min)
        // -------------------------------------------------------------------
        calentamiento: [
          {
            exerciseId: 'FICHA5_CAL_MARCHA_BRAZOS',
            name: 'Marcha con brazos activos',
            shortDescription: 'Caminar en el sitio moviendo brazos al frente y atrás.',
            type: 'cardio_suave',
            zone: 'cuerpo_entero',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'FICHA5_CAL_CIRCULOS_BRAZOS',
            name: 'Círculos de brazos',
            shortDescription: 'De pie, hacer círculos grandes con ambos brazos (30 seg adelante + 30 atrás).',
            type: 'movilidad',
            zone: 'hombros',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
        ],
        // -------------------------------------------------------------------
        // BLOQUE 2 — PARTE PRINCIPAL (12-13 min, 2 ciclos)
        // -------------------------------------------------------------------
        principal: [
          {
            exerciseId: 'FICHA5_FLEXIONES_PARED',
            name: 'Flexiones en pared',
            shortDescription: 'Manos en pared, cuerpo inclinado, flexiona y extiende brazos.',
            type: 'fuerza',
            zone: 'pecho_triceps',
            timeSeconds: 40,
            repetitions: '12',
            restSeconds: 30,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'FICHA5_REMO_INCLINADO',
            name: 'Remo inclinado sin peso',
            shortDescription: 'Inclinada hacia delante, brazos cuelgan y tiran hacia costillas.',
            type: 'fuerza',
            zone: 'espalda',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'FICHA5_APERTURAS_CRUZ',
            name: 'Aperturas en cruz',
            shortDescription: 'Brazos en cruz, pequeños círculos controlados.',
            type: 'fuerza',
            zone: 'hombros',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 3,
          },
        ],
        // -------------------------------------------------------------------
        // BLOQUE 3 — ENFRIAMIENTO (3-5 min)
        // -------------------------------------------------------------------
        enfriamiento: [
          {
            exerciseId: 'FICHA5_ESTIR_PECHO_PARED',
            name: 'Estiramiento de pecho en pared',
            shortDescription: 'Mano en pared, gira torso hacia fuera (30 seg por lado).',
            type: 'flexibilidad',
            zone: 'pecho',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
        ],
      },
      publishedAt: new Date(),
    },
  ];
}

async function seedFicha5() {
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
  console.log(`\nInsertando/actualizando ${routines.length} rutina(s)...`);

  for (const routineData of routines) {
    const result = await Routine.findOneAndUpdate(
      { title: routineData.title },
      { $set: routineData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ "${result.title}" — _id: ${result._id} — accessLevel: ${result.accessLevel}`);
  }

  console.log('\n✅ Seed Ficha 5 completado.');
  console.log('   💪 Tren Superior Suave sin Equipo  (free / beginner / 20 min)');
}

if (require.main === module) {
  seedFicha5()
    .then(() => { console.log('\n🏁 Proceso completado.'); process.exit(0); })
    .catch((err) => { console.error('💥 Error durante el seed:', err); process.exit(1); })
    .finally(() => { mongoose.disconnect(); });
}

module.exports = { seedFicha5, buildRoutines };
