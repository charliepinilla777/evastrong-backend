const mongoose = require('mongoose');
const RoutineTemplate = require('../models/RoutineTemplate');

// ─── Exercise translation map ───────────────────────────────────────────────
const exerciseTranslations = {
  // Warm-up
  CAL_MARCHA_SUAVE: { nameEn: 'Gentle March in Place', shortDescriptionEn: 'Warm up with a slow march in place to wake up the legs' },
  CAL_MARCHA_SUAVE_SILLA: { nameEn: 'Chair Supported March', shortDescriptionEn: 'March gently in place holding a chair for support' },
  CAL_MARCHA_MUY_SUAVE: { nameEn: 'Very Gentle March', shortDescriptionEn: 'Extremely slow march to warm up safely' },
  CAL_MOV_ART: { nameEn: 'Shoulder & Hip Mobility', shortDescriptionEn: 'Open up joints with gentle shoulder and hip circles' },
  CAL_MOV_CUELLO_HOMBROS: { nameEn: 'Neck & Shoulder Mobility', shortDescriptionEn: 'Gentle circles for neck and shoulders to release tension' },
  CAL_MOVILIDAD_ARTIC: { nameEn: 'Joint Mobility', shortDescriptionEn: 'Dynamic circles to mobilize major joints before exercise' },
  CAL_CARDIO_SUAVE: { nameEn: 'Light Cardio Warm-Up', shortDescriptionEn: '3 minutes of easy movement to raise heart rate gently' },

  // Lower body – quads / glutes / hamstrings
  SENTADILLA_MEDIA: { nameEn: 'Half Squat', shortDescriptionEn: 'Controlled half squat keeping your back straight' },
  SENTADILLA_PROFUNDA: { nameEn: 'Deep Squat', shortDescriptionEn: 'Full-range squat for lower body strength' },
  SENTADILLA_PARCIAL: { nameEn: 'Partial Squat', shortDescriptionEn: 'Limited-range squat, ideal for beginners or sensitive knees' },
  SENTADILLA_COMPLETA: { nameEn: 'Full Squat', shortDescriptionEn: 'Deep squat with full range of motion for lower body power' },
  SENTADILLA_SILLA: { nameEn: 'Sit-to-Stand', shortDescriptionEn: 'Rise from a chair using your leg strength' },
  SENTADILLA_SUMO: { nameEn: 'Sumo Squat', shortDescriptionEn: 'Wide-stance squat to target inner thighs and glutes' },
  SENTARSE_LEVANTARSE_SILLA: { nameEn: 'Sit to Stand', shortDescriptionEn: 'Slowly sit and stand from a chair to build leg strength' },
  PUENTE_GLUTEOS: { nameEn: 'Glute Bridge', shortDescriptionEn: 'Lift hips from the floor, squeezing your glutes at the top' },
  PUENTE_UNA_PIERNA: { nameEn: 'Single-Leg Glute Bridge', shortDescriptionEn: 'Glute bridge lifting one leg at a time for extra challenge' },
  PATADA_GLUTEO_CUADRUPEDIA: { nameEn: 'All-Fours Glute Kick', shortDescriptionEn: 'Kick one leg back in a quadruped position to target the glute' },
  ABDUCCIONES_LATERALES: { nameEn: 'Side-Lying Hip Abduction', shortDescriptionEn: 'Lift the top leg while lying on your side to work outer hips' },
  ABDUCCION_CADERA_PIE: { nameEn: 'Standing Hip Abduction', shortDescriptionEn: 'Lift the leg out to the side while standing' },
  APERTURA_CADERA_SENTADA: { nameEn: 'Seated Hip Opening', shortDescriptionEn: 'Gentle hip rotation while seated to improve mobility' },
  ZANCADAS: { nameEn: 'Alternating Lunges', shortDescriptionEn: 'Step forward and lower your back knee toward the floor' },
  ZANCADA_ALTERNA: { nameEn: 'Alternating Lunge', shortDescriptionEn: 'Step forward and lower your back knee alternately' },
  ZANCADA_ATRAS: { nameEn: 'Reverse Lunge', shortDescriptionEn: 'Step backward into a lunge to reduce knee stress' },
  ELEV_TALONES: { nameEn: 'Heel Raises', shortDescriptionEn: 'Rise up on your toes to strengthen calves' },
  ELEVACION_TALONES_SILLA: { nameEn: 'Chair Heel Raises', shortDescriptionEn: 'Raise heels while holding a chair for safe calf work' },
  ELEV_TALONES_SENTADO: { nameEn: 'Seated Heel Raise', shortDescriptionEn: 'Raise heels while seated to work the calves gently' },
  EXT_RODILLA_SENTADA: { nameEn: 'Seated Knee Extension', shortDescriptionEn: 'Extend your knee while seated to strengthen the quadricep' },
  FLEXION_RODILLA_COLGANDO: { nameEn: 'Standing Knee Flexion', shortDescriptionEn: 'Curl the leg behind you while standing to work the hamstring' },
  PESO_MUERTO_RUMANO: { nameEn: 'Romanian Deadlift', shortDescriptionEn: 'Hip-hinge with straight legs to work hamstrings and glutes' },
  PESO_MUERTO_RUMANO_LIGERO: { nameEn: 'Light Romanian Deadlift', shortDescriptionEn: 'Gentle hip-hinge for seniors to strengthen the posterior chain' },
  STEP_CORTO_ADELANTE: { nameEn: 'Short Forward Step', shortDescriptionEn: 'Small step forward and back to engage hip flexors' },
  STEP_LATERAL: { nameEn: 'Lateral Step', shortDescriptionEn: 'Step to the side and back for hip and glute activation' },
  STEP_ESCALON_BAJO: { nameEn: 'Low Step', shortDescriptionEn: 'Step up and down on a low platform to build leg strength' },
  PASO_LATERAL: { nameEn: 'Lateral Step', shortDescriptionEn: 'Step side to side to activate the outer thighs' },
  PASO_LATERAL_SUAVE: { nameEn: 'Gentle Lateral Step', shortDescriptionEn: 'Slow side steps to improve stability and coordination' },
  MARCHA_RAPIDA: { nameEn: 'Brisk March', shortDescriptionEn: 'Pick up the pace for a more intense cardio burst' },
  MARCHA_EQUILIBRIO: { nameEn: 'Balance March', shortDescriptionEn: 'March with a pause on each leg to challenge your balance' },
  APOYO_UNIPODAL_SILLA: { nameEn: 'Single-Leg Stand with Chair', shortDescriptionEn: 'Balance on one leg using a chair for support' },
  CAMINATA_LATERAL_CORTA: { nameEn: 'Short Lateral Walk', shortDescriptionEn: 'Small lateral steps to improve balance and coordination' },
  BRAZOS_ACTIVOS: { nameEn: 'Active Arms', shortDescriptionEn: 'Rhythmic arm movements to keep the upper body engaged' },

  // Upper body / core
  FLEXIONES_PISO: { nameEn: 'Floor Push-Up', shortDescriptionEn: 'Classic push-up on the floor for upper body strength' },
  FLEXIONES_INCLINADAS: { nameEn: 'Incline Push-Up', shortDescriptionEn: 'Push-up on an elevated surface for upper body work' },
  FLEXION_INCLINADA: { nameEn: 'Incline Push-Up', shortDescriptionEn: 'Push-up on an inclined surface — easier on the joints' },
  FLEXIONES_PARED: { nameEn: 'Wall Push-Up', shortDescriptionEn: 'Push against the wall to build upper body strength safely' },
  FLEX_PARED: { nameEn: 'Wall Push-Up', shortDescriptionEn: 'Low-impact push-up variation against a wall' },
  REMO_BANDA: { nameEn: 'Resistance Band Row', shortDescriptionEn: 'Pull a resistance band toward your waist to strengthen the back' },
  PLANCHA_RODILLAS: { nameEn: 'Knee Plank', shortDescriptionEn: 'Plank on your knees to engage the core with less intensity' },
  PLANCHA_COMPLETA: { nameEn: 'Full Plank', shortDescriptionEn: 'High plank on hands and feet to strengthen the entire core' },
  PLANCHA_MESA: { nameEn: 'Tabletop Plank', shortDescriptionEn: 'Tabletop position engaging core and glutes simultaneously' },
  PLANCHA_LATERAL_RODILLA: { nameEn: 'Side Plank on Knee', shortDescriptionEn: 'Modified side plank on the knee to strengthen the lateral core' },
  CRUNCH_BASICO: { nameEn: 'Basic Crunch', shortDescriptionEn: 'Controlled ab crunch to activate and strengthen the core' },
  DEAD_BUG: { nameEn: 'Dead Bug', shortDescriptionEn: 'Opposite arm-leg extension lying on your back to stabilize the core' },
  MONTAÑA_CLIMBER: { nameEn: 'Mountain Climber', shortDescriptionEn: 'Alternate knee drives in a plank position for core and cardio' },
  STEP_JACK_SIN_SALTO: { nameEn: 'No-Jump Jumping Jack', shortDescriptionEn: 'Classic jumping jack motion performed without leaving the ground' },
  JUMPING_JACK_BAJO_IMPACTO: { nameEn: 'Low-Impact Jumping Jack', shortDescriptionEn: 'Jumping jack adapted to reduce impact on the joints' },

  // Cool-down / stretches
  ESTIR_ISQUIOS: { nameEn: 'Hamstring Stretch', shortDescriptionEn: 'Stretch the back of your legs to reduce tension' },
  ESTIR_ISQUIOS_TUMBADO: { nameEn: 'Lying Hamstring Stretch', shortDescriptionEn: 'Lying stretch to lengthen the hamstrings and lower back' },
  ESTIR_GLUTEOS: { nameEn: 'Glute Stretch', shortDescriptionEn: 'Seated or lying glute stretch to release tightness' },
  ESTIR_CUADRICEPS_APOYO: { nameEn: 'Supported Quad Stretch', shortDescriptionEn: 'Hold a chair and stretch the front of your thigh' },
  ESTIR_PECHO: { nameEn: 'Chest Stretch', shortDescriptionEn: 'Open the chest to release tension from the upper body' },
  ESTIR_ABDOMEN: { nameEn: 'Ab Stretch', shortDescriptionEn: 'Cobra-like stretch to release the abdominal muscles' },
  ESTIR_SUAVE_PIERNAS: { nameEn: 'Gentle Leg Stretch', shortDescriptionEn: 'Ease tension in the legs with a light static stretch' },
  ESTIR_COMPLETO: { nameEn: 'Full Body Stretch', shortDescriptionEn: 'Head-to-toe stretch to cool down and improve flexibility' },
  RESPIRACION_RELAX: { nameEn: 'Relaxing Breathing', shortDescriptionEn: 'Diaphragmatic breathing to lower heart rate and relax the body' },
};

