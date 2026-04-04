/**
 * translate-recipes.js
 *
 * Migration script: adds nameEn / descriptionEn / ingredientsEn / stepsEn / tagsEn
 * to all Recipe documents that are missing English translations.
 *
 * Run once:  node scripts/translate-recipes.js
 */

'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

// ─── Exact name map (Spanish → English) ─────────────────────────────────────
const NAME_MAP = {
  // Weekly plan items (D2–D7 prefixes and meal-type prefixes)
  'Desayuno – Omelette ligero + tostada integral':        'Breakfast – Light Omelette + Whole Grain Toast',
  'Snack mañana – Yogur griego con semillas':             'Morning Snack – Greek Yogurt with Seeds',
  'Almuerzo – Ensalada ligera de pollo':                  'Lunch – Light Chicken Salad',
  'Snack tarde – Zanahoria con hummus':                   'Afternoon Snack – Carrot with Hummus',
  'Cena – Tacos de lechuga con pavo':                     'Dinner – Turkey Lettuce Tacos',
  'Post-entreno – Shake proteína pérdida de grasa':       'Post-Workout – Fat-Loss Protein Shake',
  'D2 – Desayuno avena para glúteos':                     'D2 – Breakfast Glute Oatmeal',
  'D2 – Snack post entreno yogur proteico con fruta':     'D2 – Post-Workout Snack Protein Yogurt with Fruit',
  'D2 – Batido noche recuperación':                       'D2 – Night Recovery Smoothie',
  'D3 – Snack frutos rojos y nueces':                     'D3 – Snack Berries & Walnuts',
  'D3 – Almuerzo ensalada salmón y aguacate':             'D3 – Lunch Salmon & Avocado Salad',
  'D3 – Cena crema de calabaza y zanahoria':              'D3 – Dinner Pumpkin & Carrot Cream Soup',
  'D4 – Desayuno bowl avena y manzana':                   'D4 – Breakfast Oat & Apple Bowl',
  'D4 – Snack mañana manzana con almendras':              'D4 – Morning Snack Apple with Almonds',
  'D4 – Snack tarde yogur light con frutos rojos':        'D4 – Afternoon Snack Light Yogurt with Berries',
  'D4 – Cena sopa de verduras y pollo':                   'D4 – Dinner Veggie & Chicken Soup',
  'D5 – Snack pre entreno tostada con plátano':           'D5 – Pre-Workout Snack Toast with Banana',
  'D6 – Desayuno yogur piel radiante':                    'D6 – Breakfast Radiant Skin Yogurt',
  'D6 – Snack mañana zanahoria y pepino':                 'D6 – Morning Snack Carrot & Cucumber',
  'D6 – Snack tarde té verde con limón y fruta':          'D6 – Afternoon Snack Green Tea with Lemon & Fruit',
  'D6 – Cena ensalada de atún y aguacate':                'D6 – Dinner Tuna & Avocado Salad',
  'D7 – Desayuno bowl mexicano saludable':                'D7 – Breakfast Healthy Mexican Bowl',
  'D7 – Snack mañana yogur con fruta pequeña':            'D7 – Morning Snack Yogurt with Small Fruit',
  'D7 – Almuerzo ensalada de lentejas y pollo':           'D7 – Lunch Lentil & Chicken Salad',
  'D7 – Snack tarde frutos secos':                        'D7 – Afternoon Snack Mixed Nuts',
  'D7 – Cena bowl ligero verduras y huevo':               'D7 – Dinner Light Veggie & Egg Bowl',

  // seedRecipes.js
  'Avena proteica para glúteos':                         'High-Protein Glute Oatmeal',
  'Overnight oats banana y yogur':                       'Banana & Yogurt Overnight Oats',
  'Snack piel radiante (yogur, frutos rojos y cacao)':   'Radiant Skin Snack (Yogurt, Berries & Cacao)',
  'Batido antiinflamatorio piel radiante':               'Anti-Inflammatory Radiant Skin Smoothie',
  'Shot antiinflamatorio para ojeras y piel':            'Anti-Inflammatory Shot for Dark Circles & Skin',
  'Bowl de huevo, aguacate y espinaca':                  'Egg, Avocado & Spinach Bowl',
  'Sándwich de pollo antiinflamatorio':                  'Anti-Inflammatory Chicken Sandwich',
  'Tofu o pollo salteado alto en proteína':              'High-Protein Sautéed Tofu or Chicken',
  'Yogur griego con mantequilla de maní y frutos rojos': 'Greek Yogurt with Peanut Butter & Berries',
  'Tortilla proteica de huevo y espinaca':               'Protein Egg & Spinach Omelette',
  'Overnight oats para glúteos':                         'Glute-Building Overnight Oats',
  'Bowl de pollo, camote y brócoli':                     'Chicken, Sweet Potato & Broccoli Bowl',
  'Ensalada de lentejas para pierna fuerte':             'Lentil Salad for Strong Legs',
  'Ensalada power de salmón y quinoa':                   'Power Salmon & Quinoa Salad',
  'Bowl de garbanzos y verduras para piel y músculo':    'Chickpea & Veggie Bowl for Skin & Muscle',
  'Cena ligera de clara de huevo y verduras':            'Light Egg White & Veggie Dinner',
  'Pasta integral con carne magra':                      'Whole Grain Pasta with Lean Meat',
  'Banana con mantequilla de maní (pre entreno)':        'Banana with Peanut Butter (Pre-Workout)',
  'Yogur griego con fruta (pre entreno)':                'Greek Yogurt with Fruit (Pre-Workout)',
  'Tostada integral con huevo (pre entreno)':            'Whole Grain Toast with Egg (Pre-Workout)',
  'Arroz con atún rápido (post entreno)':                'Quick Rice with Tuna (Post-Workout)',
  'Wrap de pollo y aguacate (post entreno)':             'Chicken & Avocado Wrap (Post-Workout)',
  'Shake de proteína con avena (post entreno)':          'Protein Shake with Oats (Post-Workout)',
  'Omelette ligero de claras y vegetales':               'Light Egg White & Veggie Omelette',
  'Avena fit alta en proteína':                          'High-Protein Fit Oatmeal',
  'Ensalada ligera de pollo':                            'Light Chicken Salad',
  'Bowl vegetariano de judías pintas y arroz':           'Vegetarian Pinto Bean & Rice Bowl',
  'Tacos de lechuga con pavo':                           'Turkey Lettuce Tacos',
  'Ensalada de garbanzos rápida':                        'Quick Chickpea Salad',
  'Snack de zanahoria y hummus':                         'Carrot & Hummus Snack',
  'Yogur griego con semillas':                           'Greek Yogurt with Seeds',
  'Batido verde quema grasa':                            'Fat-Burning Green Smoothie',
  'Cena de salmón y quinoa para glúteos':                'Salmon & Quinoa Dinner for Glutes',

  // seedRecipesV2.js
  'Tostadas de aguacate y huevo':                        'Avocado & Egg Toast',
  'Huevos revueltos a la mexicana fit':                  'Fit Mexican Scrambled Eggs',
  'Quesadilla desayuno alta en proteína':                'High-Protein Breakfast Quesadilla',
  'Bowl de frutas cítricas y yogur':                     'Citrus Fruit & Yogurt Bowl',
  'Avena con cacao y frutos rojos':                      'Oatmeal with Cacao & Berries',
  'Ensalada de garbanzos mediterránea':                  'Mediterranean Chickpea Salad',
  'Ensalada de atún estilo español':                     'Spanish-Style Tuna Salad',
  'Bowl burrito ligero de pollo':                        'Light Chicken Burrito Bowl',
  'Pollo guisado fit con verduras':                      'Fit Chicken Stew with Veggies',
  'Cocido madrileño ligero alto en proteína':            'Light High-Protein Madrid Stew',
  'Tacos de pescado al horno':                           'Baked Fish Tacos',
  'Sopa de lentejas reconfortante':                      'Comforting Lentil Soup',
  'Crema de tomate y albahaca ligera':                   'Light Tomato & Basil Cream Soup',
  'Ensalada templada de quinoa y espinaca':              'Warm Quinoa & Spinach Salad',
  'Revuelto de claras con pavo':                         'Egg White Scramble with Turkey',
  'Caldo de pollo casero antiinflamatorio':              'Homemade Anti-Inflammatory Chicken Broth',
  'Pepino con limón y chile':                            'Cucumber with Lemon & Chili',
  'Palitos de verduras con hummus':                      'Veggie Sticks with Hummus',
  'Manzana con mantequilla de maní':                     'Apple with Peanut Butter',
  'Yogur con cacao y nueces':                            'Yogurt with Cacao & Walnuts',
  'Batido verde detox suave':                            'Gentle Detox Green Smoothie',
  'Batido de frutos rojos antioxidante':                 'Antioxidant Berry Smoothie',
  'Agua saborizada con frutas y menta':                  'Fruit & Mint Infused Water',
  'Café proteico sin azúcar':                            'Sugar-Free Protein Coffee',

  // seedRecipesV3.js
  'Pollo al horno con verduras arcoíris':                'Rainbow Roasted Chicken & Veggies',
  'Filete de pescado con ensalada de col':               'Fish Fillet with Coleslaw',
  'Pasta integral con atún y tomate':                    'Whole Grain Pasta with Tuna & Tomato',
  'Salteado de ternera magra con brócoli':               'Lean Beef & Broccoli Stir-Fry',
  'Ensalada de pollo, frijoles negros y aguacate':       'Chicken, Black Bean & Avocado Salad',
  'Ensalada de garbanzos con atún':                      'Chickpea & Tuna Salad',
  'Zoodles de calabacín con pollo':                      'Zucchini Zoodles with Chicken',
  'Ensalada de lentejas con pollo y manzana':            'Lentil Salad with Chicken & Apple',
  'Caldo de albóndigas ligero':                          'Light Meatball Broth',
  'Bowl veggie de tofu y quinoa':                        'Veggie Tofu & Quinoa Bowl',
  'Arepa integral con huevo y aguacate':                 'Whole Grain Arepa with Egg & Avocado',
  'Overnight oats de mango y chía':                      'Mango & Chia Overnight Oats',
  'Tostadas con ricotta y frutos rojos':                 'Toast with Ricotta & Berries',
  'Rollitos de jamón de pavo y queso':                   'Turkey Ham & Cheese Roll-Ups',
  'Mini bowl de fruta y yogur':                          'Mini Fruit & Yogurt Bowl',
  'Ensalada caprese ligera':                             'Light Caprese Salad',
  'Garbanzos tostados especiados':                       'Spiced Roasted Chickpeas',
  'Barritas caseras de avena y frutos secos':            'Homemade Oat & Nut Bars',
  'Latte dorado (golden milk)':                          'Golden Milk Latte',
  'Té frío de frutos rojos':                             'Iced Berry Tea',
  'Batido proteico de café frío':                        'Cold Brew Protein Smoothie',
  'Tortilla francesa de espinaca y queso light':         'Spinach & Light Cheese French Omelette',
  'Pechuga a la plancha con puré de coliflor':           'Grilled Chicken Breast with Cauliflower Mash',
};

