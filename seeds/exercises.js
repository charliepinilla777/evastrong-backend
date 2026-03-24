const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');

// Ejercicios individuales predefinidos
const exercises = [
  // Calentamiento
  {
    exerciseId: "CAL_MARCHA_SUAVE",
    name: "Marcha suave en el sitio",
    shortDescription: "Caminar en el mismo lugar moviendo brazos.",
    detailedDescription: "Mantén una postura erguida y camina en el sitio levantando las rodillas moderadamente mientras mueves los brazos de forma natural.",
    type: "cardio_suave",
    zone: "cuerpo_entero",
    timeSeconds: 60,
    restSeconds: 0,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["18-35", "36-55", "55+"],
      constitutions: ["bajo_peso", "normopeso", "sobrepeso", "obesidad"],
      levels: ["principiante", "intermedio", "avanzado"],
      pathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica", "otra"]
    },
    tags: ["calentamiento", "cardio", "bajo_impacto"],
    difficulty: 1,
    caloriesPerMinute: 3
  },
  {
    exerciseId: "CAL_MOV_ART",
    name: "Movilidad de hombros y cadera",
    shortDescription: "Círculos de hombros y cadera a ritmo suave.",
    detailedDescription: "Realiza círculos suaves con los hombros hacia adelante y atrás, luego con las caderas en ambas direcciones.",
    type: "movilidad",
    zone: "cuerpo_entero",
    timeSeconds: 60,
    restSeconds: 0,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["18-35", "36-55", "55+"],
      constitutions: ["bajo_peso", "normopeso", "sobrepeso", "obesidad"],
      levels: ["principiante", "intermedio", "avanzado"],
      pathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica", "otra"]
    },
    tags: ["calentamiento", "movilidad", "articulaciones"],
    difficulty: 1,
    caloriesPerMinute: 2
  },
  {
    exerciseId: "CAL_MARCHA_SUAVE_SILLA",
    name: "Marcha suave junto a una silla",
    shortDescription: "Caminar suave en el sitio, agarrada al respaldo si lo necesita.",
    detailedDescription: "Sujétate del respaldo de una silla y camina en el sitio con movimientos suaves y controlados.",
    type: "cardio_suave",
    zone: "cuerpo_entero",
    timeSeconds: 90,
    restSeconds: 0,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "silla",
    suitableFor: {
      ageRanges: ["18-35", "36-55", "55+"],
      constitutions: ["sobrepeso", "obesidad"],
      levels: ["principiante", "intermedio", "avanzado"],
      pathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica", "otra"]
    },
    tags: ["calentamiento", "silla", "bajo_impacto", "rodillas_sensibles"],
    difficulty: 1,
    caloriesPerMinute: 2
  },
  {
    exerciseId: "CAL_CARDIO_SUAVE",
    name: "Cardio suave 3 min",
    shortDescription: "Marcha en el sitio con movimientos de brazos.",
    detailedDescription: "Marcha en el sitio elevando rodillas y moviendo brazos de forma enérgica pero controlada.",
    type: "cardio_suave",
    zone: "cuerpo_entero",
    timeSeconds: 180,
    restSeconds: 0,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["18-35", "36-55", "55+"],
      constitutions: ["normopeso", "sobrepeso"],
      levels: ["intermedio", "avanzado"],
      pathologies: ["ninguna"]
    },
    tags: ["calentamiento", "cardio", "intermedio"],
    difficulty: 2,
    caloriesPerMinute: 5
  },
  {
    exerciseId: "CAL_MOVILIDAD_ARTIC",
    name: "Movilidad articular",
    shortDescription: "Rotaciones suaves de articulaciones principales.",
    detailedDescription: "Realiza rotaciones controladas de tobillos, rodillas, caderas, muñecas, codos y hombros.",
    type: "movilidad",
    zone: "cuerpo_entero",
    timeSeconds: 60,
    restSeconds: 0,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["18-35", "36-55", "55+"],
      constitutions: ["normopeso", "sobrepeso"],
      levels: ["intermedio", "avanzado"],
      pathologies: ["ninguna"]
    },
    tags: ["calentamiento", "movilidad", "articulaciones"],
    difficulty: 1,
    caloriesPerMinute: 2
  },
  {
    exerciseId: "CAL_MARCHA_MUY_SUAVE",
    name: "Marcha muy suave con apoyo",
    shortDescription: "Caminar muy suave junto a una pared o silla.",
    detailedDescription: "Marcha muy lenta y controlada con apoyo para mantener el equilibrio.",
    type: "cardio_suave",
    zone: "cuerpo_entero",
    timeSeconds: 120,
    restSeconds: 0,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "silla",
    suitableFor: {
      ageRanges: ["55+"],
      constitutions: ["bajo_peso", "normopeso", "sobrepeso"],
      levels: ["principiante"],
      pathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica"]
    },
    tags: ["calentamiento", "senior", "silla", "muy_bajo_impacto"],
    difficulty: 1,
    caloriesPerMinute: 2
  },
  {
    exerciseId: "CAL_MOV_CUELLO_HOMBROS",
    name: "Movilidad de cuello y hombros",
    shortDescription: "Movimientos suaves de cuello y hombros.",
    detailedDescription: "Realiza movimientos lentos y controlados de cuello y hombros para liberar tensión.",
    type: "movilidad",
    zone: "tren_superior",
    timeSeconds: 60,
    restSeconds: 0,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["55+"],
      constitutions: ["bajo_peso", "normopeso", "sobrepeso"],
      levels: ["principiante"],
      pathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica"]
    },
    tags: ["calentamiento", "senior", "movilidad"],
    difficulty: 1,
    caloriesPerMinute: 1
  },

  // Ejercicios principales - Fuerza piernas
  {
    exerciseId: "SENTADILLA_MEDIA",
    name: "Sentadilla media",
    shortDescription: "Flexiona rodillas sin bajar demasiado, espalda recta.",
    detailedDescription: "Con pies separados al ancho de hombros, flexiona rodillas hasta 90 grados manteniendo espalda recta.",
    type: "fuerza",
    zone: "piernas_gluteos",
    timeSeconds: 30,
    restSeconds: 20,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["18-35", "36-55"],
      constitutions: ["sobrepeso", "normopeso"],
      levels: ["principiante"],
      pathologies: ["ninguna"]
    },
    tags: ["piernas", "gluteos", "fuerza", "principiante"],
    difficulty: 2,
    caloriesPerMinute: 6
  },
  {
    exerciseId: "PUENTE_GLUTEOS",
    name: "Puente de glúteos",
    shortDescription: "Tumbada boca arriba, eleva caderas apretando glúteos.",
    detailedDescription: "Acostada boca arriba con rodillas flexionadas, eleva la cadera apretando glúteos.",
    type: "fuerza",
    zone: "piernas_gluteos",
    timeSeconds: 30,
    restSeconds: 20,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["18-35", "36-55", "55+"],
      constitutions: ["bajo_peso", "normopeso", "sobrepeso", "obesidad"],
      levels: ["principiante", "intermedio", "avanzado"],
      pathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica", "otra"]
    },
    tags: ["gluteos", "fuerza", "bajo_impacto"],
    difficulty: 2,
    caloriesPerMinute: 4
  },
  {
    exerciseId: "SENTADILLA_SILLA",
    name: "Sentarse y levantarse de la silla",
    shortDescription: "Sentarse y ponerse de pie usando la fuerza de las piernas.",
    detailedDescription: "Frente a una silla, siéntate lentamente y levántate usando fuerza de piernas sin ayuda de brazos.",
    type: "fuerza",
    zone: "piernas_gluteos",
    timeSeconds: 30,
    restSeconds: 30,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "silla",
    suitableFor: {
      ageRanges: ["18-35", "36-55", "55+"],
      constitutions: ["sobrepeso", "obesidad"],
      levels: ["principiante"],
      pathologies: ["ninguna", "metabolica"]
    },
    tags: ["silla", "piernas", "gluteos", "rodillas_sensibles"],
    difficulty: 1,
    caloriesPerMinute: 3
  },
  {
    exerciseId: "EXT_RODILLA_SENTADA",
    name: "Extensión de rodilla sentada",
    shortDescription: "Sentada, estira una pierna y aprieta el muslo.",
    detailedDescription: "Sentada en una silla, estira una pierna hasta quedar recta y aprieta el cuádriceps por 2 segundos.",
    type: "fuerza",
    zone: "cuadriceps",
    timeSeconds: 30,
    restSeconds: 20,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "silla",
    suitableFor: {
      ageRanges: ["18-35", "36-55", "55+"],
      constitutions: ["sobrepeso", "obesidad"],
      levels: ["principiante"],
      pathologies: ["ninguna", "metabolica"]
    },
    tags: ["silla", "cuadriceps", "rodillas_sensibles"],
    difficulty: 1,
    caloriesPerMinute: 3
  },
  {
    exerciseId: "SENTADILLA_PROFUNDA",
    name: "Sentadilla profunda",
    shortDescription: "Sentadilla completa con espalda recta.",
    detailedDescription: "Sentadilla completa bajando hasta que los muslos queden paralelos al piso.",
    type: "fuerza",
    zone: "piernas_gluteos",
    timeSeconds: 40,
    restSeconds: 20,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["36-55"],
      constitutions: ["normopeso", "sobrepeso"],
      levels: ["intermedio"],
      pathologies: ["ninguna"]
    },
    tags: ["piernas", "gluteos", "intermedio"],
    difficulty: 3,
    caloriesPerMinute: 7
  },
  {
    exerciseId: "ZANCADAS",
    name: "Zancadas alternas",
    shortDescription: "Paso largo hacia adelante alternando piernas.",
    detailedDescription: "Da un paso largo adelante y flexiona ambas rodillas a 90 grados, alterna piernas.",
    type: "fuerza",
    zone: "piernas_gluteos",
    timeSeconds: 40,
    restSeconds: 20,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["36-55"],
      constitutions: ["normopeso", "sobrepeso"],
      levels: ["intermedio"],
      pathologies: ["ninguna"]
    },
    tags: ["piernas", "gluteos", "intermedio", "equilibrio"],
    difficulty: 3,
    caloriesPerMinute: 8
  },
  {
    exerciseId: "SENTARSE_LEVANTARSE_SILLA",
    name: "Sentarse y levantarse de silla",
    shortDescription: "Ejercicio de sentarse y levantarse lento y controlado.",
    detailedDescription: "Siéntate y levántate de una silla de forma lenta y controlada, sin usar brazos.",
    type: "fuerza",
    zone: "piernas_gluteos",
    timeSeconds: 45,
    restSeconds: 30,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "silla",
    suitableFor: {
      ageRanges: ["55+"],
      constitutions: ["bajo_peso", "normopeso", "sobrepeso"],
      levels: ["principiante"],
      pathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica"]
    },
    tags: ["silla", "senior", "piernas", "seguridad"],
    difficulty: 1,
    caloriesPerMinute: 2
  },

  // Ejercicios principales - Tren superior
  {
    exerciseId: "PLANCHA_RODILLAS",
    name: "Plancha apoyando rodillas",
    shortDescription: "Apoya antebrazos y rodillas, mantiene abdomen firme.",
    detailedDescription: "Apoya antebrazos y rodillas, manteniendo el cuerpo recto y abdomen contraído.",
    type: "fuerza",
    zone: "core",
    timeSeconds: 20,
    restSeconds: 20,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["18-35", "36-55", "55+"],
      constitutions: ["bajo_peso", "normopeso", "sobrepeso", "obesidad"],
      levels: ["principiante", "intermedio", "avanzado"],
      pathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica", "otra"]
    },
    tags: ["core", "abdomen", "principiante"],
    difficulty: 2,
    caloriesPerMinute: 4
  },
  {
    exerciseId: "FLEX_PARED",
    name: "Flexiones en pared",
    shortDescription: "Apoya manos en la pared y flexiona codos.",
    detailedDescription: "Con manos en la pared a altura de hombros, flexiona codos acercando pecho a la pared.",
    type: "fuerza",
    zone: "pecho_brazos",
    timeSeconds: 30,
    restSeconds: 30,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "pared",
    suitableFor: {
      ageRanges: ["18-35", "36-55", "55+"],
      constitutions: ["sobrepeso", "obesidad"],
      levels: ["principiante"],
      pathologies: ["ninguna", "metabolica"]
    },
    tags: ["pared", "pecho", "brazos", "principiante"],
    difficulty: 1,
    caloriesPerMinute: 3
  },
  {
    exerciseId: "FLEXIONES_PISO",
    name: "Flexiones en el piso",
    shortDescription: "Flexiones tradicionales con rodillas levantadas.",
    detailedDescription: "Flexiones tradicionales manteniendo el cuerpo recto y rodillas levantadas del piso.",
    type: "fuerza",
    zone: "pecho_brazos",
    timeSeconds: 40,
    restSeconds: 20,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["36-55"],
      constitutions: ["normopeso", "sobrepeso"],
      levels: ["intermedio"],
      pathologies: ["ninguna"]
    },
    tags: ["pecho", "brazos", "intermedio"],
    difficulty: 3,
    caloriesPerMinute: 6
  },
  {
    exerciseId: "PLANCHA_COMPLETA",
    name: "Plancha completa",
    shortDescription: "Plancha tradicional apoyando pies.",
    detailedDescription: "Apoya antebrazos y puntas de pies, manteniendo el cuerpo completamente recto.",
    type: "fuerza",
    zone: "core",
    timeSeconds: 40,
    restSeconds: 20,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["36-55"],
      constitutions: ["normopeso", "sobrepeso"],
      levels: ["intermedio"],
      pathologies: ["ninguna"]
    },
    tags: ["core", "abdomen", "intermedio"],
    difficulty: 4,
    caloriesPerMinute: 5
  },

  // Ejercicios principales - Cardio
  {
    exerciseId: "PASO_LATERAL",
    name: "Paso lateral dinámico",
    shortDescription: "Paso a un lado y al otro moviendo brazos.",
    detailedDescription: "Da pasos laterales alternando derecha e izquierda con movimientos de brazos.",
    type: "cardio_suave",
    zone: "cuerpo_entero",
    timeSeconds: 40,
    restSeconds: 20,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["18-35", "36-55"],
      constitutions: ["sobrepeso", "normopeso"],
      levels: ["principiante"],
      pathologies: ["ninguna"]
    },
    tags: ["cardio", "lateral", "bajo_impacto"],
    difficulty: 2,
    caloriesPerMinute: 5
  },
  {
    exerciseId: "ELEV_TALONES",
    name: "Elevación de talones",
    shortDescription: "De pie, sube y baja talones, sujetándose si hace falta.",
    detailedDescription: "De pie, eleva talones manteniendo puntas en el suelo, baja lentamente.",
    type: "fuerza",
    zone: "pantorrillas",
    timeSeconds: 30,
    restSeconds: 20,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["18-35", "36-55", "55+"],
      constitutions: ["bajo_peso", "normopeso", "sobrepeso", "obesidad"],
      levels: ["principiante", "intermedio", "avanzado"],
      pathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica", "otra"]
    },
    tags: ["pantorrillas", "fuerza", "bajo_impacto"],
    difficulty: 1,
    caloriesPerMinute: 3
  },
  {
    exerciseId: "PASO_LATERAL_SUAVE",
    name: "Paso lateral suave",
    shortDescription: "Un paso a la derecha y a la izquierda sin saltar.",
    detailedDescription: "Pasos laterales suaves y controlados sin impacto en las articulaciones.",
    type: "cardio_suave",
    zone: "cuerpo_entero",
    timeSeconds: 30,
    restSeconds: 30,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["18-35", "36-55", "55+"],
      constitutions: ["sobrepeso", "obesidad"],
      levels: ["principiante"],
      pathologies: ["ninguna", "metabolica"]
    },
    tags: ["cardio", "lateral", "rodillas_sensibles"],
    difficulty: 1,
    caloriesPerMinute: 3
  },
  {
    exerciseId: "MONTAÑA_CLIMBER",
    name: "Mountain climber",
    shortDescription: "Llevar rodillas al pecho alternando rápidamente.",
    detailedDescription: "En posición de plancha, lleva rodillas al pecho alternando rápidamente.",
    type: "cardio_intenso",
    zone: "cuerpo_entero",
    timeSeconds: 30,
    restSeconds: 20,
    kneeFriendly: true,
    lowImpact: false,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["36-55"],
      constitutions: ["normopeso", "sobrepeso"],
      levels: ["intermedio"],
      pathologies: ["ninguna"]
    },
    tags: ["cardio", "intenso", "core"],
    difficulty: 4,
    caloriesPerMinute: 10
  },
  {
    exerciseId: "ELEVACION_TALONES_SILLA",
    name: "Elevación de talones con apoyo",
    shortDescription: "Subir y bajar talones sujetándose de la silla.",
    detailedDescription: "Sujetándose de una silla, eleva talones manteniendo el equilibrio.",
    type: "fuerza",
    zone: "pantorrillas",
    timeSeconds: 30,
    restSeconds: 20,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "silla",
    suitableFor: {
      ageRanges: ["55+"],
      constitutions: ["bajo_peso", "normopeso", "sobrepeso"],
      levels: ["principiante"],
      pathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica"]
    },
    tags: ["silla", "pantorrillas", "senior"],
    difficulty: 1,
    caloriesPerMinute: 2
  },
  {
    exerciseId: "CAMINATA_LATERAL_CORTA",
    name: "Caminata lateral corta",
    shortDescription: "Pasos laterales cortos y controlados.",
    detailedDescription: "Pasos laterales muy cortos y lentos manteniendo siempre el equilibrio.",
    type: "cardio_suave",
    zone: "cuerpo_entero",
    timeSeconds: 30,
    restSeconds: 20,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["55+"],
      constitutions: ["bajo_peso", "normopeso", "sobrepeso"],
      levels: ["principiante"],
      pathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica"]
    },
    tags: ["cardio", "lateral", "senior", "seguridad"],
    difficulty: 1,
    caloriesPerMinute: 2
  },

  // Enfriamiento y estiramientos
  {
    exerciseId: "ESTIR_ISQUIOS",
    name: "Estiramiento posterior de pierna",
    shortDescription: "Sentada, estirar suavemente parte posterior de la pierna.",
    detailedDescription: "Sentada con una pierna estirada, inclínate hacia adelante suavemente.",
    type: "movilidad",
    zone: "piernas",
    timeSeconds: 30,
    restSeconds: 0,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["18-35", "36-55", "55+"],
      constitutions: ["bajo_peso", "normopeso", "sobrepeso", "obesidad"],
      levels: ["principiante", "intermedio", "avanzado"],
      pathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica", "otra"]
    },
    tags: ["estiramiento", "isquiotibiales", "flexibilidad"],
    difficulty: 1,
    caloriesPerMinute: 1
  },
  {
    exerciseId: "ESTIR_GLUTEOS",
    name: "Estiramiento de glúteos",
    shortDescription: "Tumbada, llevar rodilla al pecho suavemente.",
    detailedDescription: "Acostada boca arriba, lleva una rodilla al pecho manteniendo la otra estirada.",
    type: "movilidad",
    zone: "piernas_gluteos",
    timeSeconds: 30,
    restSeconds: 0,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["18-35", "36-55", "55+"],
      constitutions: ["bajo_peso", "normopeso", "sobrepeso", "obesidad"],
      levels: ["principiante", "intermedio", "avanzado"],
      pathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica", "otra"]
    },
    tags: ["estiramiento", "gluteos", "flexibilidad"],
    difficulty: 1,
    caloriesPerMinute: 1
  },
  {
    exerciseId: "ESTIR_CUADRICEPS_APOYO",
    name: "Estiramiento frontal de pierna",
    shortDescription: "De pie, sujetarse de una silla y llevar talón hacia glúteo suavemente.",
    detailedDescription: "Sujetándose de una silla con una mano, lleva el talón hacia el glúteo.",
    type: "movilidad",
    zone: "piernas",
    timeSeconds: 30,
    restSeconds: 0,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "silla",
    suitableFor: {
      ageRanges: ["18-35", "36-55", "55+"],
      constitutions: ["bajo_peso", "normopeso", "sobrepeso", "obesidad"],
      levels: ["principiante", "intermedio", "avanzado"],
      pathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica", "otra"]
    },
    tags: ["estiramiento", "cuadriceps", "silla"],
    difficulty: 1,
    caloriesPerMinute: 1
  },
  {
    exerciseId: "ESTIR_ISQUIOS_TUMBADO",
    name: "Estiramiento isquiotibiales",
    shortDescription: "Tumbada, llevar pierna estirada hacia el pecho.",
    detailedDescription: "Acostada boca arriba, eleva una pierna estirada con ayuda de las manos.",
    type: "movilidad",
    zone: "piernas",
    timeSeconds: 45,
    restSeconds: 0,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["36-55"],
      constitutions: ["normopeso", "sobrepeso"],
      levels: ["intermedio"],
      pathologies: ["ninguna"]
    },
    tags: ["estiramiento", "isquiotibiales", "intermedio"],
    difficulty: 2,
    caloriesPerMinute: 1
  },
  {
    exerciseId: "ESTIR_PECHO",
    name: "Estiramiento de pecho",
    shortDescription: "Estiramiento de pecho en marco de puerta.",
    detailedDescription: "Apoya antebrazos en marco de puerta y da un paso adelante para estirar pecho.",
    type: "movilidad",
    zone: "pecho_brazos",
    timeSeconds: 30,
    restSeconds: 0,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "pared",
    suitableFor: {
      ageRanges: ["36-55"],
      constitutions: ["normopeso", "sobrepeso"],
      levels: ["intermedio"],
      pathologies: ["ninguna"]
    },
    tags: ["estiramiento", "pecho", "pared"],
    difficulty: 1,
    caloriesPerMinute: 1
  },
  {
    exerciseId: "ESTIR_SUAVE_PIERNAS",
    name: "Estiramiento suave de piernas",
    shortDescription: "Estiramientos suaves sentada en silla.",
    detailedDescription: "Sentada en una silla, realiza estiramientos suaves de piernas.",
    type: "movilidad",
    zone: "piernas",
    timeSeconds: 60,
    restSeconds: 0,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "silla",
    suitableFor: {
      ageRanges: ["55+"],
      constitutions: ["bajo_peso", "normopeso", "sobrepeso"],
      levels: ["principiante"],
      pathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica"]
    },
    tags: ["estiramiento", "silla", "senior"],
    difficulty: 1,
    caloriesPerMinute: 1
  },
  {
    exerciseId: "RESPIRACION_RELAX",
    name: "Respiración relajante",
    shortDescription: "Ejercicios de respiración profunda y relajación.",
    detailedDescription: "Sentada cómodamente, realiza respiraciones profundas y lentas.",
    type: "movilidad",
    zone: "cuerpo_entero",
    timeSeconds: 60,
    restSeconds: 0,
    kneeFriendly: true,
    lowImpact: true,
    equipmentNeeded: "ninguno",
    suitableFor: {
      ageRanges: ["55+"],
      constitutions: ["bajo_peso", "normopeso", "sobrepeso"],
      levels: ["principiante"],
      pathologies: ["ninguna", "cardiaca", "respiratoria", "metabolica"]
    },
    tags: ["relajacion", "respiracion", "senior"],
    difficulty: 1,
    caloriesPerMinute: 1
  }
];

// Función para cargar los ejercicios
async function loadExercises() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong');
    
    console.log('Limpiando ejercicios existentes...');
    await Exercise.deleteMany({});
    
    console.log('Insertando nuevos ejercicios...');
    await Exercise.insertMany(exercises);
    
    console.log(`✅ Se cargaron ${exercises.length} ejercicios exitosamente`);
    
    // Mostrar resumen
    const loadedExercises = await Exercise.find({});
    console.log('\n📋 Resumen de ejercicios cargados:');
    loadedExercises.forEach(exercise => {
      console.log(`- ${exercise.exerciseId}: ${exercise.name} (${exercise.type})`);
    });
    
  } catch (error) {
    console.error('❌ Error al cargar ejercicios:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Exportar para uso en otros scripts
module.exports = { loadExercises, exercises };

// Ejecutar si se corre directamente
if (require.main === module) {
  loadExercises();
}
