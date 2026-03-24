const mongoose = require('mongoose');
const RoutineTemplate = require('../models/RoutineTemplate');

// Grupo 5: 36–55, principiante, rodilla sana
const grupo5Templates = [
  {
    templateId: "RUTINA_E1",
    name: "Reinicio Activo 12 min",
    description: "Rutina para principiantes de 36-55 años",
    targetProfile: {
      ageRange: "36-55",
      level: "principiante",
      constitutions: ["normopeso", "sobrepeso"],
      kneeSensitive: false,
      allowedPathologies: ["ninguna"]
    },
    baseDurationMinutes: 12,
    adjustableDurations: [10, 15, 20],
    mainCycles: 2,
    blocks: {
      calentamiento: [
        {
          exerciseId: "CAL_MARCHA_SUAVE",
          name: "Marcha suave",
          shortDescription: "Caminar en el mismo lugar moviendo brazos.",
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
          exerciseId: "SENTADILLA_PARCIAL",
          name: "Sentadilla parcial",
          shortDescription: "Sentadilla poco profunda con espalda recta.",
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
          exerciseId: "REMO_BANDA",
          name: "Remo con banda",
          shortDescription: "Remo sentado con banda de resistencia.",
          type: "fuerza",
          zone: "espalda",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 3
        },
        {
          exerciseId: "PLANCHA_MESA",
          name: "Plancha en mesa",
          shortDescription: "Apoya manos y rodillas, mantiene espalda recta.",
          type: "fuerza",
          zone: "core",
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
        }
      ]
    },
    category: "funcional",
    intensity: "baja",
    tags: ["principiante", "36-55", "reactivacion"]
  },
  {
    templateId: "RUTINA_E2",
    name: "Full Body 15 min 40+",
    description: "Rutina completa para mayores de 40 años",
    targetProfile: {
      ageRange: "36-55",
      level: "principiante",
      constitutions: ["normopeso", "sobrepeso"],
      kneeSensitive: false,
      allowedPathologies: ["ninguna"]
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
          exerciseId: "SENTADILLA_MEDIA",
          name: "Sentadilla media",
          shortDescription: "Flexiona rodillas sin bajar demasiado, espalda recta.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "FLEXIONES_INCLINADAS",
          name: "Flexiones inclinadas",
          shortDescription: "Flexiones con manos apoyadas en mesa o pared.",
          type: "fuerza",
          zone: "pecho_brazos",
          baseTimeSeconds: 40,
          restSeconds: 20,
          kneeFriendly: true,
          order: 2
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
          order: 3
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
          order: 4
        },
        {
          exerciseId: "PLANCHA_RODILLAS",
          name: "Plancha apoyando rodillas",
          shortDescription: "Apoya antebrazos y rodillas, mantiene abdomen firme.",
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
    category: "funcional",
    intensity: "baja",
    tags: ["principiante", "36-55", "full_body"]
  }
];

// Grupo 6: 36–55, principiante, rodillas sensibles
const grupo6Templates = [
  {
    templateId: "RUTINA_F1",
    name: "Rodilla Cuidada 12 min",
    description: "Rutina suave para rodillas sensibles 36-55 años",
    targetProfile: {
      ageRange: "36-55",
      level: "principiante",
      constitutions: ["sobrepeso", "obesidad"],
      kneeSensitive: true,
      allowedPathologies: ["ninguna", "metabolica"]
    },
    baseDurationMinutes: 12,
    adjustableDurations: [10, 15],
    mainCycles: 2,
    blocks: {
      calentamiento: [
        {
          exerciseId: "CAL_MARCHA_SUAVE_SILLA",
          name: "Marcha con apoyo",
          shortDescription: "Caminar suave sujetándose de silla o pared.",
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
          name: "Sentarse y levantarse de silla",
          shortDescription: "Sentarse y ponerse de pie usando fuerza de piernas.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "FLEXION_RODILLA_COLGANDO",
          name: "Flexión de rodilla colgando",
          shortDescription: "De pie, flexiona rodilla llevando talón hacia glúteo.",
          type: "movilidad",
          zone: "piernas",
          baseTimeSeconds: 30,
          restSeconds: 20,
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
          exerciseId: "ELEV_TALONES_SENTADO",
          name: "Elevación de talones sentado",
          shortDescription: "Sentada, sube y baja talones.",
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
          exerciseId: "ESTIR_CUADRICEPS_APOYO",
          name: "Estiramiento cuádriceps",
          shortDescription: "Sentada, llevar talón hacia glúteo.",
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
    intensity: "muy_baja",
    tags: ["rodillas_sensibles", "36-55", "principiante"]
  }
];

// Función para cargar las plantillas adicionales
async function loadAdditionalTemplates3() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong');
    
    console.log('Insertando plantillas adicionales (lote 3)...');
    const allTemplates = [...grupo5Templates, ...grupo6Templates];
    
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
    
    console.log(`✅ Se procesaron ${allTemplates.length} plantillas adicionales (lote 3)`);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = { loadAdditionalTemplates3 };

if (require.main === module) {
  require('dotenv').config();
  loadAdditionalTemplates3();
}