// ─── Exact description map (Spanish → English) ──────────────────────────────
const DESCRIPTION_MAP = {
  'Avena proteica para glúteos':
    'Energizing and nutritious breakfast specially formulated to boost glute muscle growth. Rich in protein, fiber, and healthy fats.',
  'Overnight oats banana y yogur':
    'No-cook breakfast ready from the night before. Loaded with protein, probiotics, and slow-release energy for peak performance.',
  'Snack piel radiante (yogur, frutos rojos y cacao)':
    'Antioxidant snack that takes care of your skin from within. Combines Greek yogurt protein with berry antioxidants and the power of cacao.',
  'Batido antiinflamatorio piel radiante':
    'Green smoothie packed with anti-inflammatory nutrients. Perfect for reducing inflammation, hydrating your skin, and starting the day with energy.',
  'Shot antiinflamatorio para ojeras y piel':
    'Concentrated shot with turmeric, ginger, and orange. Powerful anti-inflammatory blend to fight dark circles, improve skin tone, and boost your immune system.',
  'Bowl de huevo, aguacate y espinaca':
    'Complete breakfast with high-quality protein, healthy fats, and essential micronutrients. Ideal for sustained energy and muscle definition.',
  'Sándwich de pollo antiinflamatorio':
    'Satisfying and anti-inflammatory lunch with lean chicken, avocado, and Dijon mustard. Perfect for post-workout recovery.',
  'Tofu o pollo salteado alto en proteína':
    'Light and versatile dinner, suitable for vegans and omnivores alike. High in protein, low in carbs, and ready in under 20 minutes.',
  'Yogur griego con mantequilla de maní y frutos rojos':
    'Irresistible protein snack combining creamy Greek yogurt with intense peanut flavor and fresh berries. Ready in 5 minutes.',
  'Tortilla proteica de huevo y espinaca':
    'High-protein omelette with whole eggs, egg whites, and spinach. A complete and satisfying breakfast to fuel your muscles.',
  'Overnight oats para glúteos':
    'Slow-release carbs, protein, and healthy fats combined to fuel glute development. Prepare the night before and enjoy in the morning.',
  'Bowl de pollo, camote y brócoli':
    'Complete bowl with high-quality protein, complex carbs, and vegetables. Ideal for post-workout recovery and glute development.',
  'Ensalada de lentejas para pierna fuerte':
    'Iron-rich lentil salad with rice for a sustained energy boost. Designed to support strong, toned legs.',
  'Ensalada power de salmón y quinoa':
    'Complete salad with omega-3 from salmon, complete protein from quinoa, and antioxidants from greens. Ideal for recovery and radiant skin.',
  'Bowl de garbanzos y verduras para piel y músculo':
    'Plant-based bowl with chickpeas rich in vegetable protein, combined with anti-inflammatory vegetables. Ideal for radiant skin and lean muscle.',
  'Cena ligera de clara de huevo y verduras':
    'Very light low-calorie dinner, high in protein and low in fat. Perfect for maintaining muscle mass while losing weight.',
  'Pasta integral con carne magra':
    'Classic Italian comfort made healthy: whole grain pasta with lean meat and homemade tomato sauce. Ideal for active and hungry days.',
  'Banana con mantequilla de maní (pre entreno)':
    'Simple and highly effective pre-workout combo. Fast-release carbs from banana plus protein and healthy fats from peanut butter.',
  'Yogur griego con fruta (pre entreno)':
    'Light pre-workout snack with protein, probiotics, and natural carbs for sustained energy during your session.',
  'Tostada integral con huevo (pre entreno)':
    'Classic pre-workout breakfast with slow-release carbs and protein to sustain energy throughout the session.',
  'Arroz con atún rápido (post entreno)':
    'Super quick and practical post-workout meal: white rice for glycogen replenishment and tuna for immediate muscle recovery.',
  'Wrap de pollo y aguacate (post entreno)':
    'Complete post-workout wrap with lean protein from chicken, healthy fats from avocado, and whole grain carbs. Ready in 10 minutes.',
  'Shake de proteína con avena (post entreno)':
    'Post-workout recovery shake with complete protein, oats for glycogen replenishment, and banana for potassium.',
  'Omelette ligero de claras y vegetales':
    'Light egg white and vegetable omelette, low in calories and high in protein. Perfect dinner for weight-loss days.',
  'Avena fit alta en proteína':
    'High-protein oatmeal with Greek yogurt and low-calorie plant milk. Ideal for high-volume training days.',
  'Ensalada ligera de pollo':
    'Classic light chicken salad with fresh greens. Simple, complete, and perfect for busy days.',
  'Bowl vegetariano de judías pintas y arroz':
    'Economical and complete vegetarian bowl with pinto beans and rice providing complementary proteins.',
  'Tacos de lechuga con pavo':
    'Low-carb tacos using lettuce leaves instead of tortillas. Crispy, fresh, and high in protein from turkey.',
  'Ensalada de garbanzos rápida':
    'Quick chickpea salad ready in 5 minutes. Great plant-based protein source, rich in fiber and filling.',
  'Snack de zanahoria y hummus':
    'Crunchy and satisfying snack with vegetable fiber from carrot and plant protein from hummus.',
  'Yogur griego con semillas':
    'Simple snack with probiotic protein from Greek yogurt and anti-inflammatory omega-3 from seeds.',
  'Batido verde quema grasa':
    'Fat-burning green smoothie with cucumber, green apple, and spinach. Low in sugar, high in fiber and nutrients.',
  'Cena de salmón y quinoa para glúteos':
    'Premium dinner designed for glute recovery: omega-3 from salmon, complete protein from quinoa, and essential vitamins from asparagus.',
  'Tostadas de aguacate y huevo':
    'Light and filling breakfast with healthy fats from avocado and protein from egg. Ideal to start the day with energy without overdoing the calories.',
  'Huevos revueltos a la mexicana fit':
    'Fit version of classic Mexican scrambled eggs: high in protein, low in fat, and ready in minutes. Perfect before leg or glute day.',
  'Quesadilla desayuno alta en proteína':
    'Crispy protein breakfast quesadilla with turkey ham, low-fat cheese, and spinach. Quick and satisfying.',
  'Bowl de frutas cítricas y yogur':
    'Fresh and light breakfast with probiotic protein from Greek yogurt and vitamin C from citrus fruits.',
  'Avena con cacao y frutos rojos':
    'Guilt-free indulgent oatmeal with cacao and berries. Warm, comforting, and packed with antioxidants.',
  'Ensalada de garbanzos mediterránea':
    'Mediterranean-inspired chickpea salad with cucumber, tomato, and lemon dressing. Refreshing, filling, and plant-based.',
  'Ensalada de atún estilo español':
    'Classic Spanish tuna salad with potato, hard-boiled egg, and green beans. Satisfying and full of complete protein.',
  'Bowl burrito ligero de pollo':
    'All the flavors of a burrito in a healthy bowl: grilled chicken, brown rice, black beans, and pico de gallo.',
  'Pollo guisado fit con verduras':
    'Comforting homemade-style chicken stew with vegetables. Low in fat and loaded with nutrients.',
  'Cocido madrileño ligero alto en proteína':
    'Light version of the classic Madrid stew, high in protein. Comforting and nutritious for cold days.',
  'Tacos de pescado al horno':
    'Baked fish tacos with light coleslaw and corn tortillas. Low in calories and loaded with omega-3.',
  'Sopa de lentejas reconfortante':
    'Warming comforting lentil soup, rich in plant protein and iron. Perfect for colder days.',
  'Crema de tomate y albahaca ligera':
    'Light and comforting cream of tomato and basil soup. Low in calories and packed with vitamin C and antioxidants.',
  'Ensalada templada de quinoa y espinaca':
    'Warm quinoa and spinach salad with bell pepper and mushrooms. Complete, filling, and full of plant protein.',
  'Revuelto de claras con pavo':
    'High-protein egg white scramble with turkey strips. Low in fat and perfect for leaning out.',
  'Caldo de pollo casero antiinflamatorio':
    'Homemade anti-inflammatory chicken broth that comforts and nourishes. Rich in collagen and minerals.',
  'Pepino con limón y chile':
    'Refreshing Mexican-style snack, practically zero calories. Hydrating and ideal between meals.',
  'Palitos de verduras con hummus':
    'Classic veggie sticks with hummus snack. Crunchy, satisfying, and loaded with fiber and plant protein.',
  'Manzana con mantequilla de maní':
    'Simple and nutritious snack with natural carbs from apple and healthy fats and protein from peanut butter.',
  'Yogur con cacao y nueces':
    'Indulgent yet healthy snack with probiotic protein from yogurt, antioxidants from cacao, and omega-3 from walnuts.',
  'Batido verde detox suave':
    'Gentle detox smoothie with cucumber, green apple, and spinach. Hydrating, low in sugar, and ideal for cleansing days.',
  'Batido de frutos rojos antioxidante':
    'Antioxidant-packed berry smoothie with Greek yogurt for extra protein. Delicious, vibrant, and skin-nourishing.',
  'Agua saborizada con frutas y menta':
    'Fresh and calorie-free infused water with citrus fruits and mint. Ideal for staying hydrated all day.',
  'Café proteico sin azúcar':
    'Sugar-free protein coffee — the perfect pre-workout boost combining caffeine energy with muscle-supporting protein.',
  'Pollo al horno con verduras arcoíris':
    'Juicy baked chicken breast with a colorful tray of roasted vegetables. Light, complete, and loaded with vitamins. Ideal for weight loss without sacrificing flavor.',
  'Filete de pescado con ensalada de col':
    'Grilled fish with crispy coleslaw and carrot salad. Low in calories and high in omega-3 if using salmon, ideal for skin and heart health.',
  'Pasta integral con atún y tomate':
    'Simple and complete pasta with tuna and tomato. High in protein and complex carbs for an energy-packed meal.',
  'Salteado de ternera magra con brócoli':
    'Asian-inspired lean beef and broccoli stir-fry. High in iron, zinc, and protein for muscle recovery.',
  'Ensalada de pollo, frijoles negros y aguacate':
    'Complete and satisfying chicken salad with black beans and avocado. Rich in complete protein, fiber, and healthy fats.',
  'Ensalada de garbanzos con atún':
    'Quick and filling chickpea and tuna salad. Excellent source of plant and animal protein with minimal prep time.',
  'Zoodles de calabacín con pollo':
    'Low-carb zucchini noodles with grilled chicken. Light, fresh, and perfect for days when you want to reduce carbohydrate intake.',
  'Ensalada de lentejas con pollo y manzana':
    'Unique combination of warm lentils, grilled chicken, and sweet apple. Rich in iron, protein, and antioxidants.',
  'Caldo de albóndigas ligero':
    'Comforting light meatball broth with vegetable broth and lean meat. Low in calories and high in protein and minerals.',
  'Bowl veggie de tofu y quinoa':
    'Complete plant-based bowl with tofu protein and all the amino acids from quinoa. Ideal for vegetarians seeking muscle gain.',
  'Arepa integral con huevo y aguacate':
    'Traditional arepa reinvented with whole grain masa, egg, and avocado. High in protein and healthy fats.',
  'Overnight oats de mango y chía':
    'Tropical overnight oats with mango and chia seeds. Refreshing, loaded with fiber, and perfect for summer mornings.',
  'Tostadas con ricotta y frutos rojos':
    'Elegant and nutritious breakfast with ricotta protein and antioxidants from berries. Refined yet simple.',
  'Rollitos de jamón de pavo y queso':
    'Ultra-quick no-cook snack of turkey ham and low-fat cheese roll-ups. High in protein and zero prep time.',
  'Mini bowl de fruta y yogur':
    'Small and balanced snack with probiotic yogurt and fresh fruit. Light, refreshing, and perfect at any time of day.',
  'Ensalada caprese ligera':
    'Light version of the Italian classic with fresh mozzarella, tomato, and basil. Elegant, refreshing, and Mediterranean-healthy.',
  'Garbanzos tostados especiados':
    'Crispy spiced roasted chickpeas, a healthy alternative to chips. Rich in protein, fiber, and completely plant-based.',
  'Barritas caseras de avena y frutos secos':
    'Homemade oat and nut bars with no added sugar. Perfect pre-workout snack or healthy breakfast on the go.',
  'Latte dorado (golden milk)':
    'Anti-inflammatory golden milk latte with turmeric, ginger, and black pepper. Ideal for reducing inflammation and improving sleep quality.',
  'Té frío de frutos rojos':
    'Refreshing iced berry tea loaded with antioxidants. Perfect for staying hydrated and caring for your skin in summer.',
  'Batido proteico de café frío':
    'Cold brew protein smoothie combining the energy of coffee with muscle-supporting protein. Ideal pre-workout or morning boost.',
  'Tortilla francesa de espinaca y queso light':
    'Classic French omelette with spinach and light cheese. Simple, high in protein, and ready in less than 5 minutes.',
  'Pechuga a la plancha con puré de coliflor':
    'Light dinner with grilled chicken breast and creamy cauliflower mash — a low-carb alternative to mashed potatoes.',
};

