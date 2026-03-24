const mongoose = require('mongoose');
const RoutineTemplate = require('../models/RoutineTemplate');

// Grupo 1: 18–35 años, principiante, rodilla sana
const grupo1Templates = [
  {
    templateId: "RUTINA_A2",
    name: "Inicio Fit 10 min",
    description: "Rutina rápida para principiantes con rodillas sanas",
    targetProfile: {
      ageRange: "18-35",
      level: "principiante",
      constitutions: ["bajo_peso", "normopeso", "sobrepeso", "obesidad"],
      kneeSensitive: false,
      allowedPathologies: ["ninguna"]
    },
    baseDurationMinutes: 10,
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
          baseTimeSeconds: 60,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "CAL_MOV_ART",
          name: "Movilidad de hombros",
          shortDescription: "Círculos de hombros a ritmo suave.",
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
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 3
        },
        {
          exerciseId: "STEP_JACK_SIN_SALTO",
          name: "Jumping jacks sin salto",
          shortDescription: "Step jack sin impacto, moviendo brazos y piernas.",
          type: "cardio_suave",
          zone: "cuerpo_entero",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 4
        },
        {
          exerciseId: "ELEV_TALONES",
          name: "Elevación de talones",
          shortDescription: "De pie, sube y baja talones.",
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
          name: "Estiramiento isquios",
          shortDescription: "Sentada, estirar parte posterior de la pierna.",
          type: "movilidad",
          zone: "piernas",
          baseTimeSeconds: 30,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "ESTIR_GLUTEOS",
          name: "Estiramiento glúteos",
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
    tags: ["principiante", "rapido", "full_body"]
  },
  {
    templateId: "RUTINA_A3",
    name: "Core Express 12 min",
    description: "Rutina enfocada en core para principiantes",
    targetProfile: {
      ageRange: "18-35",
      level: "principiante",
      constitutions: ["normopeso", "sobrepeso"],
      kneeSensitive: false,
      allowedPathologies: ["ninguna"]
    },
    baseDurationMinutes: 12,
    adjustableDurations: [10, 15, 20],
    mainCycles: 3,
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
          exerciseId: "PLANCHA_RODILLAS",
          name: "Plancha apoyando rodillas",
          shortDescription: "Apoya antebrazos y rodillas, mantiene abdomen firme.",
          type: "fuerza",
          zone: "core",
          baseTimeSeconds: 30,
          restSeconds: 15,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: "CRUNCH_BASICO",
          name: "Crunch básico",
          shortDescription: "Acostada boca arriba, levanta hombros del piso.",
          type: "fuerza",
          zone: "abdomen",
          baseTimeSeconds: 30,
          restSeconds: 15,
          kneeFriendly: true,
          order: 2
        },
        {
          exerciseId: "PUENTE_GLUTEOS",
          name: "Puente de glúteos",
          shortDescription: "Tumbada boca arriba, eleva caderas apretando glúteos.",
          type: "fuerza",
          zone: "piernas_gluteos",
          baseTimeSeconds: 30,
          restSeconds: 15,
          kneeFriendly: true,
          order: 3
        },
        {
          exerciseId: "DEAD_BUG",
          name: "Dead bug",
          shortDescription: "Acostada boca arriba, extiende brazo y pierna opuestos.",
          type: "fuerza",
          zone: "core",
          baseTimeSeconds: 30,
          restSeconds: 15,
          kneeFriendly: true,
          order: 4
        },
        {
          exerciseId: "PLANCHA_LATERAL_RODILLA",
          name: "Plancha lateral con rodilla apoyada",
          shortDescription: "Apoya antebrazo y rodilla, mantiene lado recto.",
          type: "fuerza",
          zone: "core",
          baseTimeSeconds: 30,
          restSeconds: 15,
          kneeFriendly: true,
          order: 5
        }
      ],
      enfriamiento: [
        {
          exerciseId: "ESTIR_ABDOMEN",
          name: "Estiramiento abdomen",
          shortDescription: "Boca abajo, levanta torso suavemente.",
          type: "movilidad",
          zone: "abdomen",
          baseTimeSeconds: 45,
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ]
    },
    category: "core",
    intensity: "moderada",
    tags: ["core", "principiante", "abdomen"]
  }
];

// Grupo 2: 18–35, principiante, rodillas sensibles
const grupo2Templates = [
  {
    templateId: "RUTINA_B2",
    name: "Rodilla Soft 12 min",
    description: "Rutina suave para rodillas sensibles",
    targetProfile: {
      ageRange: "18-35",
      level: "principiante",
      constitutions: ["sobrepeso", "obesidad"],
      kneeSensitive: true,
      allowedPathologies: ["ninguna"]
    },
    baseDurationMinutes: 12,
    adjustableDurations: [10, 15],
    mainCycles: 2,
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
          exerciseId: "FLEX_PARED",
          name: "Flexiones en pared",
          shortDescription: "Apoya manos en la pared y flexiona codos.",
          type: "fuerza",
          zone: "pecho_brazos",
          baseTimeSeconds: 30,
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
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 3
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
          order: 4
        },
        {
          exerciseId: "APERTURA_CADERA_SENTADA",
          name: "Apertura de cadera sentada",
          shortDescription: "Sentada, abre y cierra piernas suavemente.",
          type: "movilidad",
          zone: "cadera",
          baseTimeSeconds: 30,
          restSeconds: 20,
          kneeFriendly: true,
          order: 5
        }
      ],
      enfriamiento: [
        {
          exerciseId: "ESTIR_CUADRICEPS_APOYO",
          name: "Estiramiento cuádriceps",
          shortDescription: "De pie, llevar talón hacia glúteo.",
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
    tags: ["rodillas_sensibles", "principiante", "silla"]
  }
];

// Función para cargar las plantillas adicionales
async function loadAdditionalTemplates() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong');
    
    console.log('Insertando plantillas adicionales...');
    const allTemplates = [...grupo1Templates, ...grupo2Templates];
    
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
    
    console.log(`✅ Se procesaron ${allTemplates.length} plantillas adicionales`);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = { loadAdditionalTemplates };

if (require.main === module) {
  require('dotenv').config();
  loadAdditionalTemplates();
}
