const mongoose = require('mongoose');
const RoutineTemplate = require('../models/RoutineTemplate');

// Grupo 3: 18–35, intermedio, rodilla sana
const grupo3Templates = [
  {
    templateId: "RUTINA_C1",
    name: "Full Body Intermedio 20 min",
    description: "Rutina completa para nivel intermedio",
    targetProfile: {
      ageRange: "18-35",
      level: "intermedio",
      constitutions: ["normopeso", "sobrepeso"],
      kneeSensitive: false,
      allowedPathologies: ["ninguna"]
    },
    baseDurationMinutes: 20,
    adjustableDurations: [15, 20, 25],
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
          name: "Sentadilla completa cómoda",
          shortDescription: "Sentadilla profunda con técnica adecuada.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "ZANCADA_ALTERNA",
          name: "Zancada alterna",
          shortDescription: "Paso largo hacia adelante alternando piernas.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 2
        },
        {
          exerciseId: "FLEXIONES_INCLINADAS",
          name: "Flexiones inclinadas o normales",
          shortDescription: "Flexiones con inclinación o en el piso.",
          type: "fuerza",
          zone: "pecho_brazos",
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 3
        },
        {
          exerciseId: "REMO_BANDA",
          name: "Remo con banda",
          shortDescription: "Remo sentado con banda de resistencia.",
          type: "fuerza",
          zone: "espalda",
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 4
        },
        {
          exerciseId: "PLANCHA_COMPLETA",
          name: "Plancha completa",
          shortDescription: "Plancha tradicional apoyando pies.",
          type: "fuerza",
          zone: "core",
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 5
        },
        {
          exerciseId: "JUMPING_JACK_BAJO_IMPACTO",
          name: "Jumping jack bajo impacto",
          shortDescription: "Jumping jacks con pequeño salto o sin salto.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 6
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
    tags: ["intermedio", "full_body", "fuerza"]
  },
  {
    templateId: "RUTINA_C2",
    name: "Glúteos Fuego 15 min",
    description: "Rutina intensiva para glúteos",
    targetProfile: {
      ageRange: "18-35",
      level: "intermedio",
      constitutions: ["normopeso", "sobrepeso"],
      kneeSensitive: false,
      allowedPathologies: ["ninguna"]
    },
    baseDurationMinutes: 15,
    adjustableDurations: [12, 15, 20],
    mainCycles: 3,
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
          exerciseId: "PUENTE_GLUTEOS",
          name: "Puente de glúteos",
          shortDescription: "Tumbada boca arriba, eleva caderas apretando glúteos.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "PUENTE_UNA_PIERNA",
          name: "Puente a una pierna",
          shortDescription: "Puente de glúteos elevando una pierna.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 2
        },
        {
          exerciseId: "PATADA_GLUTEO_CUADRUPEDIA",
          name: "Patada de glúteo en cuadrupedia",
          shortDescription: "En cuadrupedia, levanta pierna extendida.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 3
        },
        {
          exerciseId: "ABDUCCIONES_LATERALES",
          name: "Abducciones laterales",
          shortDescription: "De pie, eleva pierna lateralmente.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 4
        },
        {
          exerciseId: "SENTADILLA_SUMO",
          name: "Sentadilla sumo",
          shortDescription: "Sentadilla con pies separados y puntas hacia afuera.",
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
          exerciseId: "ESTIR_GLUTEOS",
          name: "Estiramiento de glúteos",
          shortDescription: "Tumbada, llevar rodilla al pecho suavemente.",
          type: "movilidad",
          zone: "piernas_gluteos",
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ]
    },
    category: "fuerza",
    intensity: "moderada",
    tags: ["intermedio", "gluteos", "piernas"]
  }
];

// Grupo 4: 18–35, intermedio, rodillas sensibles
const grupo4Templates = [
  {
    templateId: "RUTINA_D1",
    name: "Piernas Amables 15 min",
    description: "Rutina para piernas con rodillas sensibles",
    targetProfile: {
      ageRange: "18-35",
      level: "intermedio",
      constitutions: ["normopeso", "sobrepeso"],
      kneeSensitive: true,
      allowedPathologies: ["ninguna"]
    },
    baseDurationMinutes: 15,
    adjustableDurations: [12, 15, 20],
    mainCycles: 3,
    blocks: {
      calentamiento: [
        {
          exerciseId: "CAL_MARCHA_SUAVE_SILLA",
          name: "Marcha suave con silla",
          shortDescription: "Caminar suave sujetándose de una silla.",
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
          exerciseId: "PESO_MUERTO_RUMANO",
          name: "Peso muerto rumano",
          shortDescription: "Cadera atrás, poca flexión de rodilla.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 40,
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
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 2
        },
        {
          exerciseId: "ELEV_TALONES",
          name: "Elevación de talones",
          shortDescription: "De pie, sube y baja talones.",
          type: "fuerza",
          zone: "pantorrillas",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 3
        },
        {
          exerciseId: "ABDUCCION_CADERA_PIE",
          name: "Abducción de cadera de pie",
          shortDescription: "De pie, eleva pierna lateralmente.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 4
        },
        {
          exerciseId: "STEP_CORTO_ADELANTE",
          name: "Step corto adelante sin impacto",
          shortDescription: "Paso corto adelante y atrás sin impacto.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 5
        }
      ],
      enfriamiento: [
        {
          exerciseId: "ESTIR_ISQUIOS",
          name: "Estiramiento isquios",
          shortDescription: "Sentada, estirar parte posterior de la pierna.",
          type: "movilidad",
          zone: "piernas",
          baseTimeSeconds: 45,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ]
    },
    category: "bajo_impacto",
    intensity: "moderada",
    tags: ["intermedio", "rodillas_sensibles", "piernas"]
  }
];

// Función para cargar las plantillas adicionales
async function loadAdditionalTemplates2() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong');
    
    console.log('Insertando plantillas adicionales (lote 2)...');
    const allTemplates = [...grupo3Templates, ...grupo4Templates];
    
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
    
    console.log(`✅ Se procesaron ${allTemplates.length} plantillas adicionales (lote 2)`);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = { loadAdditionalTemplates2 };

if (require.main === module) {
  require('dotenv').config();
  loadAdditionalTemplates2();
}