// ─── Ingredient name translations ───────────────────────────────────────────
const INGREDIENT_NAME_MAP = {
  // Proteins
  'avena en hojuelas': 'rolled oats',
  'avena': 'oats',
  'banana madura': 'ripe banana',
  'banana en rodajas': 'sliced banana',
  'banana mediana': 'medium banana',
  'banana pequeña': 'small banana',
  'banana': 'banana',
  'plátano en rodajas': 'sliced banana',
  'mantequilla de maní': 'peanut butter',
  'mantequilla de maní natural': 'natural peanut butter',
  'semillas de chía': 'chia seeds',
  'semillas de chía o linaza': 'chia or flaxseeds',
  'semillas de linaza molida': 'ground flaxseed',
  'semillas de linaza': 'flaxseeds',
  'semillas de girasol': 'sunflower seeds',
  'cacao en polvo sin azúcar': 'unsweetened cocoa powder',
  'canela': 'cinnamon',
  'yogur griego natural': 'plain Greek yogurt',
  'yogur griego natural alto en proteína': 'high-protein plain Greek yogurt',
  'yogur griego light': 'light Greek yogurt',
  'yogur griego': 'Greek yogurt',
  'leche o bebida vegetal': 'milk or plant-based drink',
  'leche o bebida vegetal baja en calorías': 'low-calorie milk or plant-based drink',
  'leche o bebida vegetal sin azúcar': 'unsweetened milk or plant-based drink',
  'bebida vegetal sin azúcar': 'unsweetened plant-based drink',
  'bebida vegetal': 'plant-based milk',
  'miel o stevia': 'honey or stevia',
  'stevia': 'stevia',
  'stevia o gotas de vainilla': 'stevia or vanilla drops',
  'proteína en polvo (opcional)': 'protein powder (optional)',
  'proteína en polvo': 'protein powder',
  'proteína en polvo sabor vainilla': 'vanilla protein powder',
  'proteína en polvo (sabor neutro o vainilla)': 'protein powder (neutral or vanilla flavor)',
  // Eggs
  'huevos': 'eggs',
  'huevos enteros': 'whole eggs',
  'huevo entero': 'whole egg',
  'huevo': 'egg',
  'clara de huevo': 'egg white',
  'claras de huevo': 'egg whites',
  // Vegetables
  'espinaca fresca': 'fresh spinach',
  'espinaca picada': 'chopped spinach',
  'espinaca': 'spinach',
  'tomate cherry': 'cherry tomatoes',
  'tomate picado': 'diced tomato',
  'tomate en cubos': 'diced tomato',
  'tomate en rodajas': 'sliced tomato',
  'tomates grandes maduros': 'large ripe tomatoes',
  'tomate': 'tomato',
  'pimentón en tiras': 'bell pepper strips',
  'pimentón en cubos': 'diced bell pepper',
  'pimentón': 'bell pepper',
  'cebolla morada': 'red onion',
  'cebolla picada': 'chopped onion',
  'cebolla': 'onion',
  'ajo y jengibre': 'garlic and ginger',
  'ajo': 'garlic',
  'diente de ajo': 'garlic clove',
  'jengibre fresco': 'fresh ginger',
  'jengibre en polvo': 'ground ginger',
  'jengibre': 'ginger',
  'brócoli al vapor': 'steamed broccoli',
  'brócoli': 'broccoli',
  'zanahoria en bastones': 'carrot sticks',
  'zanahoria en rodajas': 'sliced carrot',
  'zanahoria en cubos': 'diced carrot',
  'zanahoria rallada': 'grated carrot',
  'zanahoria': 'carrot',
  'pepino en bastones': 'cucumber sticks',
  'pepino en rodajas': 'sliced cucumber',
  'pepino en cubos': 'diced cucumber',
  'pepino mediano': 'medium cucumber',
  'pepino': 'cucumber',
  'calabacín en cubos': 'diced zucchini',
  'calabacín grande en espiral (zoodles)': 'large zucchini spiralized (zoodles)',
  'calabacín': 'zucchini',
  'coliflor': 'cauliflower',
  'champiñones en láminas': 'sliced mushrooms',
  'champiñones': 'mushrooms',
  'lechuga': 'lettuce',
  'hojas grandes de lechuga': 'large lettuce leaves',
  'mezcla de lechugas': 'mixed lettuce',
  'mezcla de hojas verdes': 'mixed greens',
  'col rallada': 'shredded cabbage',
  'repollo': 'cabbage',
  'apio picado': 'chopped celery',
  'apio en bastones': 'celery sticks',
  'rama de apio': 'celery stalk',
  'apio': 'celery',
  'calabaza (ahuyama) en cubos': 'pumpkin (butternut squash) cubed',
  'calabaza': 'pumpkin',
  'espárragos o brócoli al vapor': 'asparagus or steamed broccoli',
  'mix de verduras (brócoli, zanahoria, pimentón)': 'vegetable mix (broccoli, carrot, bell pepper)',
  'mix de verduras (espinaca, champiñones, pimentón)': 'vegetable mix (spinach, mushrooms, bell pepper)',
  'verduras salteadas (brócoli, pimentón, calabacín)': 'sautéed vegetables (broccoli, bell pepper, zucchini)',
  // Legumes
  'lentejas cocidas': 'cooked lentils',
  'lentejas secas': 'dry lentils',
  'garbanzos cocidos': 'cooked chickpeas',
  'frijoles negros cocidos': 'cooked black beans',
  'judías pintas cocidas': 'cooked pinto beans',
  'judías verdes cocidas': 'cooked green beans',
  // Grains
  'pan integral o masa madre': 'whole grain or sourdough bread',
  'pan integral': 'whole grain bread',
  'pan rallado integral': 'whole grain breadcrumbs',
  'tortilla integral mediana': 'medium whole grain tortilla',
  'tortillas de maíz pequeñas': 'small corn tortillas',
  'tortilla integral pequeña (opcional)': 'small whole grain tortilla (optional)',
  'arroz integral cocido': 'cooked brown rice',
  'arroz blanco cocido': 'cooked white rice',
  'quinoa cocida': 'cooked quinoa',
  'pasta integral en crudo': 'dry whole grain pasta',
  'pasta integral': 'whole grain pasta',
  'arepa integral pequeña': 'small whole grain arepa',
  // Meat & Fish
  'pechuga de pollo cocida y desmechada': 'cooked shredded chicken breast',
  'pechuga de pollo a la plancha en tiras': 'grilled chicken breast strips',
  'pechuga de pollo a la plancha en cubos': 'grilled chicken breast cubed',
  'pechuga de pollo a la plancha': 'grilled chicken breast',
  'pechuga de pollo en cubos': 'chicken breast cubed',
  'pechuga de pollo en tiras': 'chicken breast strips',
  'pechuga de pollo': 'chicken breast',
  'pechuga de pavo en tiras': 'turkey breast strips',
  'pechuga de pavo molida o picada': 'ground or minced turkey breast',
  'pechuga de pavo': 'turkey breast',
  'jamón de pavo': 'turkey ham',
  'carne molida magra (res o pavo)': 'lean ground meat (beef or turkey)',
  'carne molida magra': 'lean ground meat',
  'carne de res magra en tiras': 'lean beef strips',
  'filete de salmón a la plancha': 'grilled salmon fillet',
  'filete de pescado (merluza, salmón o similar)': 'fish fillet (hake, salmon or similar)',
  'filete de pescado blanco o salmón': 'white fish fillet or salmon',
  'salmón a la plancha': 'grilled salmon',
  'atún en agua escurrido': 'canned tuna in water (drained)',
  'tofu firme o pechuga de pollo en cubos': 'firm tofu or chicken breast cubed',
  'tofu firme en cubos': 'firm tofu cubed',
  'chorizo reducido en grasa': 'reduced-fat chorizo',
  'hueso de pollo (opcional)': 'chicken bone (optional)',
  // Dairy
  'queso fresco bajo en grasa': 'low-fat fresh cheese',
  'queso bajo en grasa': 'low-fat cheese',
  'ricotta light o queso fresco bajo en grasa': 'light ricotta or low-fat fresh cheese',
  'ricotta light': 'light ricotta',
  'mozzarella fresca light': 'light fresh mozzarella',
  // Fruits
  'piña en cubos': 'pineapple chunks',
  'aguacate pequeño': 'small avocado',
  'aguacate en láminas': 'sliced avocado',
  'aguacate en cubos': 'avocado cubed',
  'aguacate': 'avocado',
  'frutos rojos (arándanos, fresas, moras)': 'berries (blueberries, strawberries, blackberries)',
  'frutos rojos congelados': 'frozen berries',
  'frutos rojos o manzana en cubos': 'berries or diced apple',
  'frutos rojos': 'berries',
  'manzana en cubos': 'diced apple',
  'manzana pequeña o mandarina': 'small apple or mandarin',
  'manzana pequeña': 'small apple',
  'manzana verde': 'green apple',
  'manzana o frutos rojos': 'apple or berries',
  'manzana': 'apple',
  'naranja en gajos': 'orange segments',
  'naranja en rodajas': 'sliced orange',
  'naranjas (jugo)': 'oranges (juice)',
  'mandarina o kiwi': 'mandarin or kiwi',
  'kiwi en rodajas': 'sliced kiwi',
  'mango en cubos': 'diced mango',
  'fresas en rodajas': 'sliced strawberries',
  'fresas': 'strawberries',
  'arándanos': 'blueberries',
  'plátano': 'banana',
  // Oils & condiments
  'aceite de oliva o coco': 'olive oil or coconut oil',
  'aceite de oliva': 'olive oil',
  'aceite': 'oil',
  'agua de coco': 'coconut water',
  'cúrcuma fresca o en polvo': 'fresh or ground turmeric',
  'cúrcuma en polvo': 'ground turmeric',
  'cúrcuma y pimienta': 'turmeric and pepper',
  'pimienta negra': 'black pepper',
  'pimienta': 'black pepper',
  'sal y pimienta': 'salt and pepper',
  'sal, pimienta y ajo en polvo': 'salt, pepper, and garlic powder',
  'sal, pimienta y orégano': 'salt, pepper, and oregano',
  'sal, pimienta y perejil': 'salt, pepper, and parsley',
  'sal, pimienta y cúrcuma': 'salt, pepper, and turmeric',
  'sal, pimienta y perejil picado': 'salt, pepper, and chopped parsley',
  'sal, pimienta y especias': 'salt, pepper, and spices',
  'sal, pimienta y cilantro': 'salt, pepper, and cilantro',
  'sal, pimienta y comino': 'salt, pepper, and cumin',
  'sal, pimienta, pimentón dulce y ajo en polvo': 'salt, pepper, sweet paprika, and garlic powder',
  'sal, comino y pimienta': 'salt, cumin, and pepper',
  'sal, pimentón y comino': 'salt, paprika, and cumin',
  'sal, pimentón dulce y comino': 'salt, sweet paprika, and cumin',
  'sal, pimienta, comino y paprika': 'salt, pepper, cumin, and paprika',
  'sal y comino': 'salt and cumin',
  'sal ligera': 'light salt',
  'sal': 'salt',
  'mayonesa ligera': 'light mayonnaise',
  'mostaza Dijon': 'Dijon mustard',
  'salsa de soya baja en sodio': 'low-sodium soy sauce',
  'salsa de tomate natural': 'natural tomato sauce',
  'pico de gallo (tomate, cebolla, cilantro)': 'pico de gallo (tomato, onion, cilantro)',
  'limón (jugo)': 'lemon (juice)',
  'jugo de limón': 'lemon juice',
  'caldo de pollo bajo en grasa': 'low-fat chicken broth',
  'caldo de pollo': 'chicken broth',
  'caldo de verduras': 'vegetable broth',
  'caldo': 'broth',
  'agua': 'water',
  'hielo': 'ice',
  // Nuts & seeds
  'nueces picadas': 'chopped walnuts',
  'nueces': 'walnuts',
  'almendras naturales': 'natural almonds',
  'mix de frutos secos (almendras, nueces, anacardos)': 'mixed nuts (almonds, walnuts, cashews)',
  'hummus clásico': 'classic hummus',
  'hummus': 'hummus',
  // Beverages
  'agua fría': 'cold water',
  'café negro': 'black coffee',
  'café frío': 'cold brew coffee',
  'té verde': 'green tea',
  'té verde o negro': 'green or black tea',
  'hojas de menta': 'fresh mint leaves',
  'hojas de albahaca': 'fresh basil leaves',
  // Other
  'papa pequeña cocida en cubos': 'small cooked potato, diced',
  'papa pequeña': 'small potato',
  'papa': 'potato',
  'camote (batata) asado en cubos': 'sweet potato (roasted, cubed)',
  'camote': 'sweet potato',
  'arroz integral': 'brown rice',
  'cilantro': 'cilantro',
  'perejil picado': 'chopped parsley',
  'orégano': 'oregano',
  'ajo en polvo': 'garlic powder',
  'chile en hojuelas': 'chili flakes',
  'chile en polvo': 'chili powder',
  'chocolate 70% derretido o en trocitos': '70% dark chocolate (melted or chopped)',
  'frijoles negros cocidos': 'cooked black beans',
  'hojas de albahaca': 'fresh basil leaves',
  'al gusto': 'to taste',
};

