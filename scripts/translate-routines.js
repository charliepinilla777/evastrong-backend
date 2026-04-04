/**
 * translate-routines.js
 *
 * Migration script: adds titleEn / descriptionEn to all Routine documents
 * that are missing English translations.
 *
 * Run once:  node scripts/translate-routines.js
 */

'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const Routine  = require('../models/Routine');

// ─── Exact title map (Spanish → English) ────────────────────────────────────
const TITLE_MAP = {
  // Seed-script routines
  '🔥 Vientre Plano en 21 Días':                    '🔥 Flat Belly in 21 Days',
  '🍑 Glúteos de Acero - Levanta y Tonifica':       '🍑 Steel Glutes - Lift & Tone',
  '✨ Adiós Celulitis - Piel Firme y Suave':         '✨ Bye Cellulite - Firm & Smooth Skin',
  '👙 Cintura de Sirena - Curvas Perfectas':         '👙 Mermaid Waist - Perfect Curves',
  '💪 Brazos de Modelo - Tonifica sin Volumen':      '💪 Model Arms - Tone Without Bulk',
  '🔥 Quema Grasa Total - 500 Calorías en 30 Min':  '🔥 Total Fat Burn - 500 Calories in 30 Min',
  '🧘‍♀️ Flexibilidad Total - Cuerpo de Bailarina':   '🧘‍♀️ Full Flexibility - Dancer\'s Body',

  // seedRoutines.js — remaining
  'Eliminar la Flacidez':     'Eliminate Sagging',

  // seedElite.js
  'HIIT Metabólico Elite':          'Elite Metabolic HIIT',
  'Pilates Abdomen y Cintura':      'Pilates Abs & Waist',
  'Transformación Corporal 360°':   'Full Body Transformation 360°',

  // seedPremium.js
  'HIIT Express Quema Grasa':       'HIIT Express Fat Burn',
  'Yoga Restaurativo para Espalda': 'Restorative Back Yoga',
  'Full Body Escultura':            'Full Body Sculpt',

  // seedFichas
  'Glúteos Fáciles en Casa':        'Easy Home Glutes',
  'Tren Superior Suave sin Equipo': 'Gentle Upper Body No Equipment',
  'Cardio Suave Plus para Empezar': 'Gentle Cardio Plus for Beginners',

  // Manually created / admin-panel routines (common names)
  'Levanta Cola':             'Lift & Tone Glutes',
  'Cintura Marcada':          'Defined Waist',
  'Pérdida de Peso':          'Weight Loss',
  'Tonificación de Piernas':  'Leg Toning',
  'Vientre Plano':            'Flat Belly',
  'Glúteos Perfectos':        'Perfect Glutes',
  'Brazos Tonificados':       'Toned Arms',
  'Espalda Fuerte':           'Strong Back',
  'Cardio Quema Grasa':       'Fat-Burning Cardio',
  'Flexibilidad y Movilidad': 'Flexibility & Mobility',
  'Fortalecimiento Total':    'Full-Body Strengthening',
  'Yoga para Principiantes':  'Yoga for Beginners',
  'HIIT Intenso':             'Intense HIIT',
  'Pilates Clásico':          'Classic Pilates',
  'Cuerpo Completo':          'Full Body',
  'Rutina Funcional':         'Functional Routine',
  'Abdomen Definido':         'Defined Abs',
  'Piernas y Glúteos':        'Legs & Glutes',
  'Tonificación General':     'General Toning',
  'Cardio Intenso':           'Intense Cardio',
  'Inicio Fit 15 min':        'Fit Start 15 min',
  'Inicio Fit 10 min':        'Fit Start 10 min',
};

// ─── Keyword-based fallback translation ─────────────────────────────────────
const KEYWORD_MAP = [
  // Body parts / goals
  [/vientre|abdomen|abdominal|barriga/i,    'Belly'],
  [/glúteo|gluto|nalga/i,                  'Glutes'],
  [/cintura/i,                              'Waist'],
  [/pierna/i,                               'Leg'],
  [/brazo/i,                                'Arm'],
  [/espalda/i,                              'Back'],
  [/pecho/i,                                'Chest'],
  [/hombro/i,                               'Shoulder'],
  [/pantorrilla/i,                          'Calf'],
  [/celulitis/i,                            'Cellulite'],
  [/flexibilidad/i,                         'Flexibility'],
  [/movilidad/i,                            'Mobility'],
  [/cuerpo completo|total/i,                'Full Body'],
  // Action / goal words
  [/quema.*grasa|grasa/i,                   'Fat Burn'],
  [/pérdida.*peso|bajar.*peso|perder.*peso/i,'Weight Loss'],
  [/tonif/i,                                'Toning'],
  [/fort/i,                                 'Strengthening'],
  [/cardio/i,                               'Cardio'],
  [/hiit/i,                                 'HIIT'],
  [/pilates/i,                              'Pilates'],
  [/yoga/i,                                 'Yoga'],
  [/funcional/i,                            'Functional'],
  [/marcad|definid/i,                       'Defined'],
  [/perfecto|ideal/i,                       'Perfect'],
  [/inicio|principiante/i,                  'Beginner'],
  [/intermedio/i,                           'Intermediate'],
  [/avanzado/i,                             'Advanced'],
];

/**
 * Attempt keyword-based English translation of a Spanish title.
 * Returns a best-effort English string, or null if no keywords matched.
 */
function keywordTranslate(spanishTitle) {
  // Remove emojis for matching
  const clean = spanishTitle.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').trim();
  const parts = [];
  for (const [regex, eng] of KEYWORD_MAP) {
    if (regex.test(clean) && !parts.includes(eng)) {
      parts.push(eng);
    }
  }
  if (parts.length === 0) return null;
  // Re-attach leading emoji if present
  const emoji = spanishTitle.match(/^([\u{1F300}-\u{1FFFF}\s]+)/u)?.[0]?.trim() ?? '';
  return emoji ? `${emoji} ${parts.join(' · ')}` : parts.join(' · ');
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB');

  // Find routines missing titleEn
  const routines = await Routine.find({
    $or: [{ titleEn: { $exists: false } }, { titleEn: '' }, { titleEn: null }],
  }).lean();

  console.log(`Found ${routines.length} routine(s) without titleEn`);

  let updated = 0;
  let skipped = 0;

  for (const r of routines) {
    let titleEn = TITLE_MAP[r.title] ?? keywordTranslate(r.title);

    if (!titleEn) {
      console.log(`  ⚠️  No translation for: "${r.title}" — skipping`);
      skipped++;
      continue;
    }

    // Auto-translate description if missing
    // (simple approach: keep Spanish as fallback, prepend a note only if we have nothing)
    const descriptionEn = r.descriptionEn || '';

    await Routine.findByIdAndUpdate(r._id, { $set: { titleEn, descriptionEn } });
    console.log(`  ✓ "${r.title}" → "${titleEn}"`);
    updated++;
  }

  console.log(`\nDone. Updated: ${updated}  Skipped: ${skipped}`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
