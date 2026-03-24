const mongoose = require('mongoose');
const RoutineTemplate = require('../models/RoutineTemplate');

// Grupo 9: 55+, principiante (rodilla sana o sensible)
const grupo9Templates = [
  {
    templateId: "RUTINA_I1",
    name: "Activo 55+ 10 min",
    description: "Rutina suave para mantenerse activos después de 55 años",
    targetProfile: {
      ageRange: "55+",
      level: "principiante",
      constitutions: ["bajo_peso", "normopeso", "sobrepeso"],
      kneeSensitive: false,
      allowedPathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica"]
    },
    baseDurationMinutes: 10,
    adjustableDurations: [10, 15],
    mainCycles: 2,
    blocks: {
      calentamiento: [
        {
          exerciseId: "CAL_MARCHA_MUY_SUAVE",
          name: "Marcha muy suave",
          shortDescription: "Caminar muy suave con apoyo si es necesario.",
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
          exerciseId: "SENTARSE_LEVANTARSE_SILLA",
          name: "Sentarse y levantarse",
          shortDescription: "Sentarse y ponerse de pie lentamente.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "ELEVACION_TALONES_SILLA",
          name: "Elevación de talones",
          shortDescription: "De pie, sube y baja talones con apoyo.",
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
          shortDescription: "Apoya manos en la pared y flexiona codos.",
          type: "fuerza",
          zone: "pecho_brazos",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 3
        }
      ],
      enfriamiento: [
        {
          exerciseId: "ESTIR_SUAVE_PIERNAS",
          name: "Estiramiento suave",
          shortDescription: "Estiramientos suaves sentado.",
          type: "movilidad",
          zone: "piernas",
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ]
    },
    category: "funcional",
    intensity: "muy_baja",
    tags: ["55+", "principiante", "movilidad"]
  },
  {
    templateId: "RUTINA_I2",
    name: "Equilibrio 55+ 12 min",
    description: "Rutina enfocada en equilibrio para mayores de 55 años",
    targetProfile: {
      ageRange: "55+",
      level: "principiante",
      constitutions: ["bajo_peso", "normopeso", "sobrepeso"],
      kneeSensitive: false,
      allowedPathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica"]
    },
    baseDurationMinutes: 12,
    adjustableDurations: [10, 15],
    mainCycles: 2,
    blocks: {
      calentamiento: [
        {
          exerciseId: "CAL_MARCHA_MUY_SUAVE",
          name: "Marcha muy suave",
          shortDescription: "Caminar muy suave con apoyo si es necesario.",
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
          exerciseId: "MARCHA_EQUILIBRIO",
          name: "Marcha con equilibrio",
          shortDescription: "Marcha lenta manteniendo el equilibrio.",
          type: "equilibrio",
          zone: "cuerpo_entero",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "APOYO_UNIPODAL_SILLA",
          name: "Apoyo una pierna con silla",
          shortDescription: "Mantener equilibrio sobre una pierna con apoyo.",
          type: "equilibrio",
          zone: "cuerpo_entero",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 2
        },
        {
          exerciseId: "PASO_LATERAL_SUAVE",
          name: "Paso lateral suave",
          shortDescription: "Pasos laterales cortos y controlados.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 3
        },
        {
          exerciseId: "ELEVACION_TALONES_SILLA",
          name: "Elevación de talones",
          shortDescription: "De pie, sube y baja talones con apoyo.",
          type: "fuerza",
          zone: "pantorrillas",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 4
        }
      ],
      enfriamiento: [
        {
          exerciseId: "RESPIRACION_RELAX",
          name: "Respiración relajante",
          shortDescription: "Ejercicios de respiración profunda.",
          type: "movilidad",
          zone: "cuerpo_entero",
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ]
    },
    category: "equilibrio",
    intensity: "muy_baja",
    tags: ["55+", "equilibrio", "principiante"]
  }
];

// Grupo 10: 55+, intermedio (selección cuidadosa)
const grupo10Templates = [
  {
    templateId: "RUTINA_J1",
    name: "Fuerza Controlada 15 min",
    description: "Rutina de fuerza controlada para mayores de 55 años",
    targetProfile: {
      ageRange: "55+",
      level: "intermedio",
      constitutions: ["normopeso", "sobrepeso"],
      kneeSensitive: false,
      allowedPathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica"]
    },
    baseDurationMinutes: 15,
    adjustableDurations: [12, 15, 20],
    mainCycles: 2,
    blocks: {
      calentamiento: [
        {
          exerciseId: "CAL_MARCHA_SUAVE",
          name: "Marcha suave",
          shortDescription: "Caminar en el mismo lugar moviendo brazos.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 120,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ],
      principal: [
        {
          exerciseId: "SENTADILLA_SILLA",
          name: "Sentadilla a silla",
          shortDescription: "Sentarse y levantarse de silla con control.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "PESO_MUERTO_RUMANO_LIGERO",
          name: "Peso muerto rumano ligero",
          shortDescription: "Cadera atrás, poco flexión de rodilla, rango corto.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 2
        },
        {
          exerciseId: "FLEXIONES_PARED",
          name: "Flexiones en pared",
          shortDescription: "Apoya manos en la pared y flexiona codos.",
          type: "fuerza",
          zone: "pecho_brazos",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 3
        },
        {
          exerciseId: "REMO_BANDA",
          name: "Remo con banda",
          shortDescription: "Remo sentado con banda de resistencia.",
          type: "fuerza",
          zone: "espalda",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 4
        },
        {
          exerciseId: "PLANCHA_MESA",
          name: "Plancha en mesa",
          shortDescription: "Apoya manos y rodillas, mantiene espalda recta.",
          type: "fuerza",
          zone: "core",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 5
        }
      ],
      enfriamiento: [
        {
          exerciseId: "ESTIR_SUAVE_PIERNAS",
          name: "Estiramiento suave",
          shortDescription: "Estiramientos suaves sentado.",
          type: "movilidad",
          zone: "piernas",
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ]
    },
    category: "fuerza",
    intensity: "baja",
    tags: ["55+", "intermedio", "fuerza_controlada"]
  },
  {
    templateId: "RUTINA_J2",
    name: "Cardio Moderado 55+ 15 min",
    description: "Cardio moderado y seguro para mayores de 55 años",
    targetProfile: {
      ageRange: "55+",
      level: "intermedio",
      constitutions: ["normopeso", "sobrepeso"],
      kneeSensitive: false,
      allowedPathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica"]
    },
    baseDurationMinutes: 15,
    adjustableDurations: [12, 15, 20],
    mainCycles: 2,
    blocks: {
      calentamiento: [
        {
          exerciseId: "CAL_MARCHA_SUAVE",
          name: "Marcha suave",
          shortDescription: "Caminar en el mismo lugar moviendo brazos.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 120,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ],
      principal: [
        {
          exerciseId: "MARCHA_RAPIDA",
          name: "Marcha rápida",
          shortDescription: "Marcha en el sitio con ritmo elevado.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "PASO_LATERAL",
          name: "Paso lateral",
          shortDescription: "Paso lateral alternando con brazos.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 2
        },
        {
          exerciseId: "STEP_ESCALON_BAJO",
          name: "Pequeño step en escalón bajo",
          shortDescription: "Subir y bajar escalón bajo con control.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 3
        },
        {
          exerciseId: "BRAZOS_ACTIVOS",
          name: "Brazos activos",
          shortDescription: "Movimientos de brazos con marcha suave.",
          type: "cardio_suave",
          zone: "tren_superior",
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 4
        }
      ],
      enfriamiento: [
        {
          exerciseId: "RESPIRACION_RELAX",
          name: "Respiración relajante",
          shortDescription: "Ejercicios de respiración profunda.",
          type: "movilidad",
          zone: "cuerpo_entero",
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ]
    },
    category: "cardio",
    intensity: "baja",
    tags: ["55+", "cardio", "seguro"]
  }
];

// Función para cargar las plantillas adicionales
async function loadAdditionalTemplates5() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong');
    
    console.log('Insertando plantillas adicionales (lote 5)...');
    const allTemplates = [...grupo9Templates, ...grupo10Templates];
    
    for (const template of allTemplates) {
      try {
        await RoutineTemplate.findOneAndUpdate(
          { templateId: template.templateId },
          template,
          { upsert: true, new: true }
        );
        console.log(`✅ Plantilla ${template.templateId} cargada`);
      } catch (error) {
        console.error(`❌ Error cargando ${template.templateId}:`, error.message);
      }
    }
    
    console.log(`✅ Se procesaron ${allTemplates.length} plantillas adicionales (lote 5)`);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = { loadAdditionalTemplates5 };

if (require.main === module) {
  require('dotenv').config();
  loadAdditionalTemplates5();
}