// ─── Unit translations ────────────────────────────────────────────────────────
const UNIT_MAP = {
  'taza': 'cup',
  'tazas': 'cups',
  'cucharada': 'tbsp',
  'cucharadas': 'tbsp',
  'cucharadita': 'tsp',
  'cucharaditas': 'tsp',
  'pizca': 'pinch',
  'unidad': 'unit',
  'unidades': 'units',
  'rebanadas': 'slices',
  'rebanada': 'slice',
  'rodajas': 'slices',
  'rodaja': 'slice',
  'hojas': 'leaves',
  'hoja': 'leaf',
  'ramas': 'sprigs',
  'rama': 'sprig',
};

// ─── Tag translations ─────────────────────────────────────────────────────────
const TAG_MAP = {
  'alto proteico': 'high-protein',
  'alto en proteína': 'high-protein',
  'energia': 'energy',
  'gluteos': 'glutes',
  'glúteos': 'glutes',
  'sin lactosa opcional': 'lactose-free optional',
  'sin coccion': 'no-cook',
  'sin cocción': 'no-cook',
  'prep adelantada': 'meal-prep',
  'probioticos': 'probiotic',
  'probióticos': 'probiotic',
  'antioxidante': 'antioxidant',
  'piel': 'skin',
  'piel radiante': 'radiant skin',
  'rapido': 'quick',
  'rápido': 'quick',
  'antiinflamatorio': 'anti-inflammatory',
  'sin gluten': 'gluten-free',
  'vegano': 'vegan',
  'verde': 'green',
  'perdida_peso': 'weight-loss',
  'perdida peso': 'weight-loss',
  'pérdida de peso': 'weight-loss',
  'saludable': 'healthy',
  'light': 'light',
  'bajo carbos': 'low-carb',
  'bajo_carbos': 'low-carb',
  'bajo en carbos': 'low-carb',
  'keto': 'keto',
  'grasas saludables': 'healthy fats',
  'post entreno': 'post-workout',
  'pre entreno': 'pre-workout',
  'sin azucar': 'sugar-free',
  'sin azúcar': 'sugar-free',
  'omega3': 'omega-3',
  'omega-3': 'omega-3',
  'piernas': 'legs',
  'cardio': 'cardio',
  'detox': 'detox',
  'saciante': 'filling',
  'aguacate': 'avocado',
  'alto_proteico': 'high-protein',
  'bajo_grasa': 'low-fat',
  'bajo en grasa': 'low-fat',
  'horno': 'baked',
  'cardiaco': 'heart-healthy',
  'inmunidad': 'immunity',
  'ojeras': 'dark circles',
  'hidratacion': 'hydration',
  'hidratación': 'hydration',
  'vegetal': 'plant-based',
  'vegetariano': 'vegetarian',
  'proteina_vegetal': 'plant-protein',
  'sin_gluten': 'gluten-free',
  'musculos': 'muscles',
  'músculos': 'muscles',
  'recuperacion': 'recovery',
  'recuperación': 'recovery',
};