// ─── Template translation map ────────────────────────────────────────────────
const templateTranslations = {
  RUTINA_A1: {
    nameEn: 'Fitness Start 15 min',
    descriptionEn: 'A beginner full-body routine for young women. Simple movements to build your base strength and get comfortable working out.',
  },
  RUTINA_A2: {
    nameEn: 'Fitness Start 10 min',
    descriptionEn: 'A short beginner routine for young women. Get moving with easy exercises to build confidence and endurance.',
  },
  RUTINA_A3: {
    nameEn: 'Core Express 12 min',
    descriptionEn: 'A core-focused beginner routine with low-impact exercises to strengthen your abs and glutes safely.',
  },
  RUTINA_B1: {
    nameEn: 'Happy Knees 10 min',
    descriptionEn: 'A gentle routine designed for women with sensitive knees. All exercises are knee-friendly and low-impact.',
  },
  RUTINA_B2: {
    nameEn: 'Soft Knees 12 min',
    descriptionEn: 'A knee-friendly routine with seated and supported exercises to build leg strength without stressing the joints.',
  },
  RUTINA_C1: {
    nameEn: 'Full Body Intermediate 20 min',
    descriptionEn: 'A full-body intermediate routine combining strength and cardio for women aged 18–35 looking for a real challenge.',
  },
  RUTINA_C2: {
    nameEn: 'Glutes on Fire 15 min',
    descriptionEn: 'A glute-focused intermediate routine to sculpt and tone your lower body with progressive exercises.',
  },
  RUTINA_D1: {
    nameEn: 'Gentle Legs 15 min',
    descriptionEn: 'A lower-body routine for women with sensitive knees, using low-impact movements to build strength safely.',
  },
  RUTINA_E1: {
    nameEn: 'Active Reset 12 min',
    descriptionEn: 'A short reactivation routine for women 36–55 to get moving again with controlled full-body exercises.',
  },
  RUTINA_E2: {
    nameEn: 'Full Body 15 min 40+',
    descriptionEn: 'A complete full-body routine tailored for women in their 40s, combining strength and mobility work.',
  },
  RUTINA_F1: {
    nameEn: 'Cared Knee 12 min',
    descriptionEn: 'A knee-friendly routine for women 36–55, focused on gentle strengthening without any impact.',
  },
  RUTINA_G1: {
    nameEn: 'Full Strength 20 min',
    descriptionEn: 'An intermediate strength routine for women 36–55 that challenges the whole body with compound movements.',
  },
  RUTINA_G2: {
    nameEn: 'Cardio + Strength 18 min',
    descriptionEn: 'A mixed cardio and strength routine for women 36–55 to boost metabolism and tone the body.',
  },
  RUTINA_H1: {
    nameEn: 'Full Body Low Impact 18 min',
    descriptionEn: 'A low-impact full-body routine for women 36–55 with sensitive knees, using supported and gentle exercises.',
  },
  RUTINA_I1: {
    nameEn: 'Active 55+ 10 min',
    descriptionEn: 'A gentle 10-minute routine for women over 55 to maintain mobility, strength, and balance safely.',
  },
  RUTINA_I2: {
    nameEn: 'Balance 55+ 12 min',
    descriptionEn: 'A balance-focused routine for women over 55 to improve stability and reduce the risk of falls.',
  },
  RUTINA_J1: {
    nameEn: 'Controlled Strength 15 min',
    descriptionEn: 'A mild strength routine for active women over 55 to build muscle and maintain functional fitness.',
  },
  RUTINA_J2: {
    nameEn: 'Moderate Cardio 55+ 15 min',
    descriptionEn: 'A 15-minute cardio session designed for women over 55 with easy-to-follow movements to keep the heart healthy.',
  },
};

