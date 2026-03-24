const mongoose = require('mongoose');
const RoutineTemplate = require('../models/RoutineTemplate');

// Grupo 7: 36–55, intermedio, rodilla sana
const grupo7Templates = [
  {
    templateId: "RUTINA_G1",
    name: "Fuerza Completa 20 min",
    description: "Rutina completa de fuerza para nivel intermedio 36-55 años",
    targetProfile: {
      ageRange: "36-55",
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
        }
      ],
      principal: [
        {
          exerciseId: "SENTADILLA_COMPLETA",
          name: "Sentadilla completa",
          shortDescription: "Sentadilla profunda con técnica adecuada.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "ZANCADA_ATRAS",
          name: "Zancada atrás",
          shortDescription: "Paso largo hacia atrás alternando piernas.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 2
        },
        {
          exerciseId: "FLEXION_INCLINADA",
          name: "Flexión inclinada",
          shortDescription: "Flexiones con manos en mesa o pared.",
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
          exerciseId: "PLANCHA_COMPLETA",
          name: "Plancha completa",
          shortDescription: "Plancha tradicional apoyando pies.",
          type: "fuerza",
          zone: "core",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 5
        },
        {
          exerciseId: "PESO_MUERTO_RUMANO",
          name: "Peso muerto rumano",
          shortDescription: "Cadera atrás, poco flexión de rodilla.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 40,
          restSeconds: 20,
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
        }
      ]
    },
    category: "fuerza",
    intensity: "moderada",
    tags: ["intermedio", "36-55", "fuerza_completa"]
  },
  {
    templateId: "RUTINA_G2",
    name: "Cardio + Fuerza 18 min",
    description: "Combinación de cardio y fuerza para 36-55 años",
    targetProfile: {
      ageRange: "36-55",
      level: "intermedio",
      constitutions: ["normopeso", "sobrepeso"],
      kneeSensitive: false,
      allowedPathologies: ["ninguna"]
    },
    baseDurationMinutes: 18,
    adjustableDurations: [15, 20, 25],
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
          exerciseId: "SENTADILLA_MEDIA",
          name: "Sentadilla media",
          shortDescription: "Flexiona rodillas sin bajar demasiado, espalda recta.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 2
        },
        {
          exerciseId: "STEP_LATERAL",
          name: "Step lateral",
          shortDescription: "Paso lateral alternando con brazos.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 3
        },
        {
          exerciseId: "FLEXIONES_INCLINADAS",
          name: "Flexiones inclinadas",
          shortDescription: "Flexiones con manos apoyadas en mesa.",
          type: "fuerza",
          zone: "pecho_brazos",
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 4
        },
        {
          exerciseId: "PUENTE_GLUTEOS",
          name: "Puente de glúteos",
          shortDescription: "Tumbada boca arriba, eleva caderas apretando glúteos.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 5
        },
        {
          exerciseId: "PLANCHA_RODILLAS",
          name: "Plancha apoyando rodillas",
          shortDescription: "Apoya antebrazos y rodillas, mantiene abdomen firme.",
          type: "fuerza",
          zone: "core",
          baseTimeSeconds: 45,
          restSeconds: 15,
          kneeFriendly: true,
          order: 6
        }
      ],
      enfriamiento: [
        {
          exerciseId: "ESTIR_COMPLETO",
          name: "Estiramiento completo",
          shortDescription: "Estiramientos suaves de todo el cuerpo.",
          type: "movilidad",
          zone: "cuerpo_entero",
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ]
    },
    category: "funcional",
    intensity: "moderada",
    tags: ["intermedio", "36-55", "cardio_fuerza"]
  }
];

// Grupo 8: 36–55, intermedio, rodillas sensibles
const grupo8Templates = [
  {
    templateId: "RUTINA_H1",
    name: "Full Body Low Impact 18 min",
    description: "Rutina completa de bajo impacto para rodillas sensibles",
    targetProfile: {
      ageRange: "36-55",
      level: "intermedio",
      constitutions: ["normopeso", "sobrepeso"],
      kneeSensitive: true,
      allowedPathologies: ["ninguna"]
    },
    baseDurationMinutes: 18,
    adjustableDurations: [15, 20, 25],
    mainCycles: 3,
    blocks: {
      calentamiento: [
        {
          exerciseId: "CAL_MARCHA_SUAVE_SILLA",
          name: "Marcha suave con silla",
          shortDescription: "Caminar suave sujetándose de una silla.",
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
          exerciseId: "PESO_MUERTO_RUMANO",
          name: "Peso muerto rumano",
          shortDescription: "Cadera atrás, poco flexión de rodilla.",
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
        },
        {
          exerciseId: "MARCHA_RAPIDA",
          name: "Marcha rápida",
          shortDescription: "Marcha en el sitio con ritmo elevado.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 6
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
        }
      ]
    },
    category: "bajo_impacto",
    intensity: "moderada",
    tags: ["intermedio", "36-55", "rodillas_sensibles", "bajo_impacto"]
  }
];

// Función para cargar las plantillas adicionales
async function loadAdditionalTemplates4() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong');
    
    console.log('Insertando plantillas adicionales (lote 4)...');
    const allTemplates = [...grupo7Templates, ...grupo8Templates];
    
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
    
    console.log(`✅ Se procesaron ${allTemplates.length} plantillas adicionales (lote 4)`);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = { loadAdditionalTemplates4 };

if (require.main === module) {
  require('dotenv').config();
  loadAdditionalTemplates4();
}