// ─── Common cooking step phrases ──────────────────────────────────────────────
const STEP_PHRASES = [
  // Preparation
  [/Precalentar el horno a (\d+)\s*°C/gi, 'Preheat the oven to $1°C (${Math.round($1 * 9/5 + 32)}°F)'],
  [/Precalentar el horno a (\d+)°C/gi, 'Preheat the oven to $1°C'],
  // Mixing
  [/[Mm]ezclar (.+) en (.+)\./g, 'Combine $1 in $2.'],
  [/[Mm]ezclar (.+) hasta (.+)\./g, 'Mix $1 until $2.'],
  [/[Mm]ezclar (.+) y (.+)\./g, 'Mix $1 and $2.'],
  [/[Mm]ezclar (.+)\./g, 'Mix $1.'],
  [/[Cc]ombinar (.+)\./g, 'Combine $1.'],
  // Blend
  [/[Ll]icuar (.+) hasta (.+)\./g, 'Blend $1 until $2.'],
  [/[Ll]icuar (.+)\./g, 'Blend $1.'],
  // Add
  [/[Aa]ñadir (.+)\./g, 'Add $1.'],
  [/[Aa]gregar (.+)\./g, 'Add $1.'],
  // Cook
  [/[Cc]ocinar (.+) minutos (.+)\./g, 'Cook $1 minutes $2.'],
  [/[Cc]ocinar (.+)\./g, 'Cook $1.'],
  [/[Cc]alentar (.+) en (.+)\./g, 'Heat $1 in $2.'],
  [/[Cc]alentar (.+)\./g, 'Heat $1.'],
  // Sauté / Fry
  [/[Ss]altear (.+) hasta (.+)\./g, 'Sauté $1 until $2.'],
  [/[Ss]altear (.+)\./g, 'Sauté $1.'],
  [/[Dd]orar (.+)\./g, 'Brown $1.'],
  // Bake
  [/[Hh]ornear (.+) minutos (.+)\./g, 'Bake $1 minutes $2.'],
  [/[Hh]ornear (.+)\./g, 'Bake $1.'],
  // Serve
  [/[Ss]ervir (.+)\./g, 'Serve $1.'],
  [/[Ss]ervir en (.+)\./g, 'Serve in $1.'],
  // Place
  [/[Cc]olocar (.+) en (.+)\./g, 'Place $1 in $2.'],
  [/[Cc]olocar (.+)\./g, 'Place $1.'],
  // Spread
  [/[Uu]ntar (.+) en (.+)\./g, 'Spread $1 on $2.'],
  [/[Uu]ntar (.+)\./g, 'Spread $1.'],
  // Cover / Refrigerate
  [/[Tt]apar (.+) y refrigerar (.+)\./g, 'Cover $1 and refrigerate $2.'],
  [/[Rr]efrigerar (.+)\./g, 'Refrigerate $1.'],
  // Strain
  [/[Cc]olar (.+)\./g, 'Strain $1.'],
  // Mix/stir
  [/[Ee]spolvorear (.+)\./g, 'Sprinkle $1.'],
  [/[Ee]ndulzar (.+)\./g, 'Sweeten $1.'],
  [/[Ss]azonar (.+)\./g, 'Season $1.'],
  [/[Rr]ociar (.+)\./g, 'Drizzle $1.'],
  // Season / Adjust
  [/[Aa]justar (.+)\./g, 'Adjust $1.'],
  [/[Cc]onsumir (.+)\./g, 'Consume $1.'],
  [/[Tt]omar (.+)\./g, 'Take $1.'],
  [/[Aa]rmar (.+)\./g, 'Assemble $1.'],
  [/[Tt]ostar (.+)\./g, 'Toast $1.'],
  [/[Aa]plastar (.+)\./g, 'Mash $1.'],
  [/[Pp]icor (.+)\./g, 'Chop $1.'],
  [/[Cc]ortar (.+)\./g, 'Cut $1.'],
  [/[Ll]avar (.+)\./g, 'Wash $1.'],
  [/[Ee]scurrir (.+)\./g, 'Drain $1.'],
  [/[Dd]ejar reposar (.+)\./g, 'Let rest $1.'],
  [/[Dd]ecorar (.+)\./g, 'Garnish $1.'],
];

