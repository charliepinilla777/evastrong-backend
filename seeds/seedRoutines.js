/**
 * seedRoutines.js
 * Seeds the 5 main EvaStrong goal-based routines into the Routine collection.
 *
 * Usage:
 *   node seeds/seedRoutines.js
 *
 * Requires MONGODB_URI in .env (falls back to localhost/evastrong).
 */

'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Routine = require('../models/Routine');

// ---------------------------------------------------------------------------
// Admin / instructor seed user
// ---------------------------------------------------------------------------

const ADMIN_EMAIL = 'eva@evastrong.app';
const ADMIN_NAME  = 'Eva Strong';
const ADMIN_PASS  = 'EvaStrong2025!'; // only used if user is created fresh

// ---------------------------------------------------------------------------
// Routine definitions
// ---------------------------------------------------------------------------

/**
 * Returns the full routines array, injecting the instructor ObjectId.
 * @param {mongoose.Types.ObjectId} instructorId
 * @returns {Array}
 */
function buildRoutines(instructorId) {
  return [
    // -------------------------------------------------------------------------
    // 1. Levanta Cola  — free — beginner — 30 min
    // -------------------------------------------------------------------------
    {
      title: 'Levanta Cola',
      description:
        'Rutina enfocada en glúteos para conseguir unas nalgas firmes y redondeadas. ' +
        'Combina ejercicios de fuerza y activación muscular progresiva sin necesidad de material.',
      category: 'functional',
      difficulty: 'beginner',
      duration: 30,
      instructor: instructorId,
      instructorName: ADMIN_NAME,
      objectives: [
        'Desarrollar y tonificar los músculos glúteos',
        'Mejorar la postura y la estabilidad de la cadera',
        'Ganar fuerza en el tren inferior',
        'Aumentar la confianza corporal',
      ],
      targetMuscles: ['glúteos', 'isquiotibiales', 'core', 'cuádriceps'],
      equipment: [],
      tags: ['Levanta Cola', 'gluteos', 'tren_inferior', 'principiante', 'sin_material', 'free'],
      accessLevel: 'free',
      isActive: true,
      isFeatured: true,
      mainCycles: 3,
      targetProfile: {
        ageRange: '18-35',
        level: 'principiante',
        constitutions: ['normopeso', 'sobrepeso'],
        kneeSensitive: false,
        allowedPathologies: ['ninguna'],
      },
      blocks: {
        calentamiento: [
          {
            exerciseId: 'CAL_MARCHA_SUAVE',
            name: 'Marcha suave en el sitio',
            shortDescription: 'Caminar en el mismo lugar elevando rodillas y moviendo brazos.',
            type: 'cardio_suave',
            zone: 'cuerpo_entero',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'CAL_CIRCULOS_CADERA',
            name: 'Círculos de cadera',
            shortDescription: 'De pie, manos en caderas, trazar círculos amplios con la pelvis.',
            type: 'movilidad',
            zone: 'caderas_gluteos',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'CAL_ACTIVACION_GLUTEO',
            name: 'Activación de glúteo tumbada',
            shortDescription: 'Tumbada boca abajo, contraer glúteos alternando pierna.',
            type: 'movilidad',
            zone: 'gluteos',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 3,
          },
        ],
        principal: [
          {
            exerciseId: 'PUENTE_GLUTEOS_BASICO',
            name: 'Puente de glúteos',
            shortDescription: 'Tumbada boca arriba, pies apoyados, elevar caderas apretando glúteos.',
            type: 'fuerza',
            zone: 'gluteos_isquios',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'SENTADILLA_SUMO',
            name: 'Sentadilla sumo',
            shortDescription: 'Pies separados en punta hacia afuera, bajar controlado.',
            type: 'fuerza',
            zone: 'piernas_gluteos',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'PATADA_GLUTEO_CUADRUPEDIA',
            name: 'Patada de glúteo en cuadrupedia',
            shortDescription: 'A cuatro patas, extender pierna hacia atrás manteniendo core activo.',
            type: 'fuerza',
            zone: 'gluteos',
            timeSeconds: 35,
            restSeconds: 15,
            kneeFriendly: true,
            order: 3,
          },
          {
            exerciseId: 'ABDUCCION_LATERAL_TUMBADA',
            name: 'Abducción lateral tumbada',
            shortDescription: 'De lado, elevar pierna superior con control. Cambiar lado.',
            type: 'fuerza',
            zone: 'gluteo_medio',
            timeSeconds: 35,
            restSeconds: 15,
            kneeFriendly: true,
            order: 4,
          },
          {
            exerciseId: 'PUENTE_GLUTEOS_UNIPODAL',
            name: 'Puente unipodal',
            shortDescription: 'Mismo que puente pero elevando una pierna extendida.',
            type: 'fuerza',
            zone: 'gluteos_core',
            timeSeconds: 30,
            restSeconds: 20,
            kneeFriendly: true,
            order: 5,
          },
          {
            exerciseId: 'SENTADILLA_PLIE',
            name: 'Sentadilla plie con pulsos',
            shortDescription: 'Mantener posición baja y hacer pequeños pulsos hacia arriba.',
            type: 'fuerza',
            zone: 'piernas_gluteos',
            timeSeconds: 30,
            restSeconds: 20,
            kneeFriendly: true,
            order: 6,
          },
        ],
        enfriamiento: [
          {
            exerciseId: 'ESTIR_PIGEON_SUELO',
            name: 'Estiramiento tipo paloma en el suelo',
            shortDescription: 'Tumbada, cruzar tobillo sobre rodilla opuesta y llevar hacia el pecho.',
            type: 'flexibilidad',
            zone: 'gluteos',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'ESTIR_ISQUIOS_SUELO',
            name: 'Estiramiento posterior de pierna',
            shortDescription: 'Tumbada, llevar pierna estirada hacia el pecho con ayuda de las manos.',
            type: 'flexibilidad',
            zone: 'isquiotibiales',
            timeSeconds: 40,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'RESPIRACION_CIERRE',
            name: 'Respiración de cierre',
            shortDescription: 'Tumbada, inhalar 4 tiempos, retener 2, exhalar 6. Relajar todo el cuerpo.',
            type: 'movilidad',
            zone: 'cuerpo_entero',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 3,
          },
        ],
      },
      publishedAt: new Date(),
    },

    // -------------------------------------------------------------------------
    // 2. Eliminar la Flacidez  — premium — intermediate — 25 min
    // -------------------------------------------------------------------------
    {
      title: 'Eliminar la Flacidez',
      description:
        'Rutina de tonificación corporal diseñada para firmar y definir la piel. ' +
        'Combina ejercicios de fuerza con activación muscular de alta frecuencia para conseguir un cuerpo tonificado y firme.',
      category: 'strength',
      difficulty: 'intermediate',
      duration: 25,
      instructor: instructorId,
      instructorName: ADMIN_NAME,
      objectives: [
        'Tonificar y firmar la piel',
        'Reducir la flacidez en brazos, abdomen y piernas',
        'Aumentar la masa muscular magra',
        'Mejorar la definición corporal general',
      ],
      targetMuscles: ['tríceps', 'bíceps', 'abdominales', 'cuádriceps', 'glúteos', 'pecho'],
      equipment: [],
      tags: ['Eliminar la Flacidez', 'tonificacion', 'fuerza', 'cuerpo_completo', 'intermedio', 'premium'],
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
            exerciseId: 'CAL_JUMPING_JACK_SUAVE',
            name: 'Jumping jack suave',
            shortDescription: 'Saltos laterales con brazos abiertos a ritmo moderado.',
            type: 'cardio_suave',
            zone: 'cuerpo_entero',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'CAL_ROTACION_TRONCO',
            name: 'Rotación de tronco',
            shortDescription: 'De pie, brazos extendidos, rotar tronco de lado a lado.',
            type: 'movilidad',
            zone: 'core',
            timeSeconds: 40,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'CAL_CIRCULOS_HOMBROS',
            name: 'Círculos de hombros',
            shortDescription: 'Círculos amplios hacia adelante y atrás con los hombros.',
            type: 'movilidad',
            zone: 'tren_superior',
            timeSeconds: 35,
            restSeconds: 0,
            kneeFriendly: true,
            order: 3,
          },
        ],
        principal: [
          {
            exerciseId: 'FLEXIONES_MODIFICADAS',
            name: 'Flexiones modificadas',
            shortDescription: 'Flexiones con rodillas apoyadas, cuerpo recto desde rodillas.',
            type: 'fuerza',
            zone: 'pecho_brazos',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'SENTADILLA_BRAZOS_ARRIBA',
            name: 'Sentadilla con brazos al frente',
            shortDescription: 'Sentadilla completa extendiendo brazos al frente como contrapeso.',
            type: 'fuerza',
            zone: 'piernas_gluteos',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'TRICEPS_DIPS_SUELO',
            name: 'Dips de tríceps en el suelo',
            shortDescription: 'Sentada, manos en el suelo detrás, flexionar y extender codos.',
            type: 'fuerza',
            zone: 'triceps',
            timeSeconds: 35,
            restSeconds: 20,
            kneeFriendly: true,
            order: 3,
          },
          {
            exerciseId: 'PLANCHA_LATERAL',
            name: 'Plancha lateral',
            shortDescription: 'Apoyar antebrazo lateral, cuerpo recto como tabla. Cambiar lado.',
            type: 'fuerza',
            zone: 'core_oblicuos',
            timeSeconds: 30,
            restSeconds: 15,
            kneeFriendly: true,
            order: 4,
          },
          {
            exerciseId: 'ZANCADAS_ALTERNAS',
            name: 'Zancadas alternas',
            shortDescription: 'Paso largo hacia adelante alternando piernas, torso erguido.',
            type: 'fuerza',
            zone: 'piernas_gluteos',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 5,
          },
        ],
        enfriamiento: [
          {
            exerciseId: 'ESTIR_TRICEPS',
            name: 'Estiramiento de tríceps',
            shortDescription: 'Llevar mano detrás de cabeza, empujar codo suavemente.',
            type: 'flexibilidad',
            zone: 'triceps',
            timeSeconds: 30,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'ESTIR_CUADRICEPS_PIE',
            name: 'Estiramiento de cuádriceps de pie',
            shortDescription: 'De pie, llevar talón hacia glúteo sujetando el tobillo.',
            type: 'flexibilidad',
            zone: 'cuadriceps',
            timeSeconds: 35,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'GATO_VACA',
            name: 'Gato-vaca en cuadrupedia',
            shortDescription: 'Alternar arquear y redondear la espalda con la respiración.',
            type: 'movilidad',
            zone: 'columna_core',
            timeSeconds: 40,
            restSeconds: 0,
            kneeFriendly: true,
            order: 3,
          },
        ],
      },
      publishedAt: new Date(),
    },

    // -------------------------------------------------------------------------
    // 3. Tonificación de Piernas  — premium — beginner — 35 min
    // -------------------------------------------------------------------------
    {
      title: 'Tonificación de Piernas',
      description:
        'Rutina específica para fortalecer y definir cuádriceps, isquiotibiales y pantorrillas. ' +
        'Ejercicios progresivos adaptados a principiantes que buscan piernas más fuertes y esbeltas.',
      category: 'strength',
      difficulty: 'beginner',
      duration: 35,
      instructor: instructorId,
      instructorName: ADMIN_NAME,
      objectives: [
        'Tonificar cuádriceps, isquiotibiales y pantorrillas',
        'Definir la silueta del tren inferior',
        'Mejorar la estabilidad y el equilibrio',
        'Fortalecer rodillas y tobillos',
      ],
      targetMuscles: ['cuádriceps', 'isquiotibiales', 'pantorrillas', 'glúteos', 'aductores'],
      equipment: [],
      tags: ['Tonificación de Piernas', 'piernas', 'tren_inferior', 'principiante', 'tonificacion', 'premium'],
      accessLevel: 'premium',
      isActive: true,
      isFeatured: true,
      mainCycles: 3,
      targetProfile: {
        ageRange: '18-35',
        level: 'principiante',
        constitutions: ['normopeso', 'sobrepeso'],
        kneeSensitive: false,
        allowedPathologies: ['ninguna'],
      },
      blocks: {
        calentamiento: [
          {
            exerciseId: 'CAL_MARCHA_RODILLAS_ALTAS',
            name: 'Marcha con rodillas altas',
            shortDescription: 'Elevar rodillas a la altura de la cadera caminando en el sitio.',
            type: 'cardio_suave',
            zone: 'piernas',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'CAL_MOV_TOBILLO',
            name: 'Movilidad de tobillos',
            shortDescription: 'Sentada, trazar círculos con el pie en ambas direcciones.',
            type: 'movilidad',
            zone: 'tobillos',
            timeSeconds: 40,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'CAL_ESTIR_DINAMICO_ISQUIO',
            name: 'Estiramiento dinámico de isquios',
            shortDescription: 'De pie, llevar pierna extendida hacia adelante alternando.',
            type: 'movilidad',
            zone: 'isquiotibiales',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 3,
          },
        ],
        principal: [
          {
            exerciseId: 'SENTADILLA_BASICA',
            name: 'Sentadilla básica',
            shortDescription: 'Pies a ancho de hombros, bajar hasta 90° manteniendo espalda recta.',
            type: 'fuerza',
            zone: 'piernas_gluteos',
            timeSeconds: 45,
            restSeconds: 20,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'ELEVACION_TALONES_PIE',
            name: 'Elevación de talones de pie',
            shortDescription: 'Subir y bajar en puntillas de forma controlada.',
            type: 'fuerza',
            zone: 'pantorrillas',
            timeSeconds: 40,
            restSeconds: 15,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'SENTADILLA_LATERAL',
            name: 'Sentadilla lateral',
            shortDescription: 'Paso lateral con flexión de la pierna que recibe el peso.',
            type: 'fuerza',
            zone: 'aductores_cuadriceps',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 3,
          },
          {
            exerciseId: 'ISQUIO_TUMBADA',
            name: 'Curl de isquiotibiales tumbada',
            shortDescription: 'Tumbada boca abajo, llevar talón hacia glúteo alternando.',
            type: 'fuerza',
            zone: 'isquiotibiales',
            timeSeconds: 35,
            restSeconds: 15,
            kneeFriendly: true,
            order: 4,
          },
          {
            exerciseId: 'STEP_UP_IMAGINARIO',
            name: 'Step imaginario',
            shortDescription: 'Simular subir un escalón alternando piernas en su sitio.',
            type: 'cardio_suave',
            zone: 'piernas_gluteos',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 5,
          },
          {
            exerciseId: 'SENTADILLA_ISOMETRICA',
            name: 'Sentadilla isométrica (wall sit)',
            shortDescription: 'Apoyada en la pared, mantener 90° de flexión de rodilla.',
            type: 'fuerza',
            zone: 'cuadriceps',
            timeSeconds: 30,
            restSeconds: 20,
            kneeFriendly: true,
            order: 6,
          },
        ],
        enfriamiento: [
          {
            exerciseId: 'ESTIR_ISQUIOS_SUELO_LARGO',
            name: 'Estiramiento de isquiotibiales en el suelo',
            shortDescription: 'Tumbada, pierna estirada arriba, tirar suavemente con las manos.',
            type: 'flexibilidad',
            zone: 'isquiotibiales',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'ESTIR_PANTORRILLA_PARED',
            name: 'Estiramiento de pantorrilla en pared',
            shortDescription: 'Apoyar punta de pie en pared, talón en el suelo, empujar suave.',
            type: 'flexibilidad',
            zone: 'pantorrillas',
            timeSeconds: 35,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'POSTURA_NINO',
            name: 'Postura del niño',
            shortDescription: 'Arrodillada, extender brazos hacia adelante sobre el suelo.',
            type: 'flexibilidad',
            zone: 'columna_caderas',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 3,
          },
        ],
      },
      publishedAt: new Date(),
    },

    // -------------------------------------------------------------------------
    // 4. Pérdida de Peso  — premium — intermediate — 45 min
    // -------------------------------------------------------------------------
    {
      title: 'Pérdida de Peso',
      description:
        'Rutina de alta intensidad diseñada para maximizar el gasto calórico y acelerar el metabolismo. ' +
        'Combina cardio funcional y ejercicios de fuerza en circuito para quemar grasa de forma eficiente.',
      category: 'hiit',
      difficulty: 'intermediate',
      duration: 45,
      instructor: instructorId,
      instructorName: ADMIN_NAME,
      objectives: [
        'Quemar calorías de forma eficiente',
        'Activar el metabolismo durante y después del entrenamiento',
        'Reducir el porcentaje de grasa corporal',
        'Mejorar la resistencia cardiovascular',
      ],
      targetMuscles: ['cuerpo_entero', 'core', 'glúteos', 'piernas', 'hombros'],
      equipment: [],
      tags: ['Pérdida de Peso', 'adelgazar', 'hiit', 'cardio', 'quemar_calorias', 'intermedio', 'premium'],
      accessLevel: 'premium',
      isActive: true,
      isFeatured: true,
      mainCycles: 4,
      targetProfile: {
        ageRange: '18-35',
        level: 'intermedio',
        constitutions: ['sobrepeso', 'normopeso', 'obesidad'],
        kneeSensitive: false,
        allowedPathologies: ['ninguna'],
      },
      blocks: {
        calentamiento: [
          {
            exerciseId: 'CAL_TROTE_SITIO',
            name: 'Trote en el sitio',
            shortDescription: 'Trotar suave en el mismo lugar durante 1 minuto para activar el sistema cardiovascular.',
            type: 'cardio_suave',
            zone: 'cuerpo_entero',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'CAL_ARM_CIRCLES',
            name: 'Círculos de brazos',
            shortDescription: 'Brazos extendidos, trazar círculos grandes hacia adelante y atrás.',
            type: 'movilidad',
            zone: 'tren_superior',
            timeSeconds: 40,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'CAL_SQUATS_SUAVE',
            name: 'Sentadillas suaves de calentamiento',
            shortDescription: 'Sentadillas lentas y controladas para preparar articulaciones.',
            type: 'movilidad',
            zone: 'piernas_gluteos',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 3,
          },
        ],
        principal: [
          {
            exerciseId: 'BURPEE_MODIFICADO',
            name: 'Burpee modificado',
            shortDescription: 'Desde de pie, agacharse, dar paso atrás, volver y saltar.',
            type: 'cardio_intenso',
            zone: 'cuerpo_entero',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'MOUNTAIN_CLIMBER',
            name: 'Mountain climber',
            shortDescription: 'En plancha alta, llevar rodillas alternadas al pecho con rapidez.',
            type: 'cardio_intenso',
            zone: 'core_cuerpo_entero',
            timeSeconds: 35,
            restSeconds: 20,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'SALTOS_SENTADILLA',
            name: 'Salto desde sentadilla',
            shortDescription: 'Bajar en sentadilla y explosionar hacia arriba saltando.',
            type: 'cardio_intenso',
            zone: 'piernas_gluteos',
            timeSeconds: 35,
            restSeconds: 20,
            kneeFriendly: false,
            order: 3,
          },
          {
            exerciseId: 'PLANCHA_CON_TOQUE_HOMBRO',
            name: 'Plancha con toque de hombro',
            shortDescription: 'En plancha alta, tocar el hombro opuesto con cada mano alternando.',
            type: 'fuerza',
            zone: 'core_hombros',
            timeSeconds: 35,
            restSeconds: 15,
            kneeFriendly: true,
            order: 4,
          },
          {
            exerciseId: 'JUMPING_JACKS',
            name: 'Jumping jacks',
            shortDescription: 'Saltos laterales clásicos abriendo brazos y piernas.',
            type: 'cardio_intenso',
            zone: 'cuerpo_entero',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 5,
          },
          {
            exerciseId: 'ZANCADAS_CON_GIRO',
            name: 'Zancada con giro de tronco',
            shortDescription: 'Zancada hacia adelante añadiendo rotación del tronco hacia la pierna delantera.',
            type: 'fuerza',
            zone: 'piernas_core',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 6,
          },
        ],
        enfriamiento: [
          {
            exerciseId: 'TROTE_SUAVE_CIERRE',
            name: 'Trote suave de cierre',
            shortDescription: 'Reducir intensidad trotando muy suave o caminando en el sitio.',
            type: 'cardio_suave',
            zone: 'cuerpo_entero',
            timeSeconds: 60,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'ESTIR_TOTAL_SUELO',
            name: 'Estiramiento total en el suelo',
            shortDescription: 'Tumbada boca arriba, extender brazos y piernas. Respirar profundo.',
            type: 'flexibilidad',
            zone: 'cuerpo_entero',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'ESTIR_CADERA_FLEXOR',
            name: 'Estiramiento de flexores de cadera',
            shortDescription: 'Una rodilla en el suelo, empujar caderas hacia adelante suavemente.',
            type: 'flexibilidad',
            zone: 'cadera_cuadriceps',
            timeSeconds: 40,
            restSeconds: 0,
            kneeFriendly: true,
            order: 3,
          },
        ],
      },
      publishedAt: new Date(),
    },

    // -------------------------------------------------------------------------
    // 5. Cintura Marcada  — premium — advanced — 40 min
    // -------------------------------------------------------------------------
    {
      title: 'Cintura Marcada',
      description:
        'Rutina avanzada focalizada en el trabajo de core profundo y oblicuos para conseguir ' +
        'un abdomen plano y una cintura definida. Alta intensidad con ejercicios que demandan control y estabilidad.',
      category: 'functional',
      difficulty: 'advanced',
      duration: 40,
      instructor: instructorId,
      instructorName: ADMIN_NAME,
      objectives: [
        'Definir y marcar el abdomen',
        'Reducir la circunferencia de la cintura',
        'Fortalecer el core profundo y los oblicuos',
        'Mejorar la postura y la estabilidad espinal',
      ],
      targetMuscles: ['abdominales', 'oblicuos', 'transverso_abdominal', 'core_profundo', 'lumbares'],
      equipment: [],
      tags: ['Cintura Marcada', 'abdomen', 'core', 'cintura', 'oblicuos', 'avanzado', 'premium'],
      accessLevel: 'premium',
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
            exerciseId: 'CAL_ACTIVACION_CORE',
            name: 'Activación de core en el suelo',
            shortDescription: 'Tumbada boca arriba, presionar lumbar contra el suelo y aguantar.',
            type: 'movilidad',
            zone: 'core',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'CAL_ROTACION_CADERA_PIE',
            name: 'Rotaciones de cadera de pie',
            shortDescription: 'Manos en caderas, trazar círculos amplios con la pelvis.',
            type: 'movilidad',
            zone: 'caderas_core',
            timeSeconds: 40,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'CAL_DEAD_BUG_SUAVE',
            name: 'Dead bug suave',
            shortDescription: 'Tumbada, piernas en 90°, extender brazo y pierna opuestos controlado.',
            type: 'movilidad',
            zone: 'core_estabilizacion',
            timeSeconds: 45,
            restSeconds: 0,
            kneeFriendly: true,
            order: 3,
          },
        ],
        principal: [
          {
            exerciseId: 'PLANCHA_COMPLETA_LARGA',
            name: 'Plancha completa',
            shortDescription: 'Plancha sobre manos, cuerpo recto, respiración controlada.',
            type: 'fuerza',
            zone: 'core_completo',
            timeSeconds: 45,
            restSeconds: 15,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'BICICLETA_ABDOMINAL',
            name: 'Bicicleta abdominal',
            shortDescription: 'Tumbada, llevar codo hacia rodilla opuesta alternando con rapidez.',
            type: 'cardio_intenso',
            zone: 'oblicuos_abdominales',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'RUSSIAN_TWIST',
            name: 'Russian twist',
            shortDescription: 'Sentada, espalda inclinada, rotar tronco llevando manos de lado a lado.',
            type: 'fuerza',
            zone: 'oblicuos',
            timeSeconds: 40,
            restSeconds: 20,
            kneeFriendly: true,
            order: 3,
          },
          {
            exerciseId: 'PLANCHA_CON_ROTACION',
            name: 'Plancha con rotación de cadera',
            shortDescription: 'Desde plancha de antebrazos, rotar caderas de lado a lado controlado.',
            type: 'fuerza',
            zone: 'oblicuos_core',
            timeSeconds: 35,
            restSeconds: 15,
            kneeFriendly: true,
            order: 4,
          },
          {
            exerciseId: 'FLUTTER_KICKS',
            name: 'Flutter kicks',
            shortDescription: 'Tumbada, piernas a 30° del suelo, alternar movimiento arriba-abajo.',
            type: 'fuerza',
            zone: 'abdominales_inferiores',
            timeSeconds: 35,
            restSeconds: 20,
            kneeFriendly: true,
            order: 5,
          },
          {
            exerciseId: 'SIDE_PLANK_DIP',
            name: 'Plancha lateral con caída de cadera',
            shortDescription: 'En plancha lateral, bajar cadera casi al suelo y subir. Cambiar lado.',
            type: 'fuerza',
            zone: 'oblicuos',
            timeSeconds: 35,
            restSeconds: 20,
            kneeFriendly: true,
            order: 6,
          },
        ],
        enfriamiento: [
          {
            exerciseId: 'ESTIR_COBRA',
            name: 'Estiramiento cobra',
            shortDescription: 'Tumbada boca abajo, elevar tronco con los brazos, abrir pecho.',
            type: 'flexibilidad',
            zone: 'abdominales_columna',
            timeSeconds: 40,
            restSeconds: 0,
            kneeFriendly: true,
            order: 1,
          },
          {
            exerciseId: 'ESTIR_LATERAL_PIE',
            name: 'Estiramiento lateral de tronco',
            shortDescription: 'De pie, brazo arriba, inclinarse lateralmente hacia cada lado.',
            type: 'flexibilidad',
            zone: 'oblicuos_costado',
            timeSeconds: 40,
            restSeconds: 0,
            kneeFriendly: true,
            order: 2,
          },
          {
            exerciseId: 'SAVASANA_CORTO',
            name: 'Relajación final',
            shortDescription: 'Tumbada, ojos cerrados, respiración profunda y relajación completa.',
            type: 'movilidad',
            zone: 'cuerpo_entero',
            timeSeconds: 60,
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

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function seedRoutines() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong';

  console.log('Conectando a MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Conexión establecida.');

  // ------------------------------------------------------------------
  // 1. Ensure admin/instructor user exists
  // ------------------------------------------------------------------
  let instructor = await User.findOne({ email: ADMIN_EMAIL });

  if (!instructor) {
    console.log(`Usuario instructor no encontrado. Creando "${ADMIN_EMAIL}"...`);
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
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        trialUsed: true,
      },
    });
    console.log(`Instructor creado con _id: ${instructor._id}`);
  } else {
    console.log(`Instructor existente encontrado: ${instructor._id}`);
  }

  // ------------------------------------------------------------------
  // 2. Upsert each routine by title
  // ------------------------------------------------------------------
  const routines = buildRoutines(instructor._id);

  console.log(`\nInsertando/actualizando ${routines.length} rutinas...`);

  for (const routineData of routines) {
    const result = await Routine.findOneAndUpdate(
      { title: routineData.title },
      { $set: routineData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ "${result.title}" — _id: ${result._id} — accessLevel: ${result.accessLevel}`);
  }

  console.log('\n✅ Seed de rutinas completado exitosamente.');
  console.log(`📊 Total de rutinas sembradas: ${routines.length}`);
  console.log('   1. 🍑 Levanta Cola           (free  / beginner     / 30 min)');
  console.log('   2. 💪 Eliminar la Flacidez   (premium / intermediate / 25 min)');
  console.log('   3. 🦵 Tonificación de Piernas (premium / beginner     / 35 min)');
  console.log('   4. 🔥 Pérdida de Peso         (premium / intermediate / 45 min)');
  console.log('   5. ⚡ Cintura Marcada          (premium / advanced     / 40 min)');
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

if (require.main === module) {
  seedRoutines()
    .then(() => {
      console.log('\n🏁 Proceso completado.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('💥 Error durante el seed de rutinas:', err);
      process.exit(1);
    })
    .finally(() => {
      mongoose.disconnect();
    });
}

module.exports = { seedRoutines, buildRoutines };
