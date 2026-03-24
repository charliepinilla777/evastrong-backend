const mongoose = require('mongoose');
const RoutineTemplate = require('../models/RoutineTemplate');

// Plantillas de rutinas predefinidas
const routineTemplates = [
  // A. Mujer 25 años, sobrepeso, principiante, sin patologías, rodilla sana
  {
    templateId: "RUTINA_A1",
    name: "Inicio Fit 15 min",
    description: "Rutina ideal para principiantes con sobrepeso, enfocada en ejercicios de bajo impacto",
    targetProfile: {
      ageRange: "18-35",
      level: "principiante",
      constitutions: ["sobrepeso", "normopeso"],
      kneeSensitive: false,
      allowedPathologies: ["ninguna"]
    },
    baseDurationMinutes: 15,
    adjustableDurations: [10, 15, 20],
    mainCycles: 2,
    blocks: {
      calentamiento: [
        {
          exerciseId: "CAL_MARCHA_SUAVE",
          name: "Marcha suave en el sitio",
          shortDescription: "Caminar en el mismo lugar moviendo brazos.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "CAL_MOV_ART",
          name: "Movilidad de hombros y cadera",
          shortDescription: "Círculos de hombros y cadera a ritmo suave.",
          type: "movilidad",
          zone: "cuerpo_entero",
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 2
        }
      ],
      principal: [
        {
          exerciseId: "SENTADILLA_MEDIA",
          name: "Sentadilla media",
          shortDescription: "Flexiona rodillas sin bajar demasiado, espalda recta.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "PUENTE_GLUTEOS",
          name: "Puente de glúteos",
          shortDescription: "Tumbada boca arriba, eleva caderas apretando glúteos.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 2
        },
        {
          exerciseId: "PLANCHA_RODILLAS",
          name: "Plancha apoyando rodillas",
          shortDescription: "Apoya antebrazos y rodillas, mantiene abdomen firme.",
          type: "fuerza",
          zone: "core",
          baseTimeSeconds: 20,
          restSeconds: 20,
          kneeFriendly: true,
          order: 3
        },
        {
          exerciseId: "PASO_LATERAL",
          name: "Paso lateral dinámico",
          shortDescription: "Paso a un lado y al otro moviendo brazos.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 4
        },
        {
          exerciseId: "ELEV_TALONES",
          name: "Elevación de talones",
          shortDescription: "De pie, sube y baja talones, sujetándose si hace falta.",
          type: "fuerza",
          zone: "pantorrillas",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 5
        }
      ],
      enfriamiento: [
        {
          exerciseId: "ESTIR_ISQUIOS",
          name: "Estiramiento posterior de pierna",
          shortDescription: "Sentada, estirar suavemente parte posterior de la pierna.",
          type: "movilidad",
          zone: "piernas",
          baseTimeSeconds: 30,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "ESTIR_GLUTEOS",
          name: "Estiramiento de glúteos",
          shortDescription: "Tumbada, llevar rodilla al pecho suavemente.",
          type: "movilidad",
          zone: "piernas_gluteos",
          baseTimeSeconds: 30,
          restSeconds: 0,
          kneeFriendly: true,
          order: 2
        }
      ]
    },
    category: "funcional",
    intensity: "moderada",
    tags: ["principiante", "bajo_impacto", "pierna", "gluteos", "core"],
    isFeatured: true
  },

  // B. Mujer 32 años, obesidad, principiante, rodillas sensibles
  {
    templateId: "RUTINA_B1",
    name: "Rodillas Felices 10 min",
    description: "Rutina suave para personas con rodillas sensibles y obesidad",
    targetProfile: {
      ageRange: "18-35",
      level: "principiante",
      constitutions: ["sobrepeso", "obesidad"],
      kneeSensitive: true,
      allowedPathologies: ["ninguna", "metabolica"]
    },
    baseDurationMinutes: 10,
    adjustableDurations: [10, 15],
    mainCycles: 2,
    blocks: {
      calentamiento: [
        {
          exerciseId: "CAL_MARCHA_SUAVE_SILLA",
          name: "Marcha suave junto a una silla",
          shortDescription: "Caminar suave en el sitio, agarrada al respaldo si lo necesita.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 90,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ],
      principal: [
        {
          exerciseId: "SENTADILLA_SILLA",
          name: "Sentarse y levantarse de la silla",
          shortDescription: "Sentarse y ponerse de pie usando la fuerza de las piernas.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 30,
          restSeconds: 30,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "FLEX_PARED",
          name: "Flexiones en pared",
          shortDescription: "Apoya manos en la pared y flexiona codos.",
          type: "fuerza",
          zone: "pecho_brazos",
          baseTimeSeconds: 30,
          restSeconds: 30,
          kneeFriendly: true,
          order: 2
        },
        {
          exerciseId: "EXT_RODILLA_SENTADA",
          name: "Extensión de rodilla sentada",
          shortDescription: "Sentada, estira una pierna y aprieta el muslo.",
          type: "fuerza",
          zone: "cuadriceps",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 3
        },
        {
          exerciseId: "PASO_LATERAL_SUAVE",
          name: "Paso lateral suave",
          shortDescription: "Un paso a la derecha y a la izquierda sin saltar.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 30,
          restSeconds: 30,
          kneeFriendly: true,
          order: 4
        }
      ],
      enfriamiento: [
        {
          exerciseId: "ESTIR_CUADRICEPS_APOYO",
          name: "Estiramiento frontal de pierna",
          shortDescription: "De pie, sujetarse de una silla y llevar talón hacia glúteo suavemente.",
          type: "movilidad",
          zone: "piernas",
          baseTimeSeconds: 30,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ]
    },
    category: "bajo_impacto",
    intensity: "baja",
    tags: ["rodillas_sensibles", "obesidad", "silla", "bajo_impacto"],
    isFeatured: true
  },

  // C. Mujer 42 años, normopeso/sobrepeso, intermedio, rodilla sana
  {
    templateId: "RUTINA_C1",
    name: "Fuerza Intermedia 20 min",
    description: "Rutina intermedia con énfasis en fuerza y bajo impacto",
    targetProfile: {
      ageRange: "36-55",
      level: "intermedio",
      constitutions: ["normopeso", "sobrepeso"],
      kneeSensitive: false,
      allowedPathologies: ["ninguna"]
    },
    baseDurationMinutes: 20,
    adjustableDurations: [15, 20],
    mainCycles: 3,
    blocks: {
      calentamiento: [
        {
          exerciseId: "CAL_CARDIO_SUAVE",
          name: "Cardio suave 3 min",
          shortDescription: "Marcha en el sitio con movimientos de brazos.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 180,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "CAL_MOVILIDAD_ARTIC",
          name: "Movilidad articular",
          shortDescription: "Rotaciones suaves de articulaciones principales.",
          type: "movilidad",
          zone: "cuerpo_entero",
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 2
        }
      ],
      principal: [
        {
          exerciseId: "SENTADILLA_PROFUNDA",
          name: "Sentadilla profunda",
          shortDescription: "Sentadilla completa con espalda recta.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "FLEXIONES_PISO",
          name: "Flexiones en el piso",
          shortDescription: "Flexiones tradicionales con rodillas levantadas.",
          type: "fuerza",
          zone: "pecho_brazos",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 2
        },
        {
          exerciseId: "MONTAÑA_CLIMBER",
          name: "Mountain climber",
          shortDescription: "Llevar rodillas al pecho alternando rápidamente.",
          type: "cardio_intenso",
          zone: "cuerpo_entero",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 3
        },
        {
          exerciseId: "PLANCHA_COMPLETA",
          name: "Plancha completa",
          shortDescription: "Plancha tradicional apoyando pies.",
          type: "fuerza",
          zone: "core",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 4
        },
        {
          exerciseId: "ZANCADAS",
          name: "Zancadas alternas",
          shortDescription: "Paso largo hacia adelante alternando piernas.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 5
        }
      ],
      enfriamiento: [
        {
          exerciseId: "ESTIR_ISQUIOS_TUMBADO",
          name: "Estiramiento isquiotibiales",
          shortDescription: "Tumbada, llevar pierna estirada hacia el pecho.",
          type: "movilidad",
          zone: "piernas",
          baseTimeSeconds: 45,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "ESTIR_PECHO",
          name: "Estiramiento de pecho",
          shortDescription: "Estiramiento de pecho en marco de puerta.",
          type: "movilidad",
          zone: "pecho_brazos",
          baseTimeSeconds: 30,
          restSeconds: 0,
          kneeFriendly: true,
          order: 2
        }
      ]
    },
    category: "fuerza",
    intensity: "moderada",
    tags: ["intermedio", "fuerza", "cardio", "core"],
    isFeatured: true
  },

  // D. Mujer 58 años, principiante, rodillas sensibles, posible patología leve
  {
    templateId: "RUTINA_D1",
    name: "Senior Suave 12 min",
    description: "Rutina suave para mujeres mayores con rodillas sensibles",
    targetProfile: {
      ageRange: "55+",
      level: "principiante",
      constitutions: ["bajo_peso", "normopeso", "sobrepeso"],
      kneeSensitive: true,
      allowedPathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica"]
    },
    baseDurationMinutes: 12,
    adjustableDurations: [10, 15],
    mainCycles: 1,
    blocks: {
      calentamiento: [
        {
          exerciseId: "CAL_MARCHA_MUY_SUAVE",
          name: "Marcha muy suave con apoyo",
          shortDescription: "Caminar muy suave junto a una pared o silla.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 120,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "CAL_MOV_CUELLO_HOMBROS",
          name: "Movilidad de cuello y hombros",
          shortDescription: "Movimientos suaves de cuello y hombros.",
          type: "movilidad",
          zone: "tren_superior",
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 2
        }
      ],
      principal: [
        {
          exerciseId: "SENTARSE_LEVANTARSE_SILLA",
          name: "Sentarse y levantarse de silla",
          shortDescription: "Ejercicio de sentarse y levantarse lento y controlado.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 45,
          restSeconds: 30,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "ELEVACION_TALONES_SILLA",
          name: "Elevación de talones con apoyo",
          shortDescription: "Subir y bajar talones sujetándose de la silla.",
          type: "fuerza",
          zone: "pantorrillas",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 2
        },
        {
          exerciseId: "FLEXIONES_PARED",
          name: "Flexiones en pared",
          shortDescription: "Flexiones suaves apoyando manos en la pared.",
          type: "fuerza",
          zone: "pecho_brazos",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 3
        },
        {
          exerciseId: "CAMINATA_LATERAL_CORTA",
          name: "Caminata lateral corta",
          shortDescription: "Pasos laterales cortos y controlados.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 4
        }
      ],
      enfriamiento: [
        {
          exerciseId: "ESTIR_SUAVE_PIERNAS",
          name: "Estiramiento suave de piernas",
          shortDescription: "Estiramientos suaves sentada en silla.",
          type: "movilidad",
          zone: "piernas",
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "RESPIRACION_RELAX",
          name: "Respiración relajante",
          shortDescription: "Ejercicios de respiración profunda y relajación.",
          type: "movilidad",
          zone: "cuerpo_entero",
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 2
        }
      ]
    },
    category: "bajo_impacto",
    intensity: "muy_baja",
    tags: ["senior", "rodillas_sensibles", "silla", "bajo_impacto", "patologias"],
    isFeatured: true
  }
];

// Función para cargar las plantillas
async function loadRoutineTemplates() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong');
    
    console.log('Limpiando plantillas existentes...');
    await RoutineTemplate.deleteMany({});
    
    console.log('Insertando nuevas plantillas...');
    await RoutineTemplate.insertMany(routineTemplates);
    
    console.log(`✅ Se cargaron ${routineTemplates.length} plantillas de rutinas exitosamente`);
    
    // Mostrar resumen
    const templates = await RoutineTemplate.find({});
    console.log('\n📋 Resumen de plantillas cargadas:');
    templates.forEach(template => {
      console.log(`- ${template.templateId}: ${template.name} (${template.baseDurationMinutes}min)`);
    });
    
  } catch (error) {
    console.error('❌ Error al cargar plantillas:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Exportar para uso en otros scripts
module.exports = { loadRoutineTemplates, routineTemplates };

// Ejecutar si se corre directamente
if (require.main === module) {
  loadRoutineTemplates();
}