/**
 * Translate an ingredient object using the name and unit maps.
 */
function translateIngredient(ing) {
  const nameLower = (ing.name || '').toLowerCase().trim();
  // Try exact match first
  for (const [es, en] of Object.entries(INGREDIENT_NAME_MAP)) {
    if (nameLower === es.toLowerCase()) {
      return {
        name: en,
        amount: ing.amount === 'al gusto' ? 'to taste' : ing.amount,
        unit: UNIT_MAP[ing.unit?.toLowerCase()] ?? ing.unit ?? '',
      };
    }
  }
  // Partial match: check if any key is contained in the ingredient name
  for (const [es, en] of Object.entries(INGREDIENT_NAME_MAP)) {
    if (nameLower.includes(es.toLowerCase())) {
      return {
        name: en,
        amount: ing.amount === 'al gusto' ? 'to taste' : ing.amount,
        unit: UNIT_MAP[ing.unit?.toLowerCase()] ?? ing.unit ?? '',
      };
    }
  }
  // No match found — keep original name, translate amount/unit
  return {
    name: ing.name,
    amount: ing.amount === 'al gusto' ? 'to taste' : ing.amount,
    unit: UNIT_MAP[ing.unit?.toLowerCase()] ?? ing.unit ?? '',
  };
}

/**
 * Attempt to auto-translate a step string using phrase patterns.
 */
