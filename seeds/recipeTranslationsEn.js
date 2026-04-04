/**
 * Seed: Traducciones al inglés de las recetas existentes.
 * Usa imageUrl como clave única para identificar cada receta.
 * Solo actualiza los campos EN — no toca el contenido en español.
 */
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

const translations = [

  // ──────────────────────────────────────────────
  // FREE
  // ──────────────────────────────────────────────
  {
    imageUrl: 'https://images.pexels.com/photos/1438192/pexels-photo-1438192.jpeg',
    nameEn: 'Protein Oats for Glutes',
    descriptionEn: 'A hearty oatmeal packed with protein, healthy fats and complex carbs. Ideal as a pre- or post-workout breakfast to fuel and tone your glutes.',
    ingredientsEn: [
      { name: 'rolled oats',              amount: '80',       unit: 'g'   },
      { name: 'milk or plant-based drink', amount: '250',      unit: 'ml'  },
      { name: 'ripe banana',              amount: '1',        unit: ''    },
      { name: 'peanut butter',            amount: '20',       unit: 'g'   },
      { name: 'chia seeds',               amount: '15',       unit: 'g'   },
      { name: 'unsweetened cocoa powder', amount: '10',       unit: 'g'   },
      { name: 'cinnamon',                 amount: 'to taste', unit: ''    },
    ],
    stepsEn: [
      'Add the oats, milk, cocoa and cinnamon to a pot and mix.',
      'Cook over medium heat for 5–8 minutes until it thickens.',
      'Turn off the heat and add the mashed banana, peanut butter and chia seeds.',
      'Serve and, if you like, sprinkle a bit more cinnamon on top.',
    ],
    tagsEn: ['oats', 'protein', 'breakfast', 'glutes', 'free', 'peanut butter'],
  },

  {
    imageUrl: 'https://images.pexels.com/photos/3731474/pexels-photo-3731474.jpeg',
    nameEn: 'Banana & Yogurt Overnight Oats',
    descriptionEn: 'A no-cook overnight oat that you prep the night before. Creamy, filling and full of protein — perfect for busy mornings.',
    ingredientsEn: [
      { name: 'oats',                      amount: '60',       unit: 'g'  },
      { name: 'plain Greek yogurt',         amount: '150',      unit: 'g'  },
      { name: 'milk or plant-based drink',  amount: '100',      unit: 'ml' },
      { name: 'banana',                     amount: '1',        unit: ''   },
      { name: 'ground flaxseed',            amount: '5',        unit: 'g'  },
      { name: 'honey or stevia',            amount: '5',        unit: 'g'  },
      { name: 'cinnamon',                   amount: 'to taste', unit: ''   },
    ],
    stepsEn: [
      'In a jar, mix the oats, yogurt, milk, flaxseed and honey.',
      'Add the banana slices and a touch of cinnamon.',
      'Cover and refrigerate for at least 4 hours or overnight.',
      'Enjoy cold the next day.',
    ],
    tagsEn: ['oats', 'overnight', 'banana', 'yogurt', 'breakfast', 'free', 'meal prep'],
  },

  {
    imageUrl: 'https://images.pexels.com/photos/1435747/pexels-photo-1435747.jpeg',
    nameEn: 'Glowing Skin Snack — Yogurt, Berries & Cocoa',
    descriptionEn: 'A quick anti-inflammatory snack combining Greek yogurt, antioxidant-rich berries and cocoa. Great for skin health and satisfying sweet cravings.',
    ingredientsEn: [
      { name: 'plain Greek yogurt',       amount: '200',      unit: 'g'  },
      { name: 'mixed berries (blueberries, strawberries, blackberries)', amount: '50', unit: 'g' },
      { name: 'unsweetened cocoa powder', amount: '5',        unit: 'g'  },
      { name: 'chia seeds',               amount: '5',        unit: 'g'  },
      { name: 'honey or stevia',          amount: '5',        unit: 'g'  },
      { name: 'chopped nuts',             amount: '5',        unit: 'g'  },
    ],
    stepsEn: [
      'Place the yogurt in a bowl.',
      'Add the berries, chia seeds and nuts.',
      'Sprinkle the cocoa powder on top.',
      'Sweeten with honey or stevia and mix gently.',
    ],
    tagsEn: ['snack', 'yogurt', 'berries', 'skin', 'free', 'anti-inflammatory'],
  },

  {
    imageUrl: 'https://images.pexels.com/photos/5938241/pexels-photo-5938241.jpeg',
    nameEn: 'Anti-inflammatory Glowing Skin Smoothie',
    descriptionEn: 'A vibrant green smoothie with spinach, pineapple and turmeric. Full of antioxidants to reduce inflammation and promote radiant skin.',
    ingredientsEn: [
      { name: 'fresh spinach',                    amount: '1',        unit: 'cup' },
      { name: 'pineapple chunks',                 amount: '150',      unit: 'g'   },
      { name: 'small avocado (half)',              amount: '1/2',      unit: ''    },
      { name: 'coconut water',                    amount: '200',      unit: 'ml'  },
      { name: 'fresh ginger',                     amount: '5',        unit: 'g'   },
      { name: 'fresh turmeric or turmeric powder', amount: '5g / ½',  unit: 'tsp' },
      { name: 'black pepper',                     amount: '1 pinch',  unit: ''    },
      { name: 'ice',                              amount: 'to taste', unit: ''    },
    ],
    stepsEn: [
      'Add all the ingredients to a blender.',
      'Blend until smooth and creamy.',
      'Adjust thickness with more coconut water if needed.',
      'Serve immediately.',
    ],
    tagsEn: ['smoothie', 'anti-inflammatory', 'skin', 'green', 'free', 'turmeric'],
  },

  {
    imageUrl: 'https://images.pexels.com/photos/7509521/pexels-photo-7509521.jpeg',
    nameEn: 'Anti-inflammatory Shot for Dark Circles & Skin',
    descriptionEn: 'A powerful morning shot with orange, ginger and turmeric to fight inflammation, boost immunity and brighten your complexion.',
    ingredientsEn: [
      { name: 'fresh orange juice (2 oranges)', amount: '~150', unit: 'ml'  },
      { name: 'fresh ginger',                  amount: '5',     unit: 'g'   },
      { name: 'fresh turmeric or powder',       amount: '5g / 1', unit: 'tsp' },
      { name: 'water',                          amount: '50',    unit: 'ml'  },
      { name: 'black pepper',                   amount: '1 pinch', unit: '' },
    ],
    stepsEn: [
      'Blend the orange juice with the ginger, turmeric, water and pepper.',
      'Strain if you prefer a smoother texture.',
      'Pour into small shot glasses.',
      'Have 1 shot a day, preferably in the morning.',
    ],
    tagsEn: ['shot', 'drink', 'skin', 'anti-inflammatory', 'free', 'morning', 'turmeric'],
  },

  // ──────────────────────────────────────────────
  // BASIC
  // ──────────────────────────────────────────────
  {
    imageUrl: 'https://images.pexels.com/photos/5665660/pexels-photo-5665660.jpeg',
    nameEn: 'Egg, Avocado & Spinach Bowl',
    descriptionEn: 'A nutritious high-protein breakfast bowl with scrambled eggs, creamy avocado and iron-rich spinach. Quick to make and perfect for muscle recovery.',
    ingredientsEn: [
      { name: 'eggs',           amount: '2',        unit: ''   },
      { name: 'egg white',      amount: '1 extra',  unit: ''   },
      { name: 'avocado (half)', amount: '1/2',      unit: ''   },
      { name: 'fresh spinach',  amount: '1',        unit: 'cup'},
      { name: 'cherry tomatoes', amount: '1/4',     unit: 'cup'},
      { name: 'olive oil',      amount: '5',        unit: 'ml' },
      { name: 'salt and pepper', amount: 'to taste', unit: ''  },
    ],
    stepsEn: [
      'Sauté the spinach with the olive oil in a pan.',
      'Add the eggs and the extra white, scramble until cooked.',
      'Serve in a bowl.',
      'Add sliced avocado and cherry tomatoes, then season with salt and pepper.',
    ],
    tagsEn: ['breakfast', 'eggs', 'avocado', 'high-protein', 'basic', 'low-carb'],
  },

  {
    imageUrl: 'https://images.pexels.com/photos/4109138/pexels-photo-4109138.jpeg',
    nameEn: 'Anti-inflammatory Chicken Sandwich',
    descriptionEn: 'A balanced sandwich with shredded chicken, avocado and a mustard-mayo spread on whole grain bread. High in protein and anti-inflammatory ingredients.',
    ingredientsEn: [
      { name: 'whole grain or sourdough bread', amount: '2',        unit: 'slices' },
      { name: 'cooked shredded chicken breast', amount: '100',      unit: 'g'      },
      { name: 'avocado (half)',                 amount: '1/2',      unit: ''       },
      { name: 'lettuce leaves',                 amount: '2',        unit: ''       },
      { name: 'tomato slices',                  amount: '2',        unit: ''       },
      { name: 'light mayonnaise',               amount: '10',       unit: 'g'      },
      { name: 'Dijon mustard',                  amount: '5',        unit: 'g'      },
      { name: 'olive oil',                      amount: '5',        unit: 'ml'     },
      { name: 'lemon juice',                    amount: 'to taste', unit: ''       },
      { name: 'salt and pepper',                amount: 'to taste', unit: ''       },
    ],
    stepsEn: [
      'Mix the mayonnaise with the mustard and a bit of lemon juice.',
      'Spread this mixture over the bread slices.',
      'Build the sandwich with lettuce, chicken, tomato and avocado.',
      'Drizzle with olive oil, salt and pepper to taste.',
    ],
    tagsEn: ['lunch', 'sandwich', 'chicken', 'avocado', 'basic', 'anti-inflammatory'],
  },

  {
    imageUrl: 'https://images.pexels.com/photos/4106480/pexels-photo-4106480.jpeg',
    nameEn: 'High-Protein Stir-Fried Tofu or Chicken',
    descriptionEn: 'A versatile stir-fry loaded with vegetables and lean protein. Light, fast and packed with nutrients — perfect for a clean dinner.',
    ingredientsEn: [
      { name: 'firm tofu or chicken breast in cubes', amount: '150',      unit: 'g'  },
      { name: 'mixed vegetables (broccoli, carrot, bell pepper)', amount: '1', unit: 'cup' },
      { name: 'low-sodium soy sauce',                 amount: '10',       unit: 'ml' },
      { name: 'olive or coconut oil',                 amount: '5',        unit: 'ml' },
      { name: 'garlic and ginger',                    amount: 'to taste', unit: ''   },
      { name: 'pepper',                               amount: 'to taste', unit: ''   },
    ],
    stepsEn: [
      'Heat the oil in a pan.',
      'Sauté the garlic and ginger, then add the tofu or chicken and brown.',
      'Add the vegetables and soy sauce, cook for 5–7 minutes.',
      'Serve as is or with 1/2 cup brown rice if desired.',
    ],
    tagsEn: ['dinner', 'stir-fry', 'tofu', 'chicken', 'basic', 'high-protein', 'low-carb'],
  },

  {
    imageUrl: 'https://images.pexels.com/photos/1431305/pexels-photo-1431305.jpeg',
    nameEn: 'Greek Yogurt with Peanut Butter & Berries',
    descriptionEn: 'A protein-rich snack combining creamy Greek yogurt, peanut butter and antioxidant berries. Satisfying and perfect for post-workout recovery.',
    ingredientsEn: [
      { name: 'plain Greek yogurt',           amount: '200', unit: 'g' },
      { name: 'peanut butter',                amount: '15',  unit: 'g' },
      { name: 'berries',                      amount: '50',  unit: 'g' },
      { name: '70% dark chocolate (melted or chunks)', amount: '5', unit: 'g' },
    ],
    stepsEn: [
      'Place the yogurt in a bowl.',
      'Add the peanut butter and gently swirl it in.',
      'Top with the berries.',
      'Finish with the dark chocolate on top.',
    ],
    tagsEn: ['snack', 'yogurt', 'peanut butter', 'berries', 'basic', 'post-workout'],
  },

  // ──────────────────────────────────────────────
  // PREMIUM
  // ──────────────────────────────────────────────
  {
    imageUrl: 'https://images.pexels.com/photos/3296273/pexels-photo-3296273.jpeg',
    nameEn: 'Salmon & Quinoa Power Salad',
    descriptionEn: 'A complete meal with grilled salmon, protein-rich quinoa and fresh vegetables. Packed with omega-3s and essential nutrients for muscle and skin.',
    ingredientsEn: [
      { name: 'grilled salmon',             amount: '100', unit: 'g'    },
      { name: 'cooked quinoa (~30g dry)',    amount: '60',  unit: 'g'    },
      { name: 'spinach or mixed greens',     amount: '1',   unit: 'cup'  },
      { name: 'cucumber',                   amount: '1/4', unit: ''     },
      { name: 'grated carrot',              amount: '1/4', unit: 'cup'  },
      { name: 'sunflower seeds',            amount: '1',   unit: 'tbsp' },
      { name: 'olive oil',                  amount: '10',  unit: 'ml'   },
      { name: 'lemon juice (half lemon)',    amount: '1/2', unit: ''     },
      { name: 'salt and pepper',            amount: 'to taste', unit: '' },
    ],
    stepsEn: [
      'Place the greens on a plate.',
      'Add the cooked quinoa, cucumber and carrot.',
      'Flake the salmon on top.',
      'Dress with olive oil, lemon, salt and pepper, then finish with sunflower seeds.',
    ],
    tagsEn: ['lunch', 'salmon', 'quinoa', 'salad', 'premium', 'omega-3', 'high-protein'],
  },

  {
    imageUrl: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    nameEn: 'Chickpea & Veggie Bowl for Skin & Muscle',
    descriptionEn: 'A plant-based power bowl with chickpeas, brown rice, broccoli and avocado. Rich in plant protein, fibre and anti-inflammatory spices.',
    ingredientsEn: [
      { name: 'cooked chickpeas',  amount: '120',      unit: 'g'   },
      { name: 'cooked brown rice', amount: '1/2',      unit: 'cup' },
      { name: 'steamed broccoli',  amount: '1',        unit: 'cup' },
      { name: 'grated carrot',     amount: '1/4',      unit: 'cup' },
      { name: 'avocado (quarter)', amount: '1/4',      unit: ''    },
      { name: 'olive oil',         amount: '10',       unit: 'ml'  },
      { name: 'lemon juice',       amount: 'to taste', unit: ''    },
      { name: 'turmeric and pepper', amount: 'to taste', unit: ''  },
    ],
    stepsEn: [
      'In a bowl, add the brown rice as the base.',
      'Top with chickpeas, broccoli and carrot.',
      'Add sliced avocado.',
      'Dress with olive oil, lemon, turmeric and pepper, then toss lightly.',
    ],
    tagsEn: ['lunch', 'chickpea', 'bowl', 'vegan', 'premium', 'anti-inflammatory', 'plant-protein'],
  },

  {
    imageUrl: 'https://images.pexels.com/photos/3731471/pexels-photo-3731471.jpeg',
    nameEn: 'Light Egg White & Veggie Dinner',
    descriptionEn: 'A light, low-calorie dinner rich in protein. Fluffy egg whites with colourful vegetables — ready in under 15 minutes.',
    ingredientsEn: [
      { name: 'egg whites',        amount: '4',        unit: ''   },
      { name: 'whole egg',         amount: '1',        unit: ''   },
      { name: 'mixed vegetables (spinach, mushrooms, bell pepper)', amount: '1', unit: 'cup' },
      { name: 'olive oil',         amount: '5',        unit: 'ml' },
      { name: 'salt, pepper and oregano', amount: 'to taste', unit: '' },
    ],
    stepsEn: [
      'Sauté the vegetables in olive oil until soft.',
      'Beat the egg whites and whole egg with salt, pepper and oregano.',
      'Pour the mixture over the veggies and cook over medium heat until set.',
      'Serve hot.',
    ],
    tagsEn: ['dinner', 'egg white', 'low-calorie', 'premium', 'high-protein', 'quick'],
  },

  // ──────────────────────────────────────────────
  // SNACKS — PRE & POST WORKOUT
  // ──────────────────────────────────────────────
  {
    imageUrl: 'https://images.pexels.com/photos/4198014/pexels-photo-4198014.jpeg',
    nameEn: 'Banana with Peanut Butter (Pre-Workout)',
    descriptionEn: 'The simplest pre-workout snack — fast carbs from banana plus healthy fats from peanut butter to fuel your glute and leg sessions.',
    ingredientsEn: [
      { name: 'medium banana',       amount: '1',  unit: ''  },
      { name: 'natural peanut butter', amount: '15', unit: 'g' },
    ],
    stepsEn: [
      'Peel the banana.',
      'Spread the peanut butter on top or slice the banana and add the peanut butter over the slices.',
      'Eat 30–45 minutes before your glute/leg workout.',
    ],
    tagsEn: ['snack', 'pre-workout', 'banana', 'peanut butter', 'free', 'quick'],
  },

  {
    imageUrl: 'https://images.pexels.com/photos/4144202/pexels-photo-4144202.jpeg',
    nameEn: 'Greek Yogurt with Fruit (Pre-Workout)',
    descriptionEn: 'A light pre-workout snack combining high-protein Greek yogurt with natural sugars from fruit to give you a sustained energy boost before training.',
    ingredientsEn: [
      { name: 'high-protein plain Greek yogurt', amount: '150',      unit: 'g'  },
      { name: 'apple (half) or berries',         amount: '1/2',      unit: ''   },
      { name: 'honey or stevia',                 amount: 'to taste', unit: ''   },
    ],
    stepsEn: [
      'Place the yogurt in a bowl.',
      'Add the chopped fruit.',
      'Sweeten with honey or stevia.',
      'Eat 45–60 minutes before your workout.',
    ],
    tagsEn: ['snack', 'pre-workout', 'yogurt', 'fruit', 'free', 'high-protein'],
  },

  {
    imageUrl: 'https://images.pexels.com/photos/4109131/pexels-photo-4109131.jpeg',
    nameEn: 'Whole Grain Toast with Egg (Pre-Workout)',
    descriptionEn: 'A complete pre-workout snack with complex carbs and quality protein to keep you energised throughout your entire session.',
    ingredientsEn: [
      { name: 'whole grain bread',  amount: '1',        unit: 'slice' },
      { name: 'egg',               amount: '1',        unit: ''      },
      { name: 'olive oil',         amount: '5',        unit: 'ml'    },
      { name: 'salt and pepper',   amount: 'to taste', unit: ''      },
    ],
    stepsEn: [
      'Toast the whole grain bread.',
      'In a pan with a bit of oil, cook the egg (fried, scrambled or over-easy).',
      'Place the egg on top of the toast and season with salt and pepper.',
      'Eat 45–60 minutes before training.',
    ],
    tagsEn: ['snack', 'pre-workout', 'egg', 'toast', 'basic', 'high-protein'],
  },

  {
    imageUrl: 'https://images.pexels.com/photos/6546027/pexels-photo-6546027.jpeg',
    nameEn: 'Quick Rice with Tuna (Post-Workout)',
    descriptionEn: 'A fast post-workout recovery meal with simple carbs to replenish glycogen and lean protein from tuna to kickstart muscle repair.',
    ingredientsEn: [
      { name: 'cooked white rice',              amount: '80',       unit: 'g'  },
      { name: 'canned tuna in water (drained)', amount: '80',       unit: 'g'  },
      { name: 'olive oil',                      amount: '5',        unit: 'ml' },
      { name: 'salt, pepper and lemon',         amount: 'to taste', unit: ''   },
    ],
    stepsEn: [
      'In a bowl, mix the cooked rice with the tuna.',
      'Add olive oil, salt, pepper and a bit of lemon juice.',
      'Stir well and serve.',
      'Eat within 60 minutes after your workout.',
    ],
    tagsEn: ['snack', 'post-workout', 'tuna', 'rice', 'basic', 'high-protein', 'recovery'],
  },

  {
    imageUrl: 'https://images.pexels.com/photos/4109139/pexels-photo-4109139.jpeg',
    nameEn: 'Chicken & Avocado Wrap (Post-Workout)',
    descriptionEn: 'A satisfying post-workout wrap with shredded chicken, creamy avocado and a Greek yogurt dressing — ideal for muscle recovery and staying full.',
    ingredientsEn: [
      { name: 'whole wheat tortilla',        amount: '1',        unit: 'medium' },
      { name: 'cooked shredded chicken breast', amount: '80',    unit: 'g'      },
      { name: 'avocado (quarter)',            amount: '1/4',      unit: ''       },
      { name: 'plain Greek yogurt',          amount: '20',       unit: 'g'      },
      { name: 'salt, pepper and lemon',      amount: 'to taste', unit: ''       },
    ],
    stepsEn: [
      'Mix the shredded chicken with the Greek yogurt, salt, pepper and lemon juice.',
      'Place the mixture on the tortilla.',
      'Add the avocado slices.',
      'Roll up the wrap and cut in half.',
    ],
    tagsEn: ['snack', 'post-workout', 'chicken', 'wrap', 'premium', 'high-protein', 'avocado'],
  },

  {
    imageUrl: 'https://images.pexels.com/photos/1438084/pexels-photo-1438084.jpeg',
    nameEn: 'Protein Shake with Oats (Post-Workout)',
    descriptionEn: 'A classic post-workout shake combining whey or plant protein, oats and banana. Fast, convenient and exactly what your muscles need after training.',
    ingredientsEn: [
      { name: 'milk or plant-based drink', amount: '200',      unit: 'ml'  },
      { name: 'protein powder (1 scoop)',  amount: '20–25',    unit: 'g'   },
      { name: 'oats',                     amount: '30',       unit: 'g'   },
      { name: 'banana (half)',             amount: '1/2',      unit: ''    },
      { name: 'ice',                      amount: 'to taste', unit: ''    },
    ],
    stepsEn: [
      'Add the milk, protein powder, oats and banana to the blender.',
      'Add ice to taste.',
      'Blend until smooth and creamy.',
      'Drink immediately after your workout.',
    ],
    tagsEn: ['smoothie', 'post-workout', 'protein shake', 'oats', 'premium', 'recovery'],
  },
];