// ─── Helper: add EN fields to exercises in a block array ────────────────────
function localizeBlockExercises(exercises) {
  return exercises.map(ex => {
    const t = exerciseTranslations[ex.exerciseId];
    if (!t) return ex;
    return { ...ex, nameEn: t.nameEn, shortDescriptionEn: t.shortDescriptionEn };
  });
}

// ─── Main migration function ─────────────────────────────────────────────────
async function addRoutineTranslationsEn() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong');
  console.log('✅ Conectado a MongoDB');

  const templateIds = Object.keys(templateTranslations);
  let updated = 0;
  let notFound = 0;

  for (const templateId of templateIds) {
    const { nameEn, descriptionEn } = templateTranslations[templateId];

    // Load current template to get block exercises
    const template = await RoutineTemplate.findOne({ templateId });

    if (!template) {
      console.log(`⚠️  No encontrado: ${templateId}`);
      notFound++;
      continue;
    }

    const templateObj = template.toObject();
    const calentamiento = localizeBlockExercises(templateObj.blocks.calentamiento || []);
    const principal = localizeBlockExercises(templateObj.blocks.principal || []);
    const enfriamiento = localizeBlockExercises(templateObj.blocks.enfriamiento || []);

    await RoutineTemplate.findOneAndUpdate(
      { templateId },
      {
        $set: {
          nameEn,
          descriptionEn,
          'blocks.calentamiento': calentamiento,
          'blocks.principal': principal,
          'blocks.enfriamiento': enfriamiento,
        },
      },
      { new: true }
    );

    console.log(`✅ Actualizado: ${templateId} → "${nameEn}"`);
    updated++;
  }

  console.log(`\n📊 Resultado: ${updated} actualizados, ${notFound} no encontrados`);
  console.log('🏁 Migración de traducciones de rutinas completada');
}

// ─── Export & CLI entry point ────────────────────────────────────────────────
module.exports = { addRoutineTranslationsEn };

if (require.main === module) {
  require('dotenv').config();

  addRoutineTranslationsEn()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('💥 Error:', err);
      process.exit(1);
    });
}