function translateStep(step) {
  let result = step;
  for (const [pattern, replacement] of STEP_PHRASES) {
    const newResult = result.replace(pattern, replacement);
    if (newResult !== result) {
      result = newResult;
      break; // One substitution per step to avoid cascading replacements
    }
  }
  // Replace common Spanish terms remaining
  const wordMap = {
    'fuego medio': 'medium heat',
    'fuego alto': 'high heat',
    'fuego bajo': 'low heat',
    'la sartén': 'the pan',
    'una sartén': 'a pan',
    'el horno': 'the oven',
    'la licuadora': 'the blender',
    'un bowl': 'a bowl',
    'un frasco': 'a jar',
    'vasitos pequeños': 'small shot glasses',
    'tipo shot': 'shot-style',
    'al día siguiente': 'the next day',
    'por encima': 'on top',
    'si se desea': 'if desired',
    'toda la noche': 'overnight',
    'a gusto': 'to taste',
    'en cubitos': 'cubed',
    'en láminas': 'sliced thin',
    'sin azúcar': 'sugar-free',
    'sin lactosa': 'lactose-free',
    'sin gluten': 'gluten-free',
  };
  for (const [es, en] of Object.entries(wordMap)) {
    result = result.replaceAll(es, en);
  }
  return result;
}

