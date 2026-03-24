'use strict';

/**
 * seedFicha6.js
 * Agrega la rutina "Cardio Suave Plus para Empezar" a la colección Routine.
 *
 * Uso:
 *   node seeds/seedFicha6.js
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
    // FICHA 6 — Cardio Suave Plus para Empezar | basic | beginner | 20 min
    // -----------------------------------------------------------------------
    {
      title: 'Cardio Suave Plus para Empezar',
      description:
        '20 min de cardio de bajo impacto ideal para mujeres con sobrepeso u obesidad ' +
        'que quieren empezar sin daño articular.',
      category: 'cardio',
      difficulty: 'beginner',
      duration: 20,
      instructor: instructorId,
      instructorName: ADMIN_NAME,
      objectives: [
        'Iniciar pérdida de peso con bajo impacto',
        'Mejorar capacidad cardiovascular',
        'Proteger rodillas y articulaciones',
        'Crear hábito de movimiento diario',
      ],
      targetMuscles: ['cuerpo_entero', 'glúteos', 'piernas', 'core'],
      equipment: ['esterilla (opcional)'],
      tags: ['cardio_suave', 'bajo_impacto', 'obesidad', 'sobrepeso', 'basic', '20min', 'rodillas_delicadas'],
      accessLevel: 'basic',
      isActive: true,
      isFeatured: true,
      mainCycles: 2,
      targetProfile: {
        ageRange: '36-55',
        level: 'principiante',
        constitutions: ['sobrepeso', 'obesidad'],
        kneeSensitive: true,
        allowedPathologies: ['cardiaca', 'metabolica'],
      },
      blocks: {
        // -------------------------------------------------------------------
        // BLOQUE 1 — CALENTAMIENTO (5 min)
        // -------------------------------------------------------------------
        calentamiento: [
          {
            exerciseId: 'FICHA6_CAL_MARCHA_LATERAL',
            name: 'Marcha lateral suave',
            shortDescription: 'Paso a un lado y al centro, alternando sin saltos.',
            type: 'cardio_suave',
            zone: 'cuerpo_entero',
            timeSeconds: 60,
            restSeconds: 15,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'FICHA6_CAL_ROTACION_TRONCO',
            name: 'Rotaciones de tronco',
            shortDescription: 'De pie, pies anchos, gira torso derecha-izquierda.',
            type: 'movilidad',
            zone: 'core_espalda',
            timeSeconds: 45,
            restSeconds: 15,
            kneeFriendly: true,
            order: 2,
          },
        ],
        // -------------------------------------------------------------------
        // BLOQUE 2 — PARTE PRINCIPAL (12-13 min, 2 ciclos)
        // -------------------------------------------------------------------
        principal: [
          {
            exerciseId: 'FICHA6_PASO_ADELANTE_ATRAS',
            name: 'Paso adelante–atrás',
            shortDescription: 'Da un paso suave adelante y vuelve al centro, alternando pies.',
            type: 'cardio_suave',
            zone: 'piernas',
            timeSeconds: 45,
            restSeconds: 20,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'FICHA6_MARCHA_RODILLA_BAJA',
            name: 'Marcha con rodilla baja',
            shortDescription: 'Levanta rodilla solo un poco, sin impacto.',
            type: 'cardio_suave',
            zone: 'piernas_core',
            timeSeconds: 45,
            restSeconds: 20,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'FICHA6_TOQUES_PUNTA',
            name: 'Toques de punta al frente',
            shortDescription: 'Toca el suelo o la punta del pie alternando piernas.',
            type: 'cardio_suave',
            zone: 'piernas_core',
            timeSeconds: 45,
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
            exerciseId: 'FICHA6_ESTIR_PANTORRILLAS',
            name: 'Estiramiento de pantorrillas en pared',
            shortDescription: 'Pie atrás, talón al suelo, inclina cuerpo hacia la pared (30 seg por pierna).',
            type: 'flexibilidad',
            zone: 'pantorrillas',
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

async function seedFicha6() {
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

  console.log('\n✅ Seed Ficha 6 completado.');
  console.log('   🚶‍♀️ Cardio Suave Plus para Empezar  (basic / beginner / 20 min)');
}

if (require.main === module) {
  seedFicha6()
    .then(() => { console.log('\n🏁 Proceso completado.'); process.exit(0); })
    .catch((err) => { console.error('💥 Error durante el seed:', err); process.exit(1); })
    .finally(() => { mongoose.disconnect(); });
}

module.exports = { seedFicha6, buildRoutines };
