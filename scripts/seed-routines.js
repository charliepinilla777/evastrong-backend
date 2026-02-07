const mongoose = require('mongoose');
const Routine = require('../models/Routine');
require('dotenv').config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✓ Conectado a MongoDB'))
.catch(err => {
  console.error('Error conectando a MongoDB:', err);
  process.exit(1);
});

// ID de instructor (Admin de Eva Strong)
const INSTRUCTOR_ID = '6976b9f5664715a44d45e739';

const rutinasAtractivas = [
  {
    title: '🔥 Vientre Plano en 21 Días',
    description: 'Elimina la pancita rebelde con esta rutina diseñada específicamente para mujeres. Combina ejercicios de core, cardio y respiración para resultados visibles.',
    category: 'hiit',
    difficulty: 'beginner',
    duration: 25,
    instructor: INSTRUCTOR_ID,
    instructorName: 'Eva Strong Team',
    objectives: [
      'Reducir grasa abdominal',
      'Tonificar el abdomen',
      'Mejorar postura',
      'Fortalecer el core'
    ],
    targetMuscles: ['Abdominales', 'Oblicuos', 'Core', 'Cintura'],
    equipment: ['Colchoneta', 'Nada más'],
    accessLevel: 'free',
    tags: ['vientre plano', 'abdomen', 'quemar grasa', 'principiante', 'sin equipo'],
    rating: 4.8,
    ratingCount: 1247,
    completedCount: 3521,
    blocks: {
      calentamiento: [
        {
          exerciseId: 'warm-001',
          name: 'Respiración Activadora',
          shortDescription: 'Activa tu metabolismo con respiración profunda',
          type: 'movilidad',
          zone: 'Core',
          timeSeconds: 60,
          repetitions: '10 respiraciones',
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ],
      principal: [
        {
          exerciseId: 'core-001',
          name: 'Crunches Quema Grasa',
          shortDescription: 'Abdominales tradicionales con técnica correcta',
          type: 'fuerza',
          zone: 'Abdomen superior',
          timeSeconds: 45,
          repetitions: '15-20 reps',
          restSeconds: 15,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: 'core-002',
          name: 'Plancha Cintura de Sirena',
          shortDescription: 'Fortalece todo el core',
          type: 'fuerza',
          zone: 'Core completo',
          timeSeconds: 30,
          repetitions: '3 series',
          restSeconds: 15,
          kneeFriendly: true,
          order: 2
        }
      ],
      enfriamiento: [
        {
          exerciseId: 'stretch-001',
          name: 'Estiramiento Abdominal',
          shortDescription: 'Relaja los músculos trabajados',
          type: 'flexibilidad',
          zone: 'Abdomen',
          timeSeconds: 60,
          repetitions: '2 series',
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ]
    }
  },
  {
    title: '🍑 Glúteos de Acero - Levanta y Tonifica',
    description: 'Transforma tus glúteos con esta rutina intensiva. Resultados reales en 4 semanas. ¡Di adiós a la flacidez!',
    category: 'strength',
    difficulty: 'intermediate',
    duration: 35,
    instructor: INSTRUCTOR_ID,
    instructorName: 'Eva Strong Team',
    objectives: [
      'Levantar y tonificar glúteos',
      'Aumentar volumen muscular',
      'Eliminar celulitis',
      'Piernas firmes y torneadas'
    ],
    targetMuscles: ['Glúteos', 'Cuádriceps', 'Isquiotibiales', 'Piernas'],
    equipment: ['Colchoneta', 'Banda elástica (opcional)'],
    accessLevel: 'premium',
    tags: ['glúteos', 'pompis', 'piernas', 'tonificar', 'aumentar volumen'],
    rating: 4.9,
    ratingCount: 2156,
    completedCount: 5432,
    blocks: {
      calentamiento: [
        {
          exerciseId: 'warm-002',
          name: 'Activación Glútea',
          shortDescription: 'Despierta tus glúteos antes del entrenamiento',
          type: 'movilidad',
          zone: 'Glúteos',
          timeSeconds: 90,
          repetitions: '15 reps cada lado',
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ],
      principal: [
        {
          exerciseId: 'glute-001',
          name: 'Sentadillas Brasileñas',
          shortDescription: 'El secreto de las brasileñas para glúteos perfectos',
          type: 'fuerza',
          zone: 'Glúteos y piernas',
          timeSeconds: 60,
          repetitions: '20 reps x 3 series',
          restSeconds: 30,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: 'glute-002',
          name: 'Hip Thrust Explosivo',
          shortDescription: 'Máxima activación glútea',
          type: 'fuerza',
          zone: 'Glúteos',
          timeSeconds: 45,
          repetitions: '15 reps x 4 series',
          restSeconds: 20,
          kneeFriendly: true,
          order: 2
        },
        {
          exerciseId: 'glute-003',
          name: 'Patada de Burro',
          shortDescription: 'Aísla y define cada glúteo',
          type: 'fuerza',
          zone: 'Glúteos',
          timeSeconds: 40,
          repetitions: '15 reps cada lado',
          restSeconds: 15,
          kneeFriendly: true,
          order: 3
        }
      ],
      enfriamiento: [
        {
          exerciseId: 'stretch-002',
          name: 'Estiramiento Glúteo Profundo',
          shortDescription: 'Previene dolor y mejora recuperación',
          type: 'flexibilidad',
          zone: 'Glúteos y piernas',
          timeSeconds: 90,
          repetitions: '30 seg cada lado',
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ]
    }
  },
  {
    title: '✨ Adiós Celulitis - Piel Firme y Suave',
    description: 'Rutina anti-celulitis que combina ejercicios de tonificación y activación circulatoria. Mejora la apariencia de tu piel desde la primera semana.',
    category: 'hiit',
    difficulty: 'intermediate',
    duration: 30,
    instructor: INSTRUCTOR_ID,
    instructorName: 'Eva Strong Team',
    objectives: [
      'Reducir celulitis visible',
      'Mejorar circulación',
      'Tonificar piernas y glúteos',
      'Piel más firme y tersa'
    ],
    targetMuscles: ['Glúteos', 'Muslos', 'Piernas', 'Abdomen'],
    equipment: ['Colchoneta', 'Toalla'],
    accessLevel: 'premium',
    tags: ['celulitis', 'piel firme', 'piernas', 'glúteos', 'tonificar'],
    rating: 4.7,
    ratingCount: 1834,
    completedCount: 4127,
    blocks: {
      calentamiento: [
        {
          exerciseId: 'warm-003',
          name: 'Cardio Activador',
          shortDescription: 'Activa la circulación en todo el cuerpo',
          type: 'cardio_intenso',
          zone: 'Cuerpo completo',
          timeSeconds: 120,
          repetitions: '2 minutos',
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ],
      principal: [
        {
          exerciseId: 'anti-cel-001',
          name: 'Lunges Anti-Celulitis',
          shortDescription: 'Tonifica y mejora circulación en muslos',
          type: 'fuerza',
          zone: 'Piernas y glúteos',
          timeSeconds: 60,
          repetitions: '15 reps cada lado',
          restSeconds: 20,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: 'anti-cel-002',
          name: 'Puente Glúteo Pulsante',
          shortDescription: 'Activación profunda contra la celulitis',
          type: 'fuerza',
          zone: 'Glúteos y muslos',
          timeSeconds: 45,
          repetitions: '20 pulsos x 3 series',
          restSeconds: 15,
          kneeFriendly: true,
          order: 2
        }
      ],
      enfriamiento: [
        {
          exerciseId: 'stretch-003',
          name: 'Masaje Circulatorio',
          shortDescription: 'Estimula drenaje linfático',
          type: 'flexibilidad',
          zone: 'Piernas',
          timeSeconds: 90,
          repetitions: 'Masajear cada zona',
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ]
    }
  },
  {
    title: '👙 Cintura de Sirena - Curvas Perfectas',
    description: 'Define tu cintura y crea esas curvas envidiables. Ejercicios enfocados en oblicuos y core lateral para una figura de reloj de arena.',
    category: 'pilates',
    difficulty: 'beginner',
    duration: 20,
    instructor: INSTRUCTOR_ID,
    instructorName: 'Eva Strong Team',
    objectives: [
      'Reducir cintura',
      'Crear curvas naturales',
      'Tonificar oblicuos',
      'Mejorar postura'
    ],
    targetMuscles: ['Oblicuos', 'Cintura', 'Core lateral'],
    equipment: ['Colchoneta'],
    accessLevel: 'free',
    tags: ['cintura', 'curvas', 'oblicuos', 'figura reloj de arena', 'principiante'],
    rating: 4.8,
    ratingCount: 1923,
    completedCount: 6234,
    blocks: {
      calentamiento: [
        {
          exerciseId: 'warm-004',
          name: 'Rotaciones de Cintura',
          shortDescription: 'Calienta la zona de trabajo',
          type: 'movilidad',
          zone: 'Cintura y oblicuos',
          timeSeconds: 60,
          repetitions: '20 rotaciones',
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ],
      principal: [
        {
          exerciseId: 'waist-001',
          name: 'Twists Rusas',
          shortDescription: 'Define oblicuos y reduce cintura',
          type: 'fuerza',
          zone: 'Oblicuos',
          timeSeconds: 45,
          repetitions: '20 reps por lado',
          restSeconds: 15,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: 'waist-002',
          name: 'Plancha Lateral de Sirena',
          shortDescription: 'Tonifica los costados',
          type: 'fuerza',
          zone: 'Core lateral',
          timeSeconds: 30,
          repetitions: '30 seg cada lado',
          restSeconds: 15,
          kneeFriendly: true,
          order: 2
        }
      ],
      enfriamiento: [
        {
          exerciseId: 'stretch-004',
          name: 'Estiramiento Lateral',
          shortDescription: 'Alarga y define la cintura',
          type: 'flexibilidad',
          zone: 'Oblicuos y cintura',
          timeSeconds: 60,
          repetitions: '30 seg cada lado',
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ]
    }
  },
  {
    title: '💪 Brazos de Modelo - Tonifica sin Volumen',
    description: 'Brazos delgados, firmes y definidos sin perder feminidad. Ejercicios específicos para eliminar la flacidez y tonificar sin agrandar.',
    category: 'strength',
    difficulty: 'beginner',
    duration: 20,
    instructor: INSTRUCTOR_ID,
    instructorName: 'Eva Strong Team',
    objectives: [
      'Eliminar flacidez en brazos',
      'Tonificar sin agrandar',
      'Brazos definidos y femeninos',
      'Mejorar fuerza funcional'
    ],
    targetMuscles: ['Bíceps', 'Tríceps', 'Hombros', 'Antebrazos'],
    equipment: ['Mancuernas ligeras (1-3kg)', 'Botellas de agua como alternativa'],
    accessLevel: 'free',
    tags: ['brazos', 'tonificar', 'flacidez', 'femenino', 'sin volumen'],
    rating: 4.6,
    ratingCount: 1456,
    completedCount: 3892,
    blocks: {
      calentamiento: [
        {
          exerciseId: 'warm-005',
          name: 'Círculos de Brazos',
          shortDescription: 'Calienta hombros y brazos',
          type: 'movilidad',
          zone: 'Brazos y hombros',
          timeSeconds: 60,
          repetitions: '15 círculos cada dirección',
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ],
      principal: [
        {
          exerciseId: 'arms-001',
          name: 'Curl de Bíceps Femenino',
          shortDescription: 'Define bíceps sin agrandar',
          type: 'fuerza',
          zone: 'Bíceps',
          timeSeconds: 45,
          repetitions: '15 reps x 3 series',
          restSeconds: 20,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: 'arms-002',
          name: 'Tríceps Adiós Flacidez',
          shortDescription: 'Elimina la flacidez bajo el brazo',
          type: 'fuerza',
          zone: 'Tríceps',
          timeSeconds: 40,
          repetitions: '12 reps x 3 series',
          restSeconds: 15,
          kneeFriendly: true,
          order: 2
        }
      ],
      enfriamiento: [
        {
          exerciseId: 'stretch-005',
          name: 'Estiramiento de Brazos',
          shortDescription: 'Relaja y alarga músculos',
          type: 'flexibilidad',
          zone: 'Brazos completos',
          timeSeconds: 60,
          repetitions: '30 seg cada brazo',
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ]
    }
  },
  {
    title: '🔥 Quema Grasa Total - 500 Calorías en 30 Min',
    description: 'HIIT intensivo diseñado para mujeres. Quema grasa en todo el cuerpo mientras tonificas. Perfecto para acelerar tu metabolismo.',
    category: 'hiit',
    difficulty: 'advanced',
    duration: 30,
    instructor: INSTRUCTOR_ID,
    instructorName: 'Eva Strong Team',
    objectives: [
      'Quemar 500 calorías',
      'Acelerar metabolismo',
      'Tonificar cuerpo completo',
      'Mejorar resistencia cardiovascular'
    ],
    targetMuscles: ['Cuerpo completo', 'Core', 'Piernas', 'Brazos'],
    equipment: ['Colchoneta', 'Opcional: Mancuernas'],
    accessLevel: 'premium',
    tags: ['quemar grasa', 'hiit', 'calorías', 'cuerpo completo', 'avanzado'],
    rating: 4.9,
    ratingCount: 3421,
    completedCount: 7823,
    blocks: {
      calentamiento: [
        {
          exerciseId: 'warm-006',
          name: 'Saltos Activadores',
          shortDescription: 'Eleva el ritmo cardíaco',
          type: 'cardio_intenso',
          zone: 'Cuerpo completo',
          timeSeconds: 90,
          repetitions: '90 segundos',
          restSeconds: 0,
          kneeFriendly: false,
          order: 1
        }
      ],
      principal: [
        {
          exerciseId: 'hiit-001',
          name: 'Burpees Modificados',
          shortDescription: 'Máxima quema de calorías',
          type: 'cardio_intenso',
          zone: 'Cuerpo completo',
          timeSeconds: 40,
          repetitions: '40 seg trabajo / 20 seg descanso',
          restSeconds: 20,
          kneeFriendly: false,
          order: 1
        },
        {
          exerciseId: 'hiit-002',
          name: 'Mountain Climbers Explosivos',
          shortDescription: 'Quema grasa abdominal',
          type: 'cardio_intenso',
          zone: 'Core y piernas',
          timeSeconds: 40,
          repetitions: '40 seg trabajo / 20 seg descanso',
          restSeconds: 20,
          kneeFriendly: false,
          order: 2
        }
      ],
      enfriamiento: [
        {
          exerciseId: 'stretch-006',
          name: 'Recuperación Activa',
          shortDescription: 'Normaliza ritmo cardíaco',
          type: 'cardio_suave',
          zone: 'Cuerpo completo',
          timeSeconds: 120,
          repetitions: 'Caminar en el lugar',
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ]
    }
  },
  {
    title: '🧘‍♀️ Flexibilidad Total - Cuerpo de Bailarina',
    description: 'Gana flexibilidad, alarga músculos y mejora tu postura. Ideal para relajar después de entrenar o como rutina nocturna.',
    category: 'yoga',
    difficulty: 'beginner',
    duration: 25,
    instructor: INSTRUCTOR_ID,
    instructorName: 'Eva Strong Team',
    objectives: [
      'Mejorar flexibilidad',
      'Alargar músculos',
      'Relajar cuerpo y mente',
      'Mejorar postura'
    ],
    targetMuscles: ['Isquiotibiales', 'Espalda', 'Caderas', 'Hombros'],
    equipment: ['Colchoneta', 'Cojín (opcional)'],
    accessLevel: 'free',
    tags: ['flexibilidad', 'estiramiento', 'yoga', 'relajación', 'principiante'],
    rating: 4.7,
    ratingCount: 2134,
    completedCount: 5621,
    blocks: {
      calentamiento: [
        {
          exerciseId: 'warm-007',
          name: 'Respiración Consciente',
          shortDescription: 'Prepara cuerpo y mente',
          type: 'movilidad',
          zone: 'Respiración',
          timeSeconds: 90,
          repetitions: '10 respiraciones profundas',
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ],
      principal: [
        {
          exerciseId: 'flex-001',
          name: 'Estiramiento de Isquiotibiales',
          shortDescription: 'Alarga la parte posterior de las piernas',
          type: 'flexibilidad',
          zone: 'Piernas',
          timeSeconds: 60,
          repetitions: '60 segundos mantener',
          restSeconds: 10,
          kneeFriendly: true,
          order: 1
        },
        {
          exerciseId: 'flex-002',
          name: 'Apertura de Caderas',
          shortDescription: 'Libera tensión en caderas',
          type: 'flexibilidad',
          zone: 'Caderas',
          timeSeconds: 60,
          repetitions: '30 seg cada lado',
          restSeconds: 10,
          kneeFriendly: true,
          order: 2
        }
      ],
      enfriamiento: [
        {
          exerciseId: 'stretch-007',
          name: 'Postura del Niño',
          shortDescription: 'Relajación profunda',
          type: 'flexibilidad',
          zone: 'Espalda y caderas',
          timeSeconds: 120,
          repetitions: '2 minutos',
          restSeconds: 0,
          kneeFriendly: true,
          order: 1
        }
      ]
    }
  }
];

// Función para insertar rutinas
async function seedRoutines() {
  try {
    console.log('\n🌱 Iniciando seed de rutinas...\n');
    
    // Limpiar rutinas existentes (opcional - comentar si no quieres borrar)
    // await Routine.deleteMany({});
    // console.log('✓ Rutinas antiguas eliminadas\n');
    
    // Insertar nuevas rutinas
    for (const rutina of rutinasAtractivas) {
      const nuevaRutina = new Routine(rutina);
      await nuevaRutina.save();
      console.log(`✓ Creada: "${rutina.title}"`);
    }
    
    console.log(`\n🎉 ¡${rutinasAtractivas.length} rutinas creadas exitosamente!\n`);
    
    // Mostrar resumen
    console.log('📊 Resumen:');
    console.log(`   - Rutinas gratuitas: ${rutinasAtractivas.filter(r => r.accessLevel === 'free').length}`);
    console.log(`   - Rutinas premium: ${rutinasAtractivas.filter(r => r.accessLevel === 'premium').length}`);
    console.log(`   - Dificultad principiante: ${rutinasAtractivas.filter(r => r.difficulty === 'beginner').length}`);
    console.log(`   - Dificultad intermedia: ${rutinasAtractivas.filter(r => r.difficulty === 'intermediate').length}`);
    console.log(`   - Dificultad avanzada: ${rutinasAtractivas.filter(r => r.difficulty === 'advanced').length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear rutinas:', error);
    process.exit(1);
  }
}

// Ejecutar seed
seedRoutines();