/**
 * Translate a tag string.
 */
function translateTag(tag) {
  const lower = tag.toLowerCase().trim();
  return TAG_MAP[lower] ?? tag;
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB');

  const recipes = await Recipe.find({
    $or: [{ nameEn: { $exists: false } }, { nameEn: '' }, { nameEn: null }],
  });

  console.log(`Found ${recipes.length} recipe(s) without nameEn\n`);

  let updated = 0;
  let skipped = 0;

  for (const recipe of recipes) {
    const nameEn = NAME_MAP[recipe.name];
    if (!nameEn) {
      console.log(`  ⚠️  No name translation for: "${recipe.name}" — skipping`);
      skipped++;
      continue;
    }

    const descriptionEn = DESCRIPTION_MAP[recipe.name] || '';
    const ingredientsEn = (recipe.ingredients || []).map(translateIngredient);
    const stepsEn = (recipe.steps || []).map(translateStep);
    const tagsEn = (recipe.tags || []).map(translateTag);

    await Recipe.findByIdAndUpdate(recipe._id, {
      $set: { nameEn, descriptionEn, ingredientsEn, stepsEn, tagsEn },
    });

    console.log(`  ✓ "${recipe.name}" → "${nameEn}"`);
    updated++;
  }

  console.log(`\nDone. Updated: ${updated}  Skipped: ${skipped}`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
