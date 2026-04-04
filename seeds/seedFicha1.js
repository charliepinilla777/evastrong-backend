'use strict';

/**
 * seedFicha1.js
 * Rutina "Glúteos Fáciles en Casa" — free | beginner | 25 min
 * Estructura de gimnasio real: calentamiento con series + principal + enfriamiento
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

        // ────────────────────────────────────────────────────────────────────
        // CALENTAMIENTO (5 min) — series para activar todo el cuerpo
        // ────────────────────────────────────────────────────────────────────
        calentamiento: [
          {
            exerciseId: 'FICHA1_CAL_MARCHA_SITIO',
            name: 'Marcha en el sitio',
            shortDescription: 'Levanta las rodillas alternando, con ritmo suave. Activa la circulación.',
            type: 'cardio_suave',
            zone: 'cuerpo_entero',
            sets: 2,
            repetitions: '20 pasos',
            timeSeconds: 30,
            restSeconds: 10,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'FICHA1_CAL_ABRE_CIERRA_BRAZOS',
            name: 'Abre y cierra los brazos',
            shortDescription: 'Extiende los brazos al frente y ábrelos hacia los lados. Activa hombros y pecho.',
            type: 'movilidad',
            zone: 'hombros_pecho',
            sets: 4,
            repetitions: '20 repeticiones',
            timeSeconds: 25,
            restSeconds: 10,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'FICHA1_CAL_CIRCULOS_CADERA',
            name: 'Círculos de cadera',
            shortDescription: 'Manos en caderas, rota en círculos amplios. 10 hacia un lado, luego al otro.',
            type: 'movilidad',
            zone: 'caderas',
            sets: 2,
            repetitions: '10 por lado',
            timeSeconds: 30,
            restSeconds: 10,
            kneeFriendly: true,
            order: 3,
          },
          {
            exerciseId: 'FICHA1_CAL_INCLINACIONES',
            name: 'Inclinaciones laterales',
            shortDescription: 'De pie, desliza la mano por el costado hacia abajo. Alterna lado izquierdo y derecho.',
            type: 'movilidad',
            zone: 'cintura_oblicuos',
            sets: 2,
            repetitions: '10 por lado',
            timeSeconds: 25,
            restSeconds: 10,
            kneeFriendly: true,
            order: 4,
          },
        ],

        // ────────────────────────────────────────────────────────────────────
        // PARTE PRINCIPAL (15 min — 2 ciclos)
        // ────────────────────────────────────────────────────────────────────
        principal: [
          {
            exerciseId: 'FICHA1_PUENTE_GLUTEOS',
            name: 'Puente de glúteos',
            shortDescription: 'Acostada boca arriba, pies apoyados, sube la cadera apretando los glúteos. Baja despacio.',
            type: 'fuerza',
            zone: 'glúteos',
            sets: 3,
            repetitions: '15 repeticiones',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'FICHA1_PATADA_GLUTEOS',
            name: 'Patada de glúteos',
            shortDescription: 'De rodillas apoyada en manos, extiende una pierna atrás y arriba. Aprieta el glúteo en la cima.',
            type: 'fuerza',
            zone: 'glúteos',
            sets: 3,
            repetitions: '12 por lado',
            timeSeconds: 45,
            restSeconds: 20,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'FICHA1_SENTADILLA_ELEVACION',
            name: 'Sentadilla con elevación lateral',
            shortDescription: 'Baja en sentadilla y al subir eleva una pierna al lado. Alterna el lado en cada repetición.',
            type: 'fuerza',
            zone: 'piernas_gluteos',
            sets: 3,
            repetitions: '10 por lado',
            timeSeconds: 50,
            restSeconds: 30,
            kneeFriendly: true,
            order: 3,
          },
        ],

        // ────────────────────────────────────────────────────────────────────
        // ENFRIAMIENTO (5 min) — estiramientos suaves
        // ────────────────────────────────────────────────────────────────────
        enfriamiento: [
          {
            exerciseId: 'FICHA1_ESTIR_ISQUIOS',
            name: 'Estiramiento de isquiotibiales',
            shortDescription: 'Sentada, extiende una pierna y alcanza el pie con ambas manos. Sostén 30 segundos por lado.',
            type: 'flexibilidad',
            zone: 'piernas',
            sets: 2,
            repetitions: '30 seg por lado',
            timeSeconds: 35,
            restSeconds: 10,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'FICHA1_ESTIR_GLUTEOS',
            name: 'Estiramiento de glúteos',
            shortDescription: 'Acostada, cruza un tobillo sobre la rodilla opuesta y jala suavemente hacia el pecho.',
            type: 'flexibilidad',
            zone: 'glúteos',
            sets: 2,
            repetitions: '30 seg por lado',
            timeSeconds: 35,
            restSeconds: 10,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'FICHA1_RESPIRACION',
            name: 'Respiración profunda',
            shortDescription: 'De pie o sentada, inhala profundo por la nariz 4 seg, sostén 2 seg, exhala por la boca 6 seg.',
            type: 'flexibilidad',
            zone: 'cuerpo_entero',
            sets: 1,
            repetitions: '5 respiraciones',
            timeSeconds: 40,
            restSeconds: 0,
            kneeFriendly: true,
            order: 3,
          },
        ],
      },

      publishedAt: new Date(),
    },
  ];
}

async function seedFicha1() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong';

  console.log('Conectando a MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Conexión establecida.');

  let instructor = await User.findOne({ email: ADMIN_EMAIL });
  if (!instructor) {
    console.log(`Creando instructor "${ADMIN_EMAIL}"...`);
    const hashed = await bcrypt.hash(ADMIN_PASS, 12);
    instructor = await User.create({
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      password: hashed,
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
  }

  const routines = buildRoutines(instructor._id);
  for (const data of routines) {
    const result = await Routine.findOneAndUpdate(
      { title: data.title },
      { $set: data },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ "${result.title}" — _id: ${result._id}`);
  }

  console.log('\n✅ Seed Ficha 1 completado.');
}

if (require.main === module) {
  seedFicha1()
    .then(() => { console.log('🏁 Listo.'); process.exit(0); })
    .catch((err) => { console.error('💥 Error:', err); process.exit(1); })
    .finally(() => mongoose.disconnect());
}

module.exports = { seedFicha1, buildRoutines };