async function loadRecipeTranslationsEn() {
  console.log('Conectando a MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evastrong');

  console.log('📖 Cargando traducciones EN de recetas...');
  let updated = 0, notFound = 0;

  for (const t of translations) {
    const result = await Recipe.findOneAndUpdate(
      { imageUrl: t.imageUrl },
      {
        $set: {
          nameEn:        t.nameEn,
          descriptionEn: t.descriptionEn,
          ingredientsEn: t.ingredientsEn,
          stepsEn:       t.stepsEn,
          tagsEn:        t.tagsEn,
        },
      },
      { new: true }
    );

    if (result) {
      console.log(`  ✅ ${t.nameEn}`);
      updated++;
    } else {
      console.log(`  ⚠️  No encontrada (imageUrl no coincide): ${t.nameEn}`);
      notFound++;
    }
  }

  console.log(`\n📊 Traducciones: ${updated} actualizadas, ${notFound} no encontradas`);
  if (notFound > 0) {
    console.log('  💡 Verifica que las recetas existan y que el imageUrl coincida exactamente.');
  }
}

module.exports = { loadRecipeTranslationsEn };

if (require.main === module) {
  require('dotenv').config();
  loadRecipeTranslationsEn()
    .then(() => process.exit(0))
    .catch(err => { console.error('❌', err); process.exit(1); });
}
