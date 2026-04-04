require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const connectDB = require('../config/database');

// ============================================================
// 24 recetas nuevas — lote 1 de 50
// Ordenadas por categoría: desayuno → almuerzo → cena →
//   snack → batido → bebida
// ============================================================

const recipes = [

  // ===================== DESAYUNOS ========================

  {
    name: 'Tostadas de aguacate y huevo',
    description: 'Desayuno ligero y saciante con grasas saludables del aguacate y proteína del huevo. Ideal para comenzar el día con energía sin excederse en calorías.',
    imageUrl: 'https://images.pexels.com/photos/4106483/pexels-photo-4106483.jpeg',
    category: 'desayuno',
    accessLevel: 'free',
    prepTime: 5,
    cookTime: 8,
    nutrition: { calories: 380, protein: 20, carbs: 34, fat: 18 },
    tags: ['saludable', 'light', 'perdida_peso', 'saciante', 'aguacate'],
    isFeatured: true,
    ingredients: [
      { name: 'pan integral', amount: '2', unit: 'rebanadas' },
      { name: 'aguacate', amount: '1/2', unit: 'unidad' },
      { name: 'huevo', amount: '1', unit: 'unidad' },
      { name: 'clara de huevo', amount: '1', unit: 'unidad' },
      { name: 'sal', amount: 'al gusto', unit: '' },
      { name: 'pimienta', amount: 'al gusto', unit: '' },
      { name: 'chile en hojuelas', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Tostar el pan integral.',
      'Aplastar el aguacate con sal y pimienta y untar sobre el pan.',
      'Cocinar el huevo y la clara a la plancha o revueltos.',
      'Colocar el huevo sobre las tostadas y decorar con chile en hojuelas.',
    ],
  },

  {
    name: 'Huevos revueltos a la mexicana fit',
    description: 'Versión fit de los clásicos huevos a la mexicana: alta en proteína, baja en grasa y lista en minutos. Perfecta para antes de entrenar piernas o glúteos.',
    imageUrl: 'https://images.pexels.com/photos/1431339/pexels-photo-1431339.jpeg',
    category: 'desayuno',
    accessLevel: 'free',
    prepTime: 5,
    cookTime: 8,
    nutrition: { calories: 260, protein: 24, carbs: 7, fat: 15 },
    tags: ['alto_proteico', 'energia', 'gluteos_piernas', 'bajo_carbo', 'rapido'],
    isFeatured: false,
    ingredients: [
      { name: 'huevos', amount: '2', unit: 'unidades' },
      { name: 'claras de huevo', amount: '2', unit: 'unidades' },
      { name: 'tomate picado', amount: '1/4', unit: 'taza' },
      { name: 'cebolla picada', amount: '1/4', unit: 'taza' },
      { name: 'pimentón en cubos', amount: '1/4', unit: 'taza' },
      { name: 'aceite de oliva', amount: '5', unit: 'ml' },
      { name: 'sal y pimienta', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Saltear cebolla y pimentón con aceite de oliva.',
      'Agregar tomate y cocinar 1 minuto.',
      'Añadir huevos y claras batidos con sal y pimienta.',
      'Revolver hasta que cuajen y servir.',
    ],
  },

  {
    name: 'Quesadilla desayuno alta en proteína',
    description: 'Quesadilla integral rellena de huevo, pavo y queso bajo en grasa. Excelente para los días de entrenamiento de fuerza o cuando necesitas mayor ingesta proteica.',
    imageUrl: 'https://images.pexels.com/photos/4958781/pexels-photo-4958781.jpeg',
    category: 'desayuno',
    accessLevel: 'basic',
    prepTime: 5,
    cookTime: 10,
    nutrition: { calories: 340, protein: 28, carbs: 28, fat: 12 },
    tags: ['alto_proteico', 'musculacion', 'gluteos_piernas', 'masa_muscular'],
    isFeatured: false,
    ingredients: [
      { name: 'tortilla integral mediana', amount: '1', unit: 'unidad' },
      { name: 'huevo', amount: '1', unit: 'unidad' },
      { name: 'claras de huevo', amount: '2', unit: 'unidades' },
      { name: 'jamón de pavo', amount: '20', unit: 'g' },
      { name: 'queso bajo en grasa', amount: '20', unit: 'g' },
      { name: 'espinaca', amount: '1/4', unit: 'taza' },
    ],
    steps: [
      'Batir el huevo con las claras y cocinar junto con la espinaca.',
      'Colocar el huevo, jamón y queso sobre la tortilla.',
      'Doblar y tostar en sartén por ambos lados hasta que el queso se derrita.',
      'Servir caliente.',
    ],
  },

  {
    name: 'Bowl de frutas cítricas y yogur',
    description: 'Bowl refrescante cargado de vitamina C y antioxidantes. Ideal para mejorar la luminosidad de la piel, reducir ojeras y aportar probióticos para la digestión.',
    imageUrl: 'https://images.pexels.com/photos/1438082/pexels-photo-1438082.jpeg',
    category: 'desayuno',
    accessLevel: 'free',
    prepTime: 5,
    cookTime: 0,
    nutrition: { calories: 230, protein: 15, carbs: 32, fat: 5 },
    tags: ['piel_radiante', 'antioxidante', 'vitamina_c', 'sin_coccion', 'probioticos'],
    isFeatured: true,
    ingredients: [
      { name: 'yogur griego natural', amount: '150', unit: 'g' },
      { name: 'naranja en gajos', amount: '1/2', unit: 'unidad' },
      { name: 'kiwi en rodajas', amount: '1/2', unit: 'unidad' },
      { name: 'semillas de chía', amount: '5', unit: 'g' },
      { name: 'miel', amount: '5', unit: 'g' },
    ],
    steps: [
      'Colocar el yogur en un bowl.',
      'Añadir gajos de naranja y kiwi en rodajas.',
      'Espolvorear chía y agregar miel.',
      'Mezclar antes de comer.',
    ],
  },

  {
    name: 'Avena con cacao y frutos rojos',
    description: 'Avena caliente con toque de cacao y frutos rojos antioxidantes. Rica en fibra y saciante, ideal para días de control calórico sin renunciar al sabor dulce.',
    imageUrl: 'https://images.pexels.com/photos/3731520/pexels-photo-3731520.jpeg',
    category: 'desayuno',
    accessLevel: 'basic',
    prepTime: 2,
    cookTime: 8,
    nutrition: { calories: 260, protein: 11, carbs: 40, fat: 6 },
    tags: ['bajas_calorias', 'perdida_peso', 'piel_radiante', 'antioxidante', 'alta_fibra'],
    isFeatured: false,
    ingredients: [
      { name: 'avena', amount: '40', unit: 'g' },
      { name: 'leche o bebida vegetal', amount: '200', unit: 'ml' },
      { name: 'cacao en polvo sin azúcar', amount: '10', unit: 'g' },
      { name: 'frutos rojos', amount: '50', unit: 'g' },
      { name: 'stevia', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Cocinar la avena con la leche a fuego medio.',
      'Añadir el cacao y mezclar bien.',
      'Servir y colocar frutos rojos por encima.',
      'Endulzar con stevia si se desea.',
    ],
  },

  // ===================== ALMUERZOS ========================

  {
    name: 'Ensalada de garbanzos mediterránea',
    description: 'Ensalada fresca con garbanzos ricos en fibra y proteína vegetal. Muy saciante, perfecta para adelgazar sin pasar hambre.',
    imageUrl: 'https://images.pexels.com/photos/1435895/pexels-photo-1435895.jpeg',
    category: 'almuerzo',
    accessLevel: 'free',
    prepTime: 10,
    cookTime: 0,
    nutrition: { calories: 320, protein: 12, carbs: 36, fat: 12 },
    tags: ['bajas_calorias', 'perdida_peso', 'alta_fibra', 'saciante', 'vegano', 'sin_coccion'],
    isFeatured: false,
    ingredients: [
      { name: 'garbanzos cocidos', amount: '120', unit: 'g' },
      { name: 'pepino en cubos', amount: '1/2', unit: 'taza' },
      { name: 'tomate en cubos', amount: '1/2', unit: 'taza' },
      { name: 'cebolla morada', amount: '1/4', unit: 'unidad' },
      { name: 'aceite de oliva', amount: '10', unit: 'ml' },
      { name: 'jugo de limón', amount: '1/2', unit: 'limón' },
      { name: 'sal, pimienta y perejil', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Mezclar garbanzos, pepino, tomate y cebolla en un bowl.',
      'Aliñar con aceite, limón, sal y pimienta.',
      'Añadir perejil picado.',
      'Servir fría.',
    ],
  },

  {
    name: 'Ensalada de atún estilo español',
    description: 'Clásica ensalada española ligera con atún, huevo y verduras. Rica en omega-3 y proteína magra, perfecta para mantener el peso y cuidar el corazón.',
    imageUrl: 'https://images.pexels.com/photos/5938241/pexels-photo-5938241.jpeg',
    category: 'almuerzo',
    accessLevel: 'free',
    prepTime: 10,
    cookTime: 10,
    nutrition: { calories: 360, protein: 29, carbs: 24, fat: 15 },
    tags: ['bajas_calorias', 'perdida_peso', 'cardiaco', 'alto_proteico', 'omega3'],
    isFeatured: false,
    ingredients: [
      { name: 'atún en agua escurrido', amount: '80', unit: 'g' },
      { name: 'papa pequeña cocida en cubos', amount: '1', unit: 'unidad' },
      { name: 'huevo duro', amount: '1', unit: 'unidad' },
      { name: 'judías verdes cocidas', amount: '1/2', unit: 'taza' },
      { name: 'aceite de oliva', amount: '10', unit: 'ml' },
      { name: 'sal y pimienta', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Mezclar atún, papa, judías verdes y huevo picado en un bowl.',
      'Aliñar con aceite, sal y pimienta.',
      'Servir a temperatura ambiente.',
    ],
  },

  {
    name: 'Bowl burrito ligero de pollo',
    description: 'Bowl completo con pollo, arroz integral y frijoles. Alto en proteína y fibra, diseñado para apoyar el crecimiento muscular de glúteos y piernas.',
    imageUrl: 'https://images.pexels.com/photos/4958654/pexels-photo-4958654.jpeg',
    category: 'almuerzo',
    accessLevel: 'basic',
    prepTime: 10,
    cookTime: 15,
    nutrition: { calories: 520, protein: 33, carbs: 55, fat: 16 },
    tags: ['alto_proteico', 'musculacion', 'gluteos_piernas', 'altas_calorias', 'masa_muscular'],
    isFeatured: true,
    ingredients: [
      { name: 'pechuga de pollo a la plancha', amount: '100', unit: 'g' },
      { name: 'arroz integral cocido', amount: '60', unit: 'g' },
      { name: 'frijoles negros cocidos', amount: '40', unit: 'g' },
      { name: 'aguacate', amount: '1/4', unit: 'unidad' },
      { name: 'pico de gallo (tomate, cebolla, cilantro)', amount: '1/4', unit: 'taza' },
      { name: 'jugo de limón', amount: '10', unit: 'ml' },
    ],
    steps: [
      'Colocar arroz y frijoles en un bowl.',
      'Añadir el pollo en tiras.',
      'Agregar aguacate y pico de gallo.',
      'Terminar con limón y un toque de sal.',
    ],
  },

  {
    name: 'Pollo guisado fit con verduras',
    description: 'Guiso casero de pollo con verduras en caldo ligero. Bajo en grasa, alto en proteína y reconfortante. Perfecto para perder grasa sin perder masa muscular.',
    imageUrl: 'https://images.pexels.com/photos/5938241/pexels-photo-5938241.jpeg',
    category: 'almuerzo',
    accessLevel: 'basic',
    prepTime: 10,
    cookTime: 25,
    nutrition: { calories: 380, protein: 32, carbs: 28, fat: 13 },
    tags: ['bajas_calorias', 'perdida_peso', 'alto_proteico', 'saludable', 'casero'],
    isFeatured: false,
    ingredients: [
      { name: 'pechuga de pollo en cubos', amount: '120', unit: 'g' },
      { name: 'zanahoria', amount: '1/2', unit: 'taza' },
      { name: 'papa pequeña', amount: '1/2', unit: 'taza' },
      { name: 'calabacín', amount: '1/2', unit: 'taza' },
      { name: 'cebolla', amount: '1/4', unit: 'unidad' },
      { name: 'diente de ajo', amount: '1', unit: 'unidad' },
      { name: 'aceite', amount: '5', unit: 'ml' },
      { name: 'caldo de pollo', amount: '200', unit: 'ml' },
      { name: 'sal y pimienta', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Sofreír cebolla y ajo en aceite.',
      'Agregar pollo y dorar por 3 minutos.',
      'Añadir verduras en cubos y el caldo.',
      'Cocinar a fuego medio hasta que el pollo y las verduras estén tiernos (20 min aprox).',
    ],
  },

  {
    name: 'Cocido madrileño ligero alto en proteína',
    description: 'Versión reducida en grasa del cocido madrileño. Cargado de proteína animal y vegetal para la recuperación muscular, con el sabor tradicional español.',
    imageUrl: 'https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg',
    category: 'almuerzo',
    accessLevel: 'premium',
    prepTime: 15,
    cookTime: 40,
    nutrition: { calories: 420, protein: 30, carbs: 32, fat: 16 },
    tags: ['alto_proteico', 'recuperacion', 'saludable', 'casero', 'tradicional'],
    isFeatured: false,
    ingredients: [
      { name: 'garbanzos cocidos', amount: '60', unit: 'g' },
      { name: 'pechuga de pollo', amount: '60', unit: 'g' },
      { name: 'chorizo reducido en grasa', amount: '30', unit: 'g' },
      { name: 'zanahoria', amount: '1/2', unit: 'unidad' },
      { name: 'papa pequeña', amount: '1', unit: 'trozo' },
      { name: 'repollo', amount: '1/4', unit: 'cabeza pequeña' },
      { name: 'caldo', amount: '400', unit: 'ml' },
    ],
    steps: [
      'Colocar el caldo en una olla junto con el pollo, chorizo y verduras picadas.',
      'Añadir los garbanzos y llevar a ebullición.',
      'Cocinar a fuego lento 35–40 minutos.',
      'Servir con un poco de caldo.',
    ],
  },

  {
    name: 'Tacos de pescado al horno',
    description: 'Tacos ligeros con pescado horneado y ensalada de col. Aportan omega-3 si usas salmón, perfectos para la piel y la pérdida de peso.',
    imageUrl: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg',
    category: 'almuerzo',
    accessLevel: 'premium',
    prepTime: 10,
    cookTime: 20,
    nutrition: { calories: 350, protein: 30, carbs: 28, fat: 12 },
    tags: ['bajas_calorias', 'perdida_peso', 'piel_radiante', 'omega3', 'bajo_grasa'],
    isFeatured: true,
    ingredients: [
      { name: 'filete de pescado blanco o salmón', amount: '120', unit: 'g' },
      { name: 'tortillas de maíz pequeñas', amount: '2', unit: 'unidades' },
      { name: 'col rallada', amount: '1/2', unit: 'taza' },
      { name: 'zanahoria rallada', amount: '1/4', unit: 'taza' },
      { name: 'yogur griego natural', amount: '10', unit: 'ml' },
      { name: 'jugo de limón', amount: '10', unit: 'ml' },
      { name: 'sal, pimienta y comino', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Condimentar el pescado con sal, pimienta y comino y hornear a 200°C hasta que esté cocido.',
      'Mezclar col y zanahoria ralladas.',
      'Preparar la salsa mezclando yogur con limón.',
      'Armar los tacos con pescado, ensalada y salsa.',
    ],
  },

  // ===================== CENAS ========================

  {
    name: 'Sopa de lentejas reconfortante',
    description: 'Sopa cálida de lentejas cargada de fibra y proteína vegetal. Muy saciante y perfecta para cenar ligero sin perder nutrientes esenciales.',
    imageUrl: 'https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg',
    category: 'cena',
    accessLevel: 'free',
    prepTime: 5,
    cookTime: 30,
    nutrition: { calories: 320, protein: 18, carbs: 50, fat: 5 },
    tags: ['bajas_calorias', 'perdida_peso', 'alta_fibra', 'saciante', 'vegano', 'digestivo'],
    isFeatured: false,
    ingredients: [
      { name: 'lentejas secas', amount: '80', unit: 'g' },
      { name: 'zanahoria', amount: '1/2', unit: 'unidad' },
      { name: 'papa pequeña', amount: '1/2', unit: 'unidad' },
      { name: 'cebolla', amount: '1/4', unit: 'unidad' },
      { name: 'diente de ajo', amount: '1', unit: 'unidad' },
      { name: 'caldo de verduras', amount: '400', unit: 'ml' },
      { name: 'aceite', amount: '5', unit: 'ml' },
      { name: 'sal y comino', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Sofreír cebolla y ajo en aceite.',
      'Agregar lentejas, zanahoria y papa en cubos.',
      'Añadir caldo, comino y sal.',
      'Cocinar hasta que las lentejas estén tiernas (25–30 min).',
    ],
  },

  {
    name: 'Crema de tomate y albahaca ligera',
    description: 'Crema suave y aromática rica en licopeno, un potente antioxidante que protege la piel del daño solar y favorece la regeneración celular.',
    imageUrl: 'https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg',
    category: 'cena',
    accessLevel: 'free',
    prepTime: 5,
    cookTime: 15,
    nutrition: { calories: 140, protein: 4, carbs: 18, fat: 6 },
    tags: ['bajas_calorias', 'piel_radiante', 'antioxidante', 'vegano', 'light', 'bajo_grasa'],
    isFeatured: false,
    ingredients: [
      { name: 'tomates grandes maduros', amount: '3', unit: 'unidades' },
      { name: 'cebolla', amount: '1/4', unit: 'unidad' },
      { name: 'diente de ajo', amount: '1', unit: 'unidad' },
      { name: 'aceite de oliva', amount: '5', unit: 'ml' },
      { name: 'caldo de verduras', amount: '200', unit: 'ml' },
      { name: 'sal, pimienta y albahaca', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Sofreír cebolla y ajo en aceite.',
      'Añadir tomates picados y cocinar 5 minutos.',
      'Agregar caldo, sal y pimienta y cocinar 10 minutos más.',
      'Licuar, servir y decorar con hojas de albahaca.',
    ],
  },

  {
    name: 'Ensalada templada de quinoa y espinaca',
    description: 'Cena equilibrada con proteína completa de la quinoa, hierro de la espinaca y antioxidantes de los pimientos. Ideal para mantenimiento y salud general.',
    imageUrl: 'https://images.pexels.com/photos/5938241/pexels-photo-5938241.jpeg',
    category: 'cena',
    accessLevel: 'basic',
    prepTime: 10,
    cookTime: 15,
    nutrition: { calories: 320, protein: 10, carbs: 40, fat: 12 },
    tags: ['saludable', 'equilibrado', 'vegetariano', 'hierro', 'piel_radiante'],
    isFeatured: false,
    ingredients: [
      { name: 'quinoa cocida', amount: '60', unit: 'g' },
      { name: 'espinaca', amount: '1', unit: 'taza' },
      { name: 'pimentón en tiras', amount: '1/4', unit: 'taza' },
      { name: 'champiñones', amount: '1/4', unit: 'taza' },
      { name: 'aceite de oliva', amount: '10', unit: 'ml' },
      { name: 'jugo de limón, sal y pimienta', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Saltear champiñones y pimentón con un poco de aceite.',
      'Añadir espinaca y dejar que se ablande.',
      'Mezclar con la quinoa cocida.',
      'Aliñar con aceite, limón, sal y pimienta.',
    ],
  },

  {
    name: 'Revuelto de claras con pavo',
    description: 'Cena hipocalórica y altamente proteica para la definición muscular. Solo proteína magra, sin carbohidratos nocturnos, perfecta para antes de dormir.',
    imageUrl: 'https://images.pexels.com/photos/1431339/pexels-photo-1431339.jpeg',
    category: 'cena',
    accessLevel: 'basic',
    prepTime: 5,
    cookTime: 8,
    nutrition: { calories: 210, protein: 28, carbs: 6, fat: 7 },
    tags: ['bajo_azucar', 'bajas_calorias', 'perdida_peso', 'alto_proteico', 'definicion', 'bajo_carbo'],
    isFeatured: false,
    ingredients: [
      { name: 'claras de huevo', amount: '4', unit: 'unidades' },
      { name: 'pechuga de pavo en tiras', amount: '50', unit: 'g' },
      { name: 'cebolla', amount: '1/4', unit: 'taza' },
      { name: 'pimentón', amount: '1/4', unit: 'taza' },
      { name: 'aceite', amount: '5', unit: 'ml' },
      { name: 'sal y pimienta', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Saltear cebolla y pimentón con aceite.',
      'Añadir el pavo y dorar 2 minutos.',
      'Agregar las claras batidas con sal y pimienta.',
      'Revolver a fuego suave hasta que cuajen.',
    ],
  },

  {
    name: 'Caldo de pollo casero antiinflamatorio',
    description: 'Caldo casero rico en colágeno y minerales, con propiedades antiinflamatorias naturales. Ideal para recuperación muscular, salud intestinal y piel.',
    imageUrl: 'https://images.pexels.com/photos/6287521/pexels-photo-6287521.jpeg',
    category: 'cena',
    accessLevel: 'premium',
    prepTime: 5,
    cookTime: 60,
    nutrition: { calories: 190, protein: 22, carbs: 8, fat: 7 },
    tags: ['antiinflamatorio', 'recuperacion', 'piel_radiante', 'digestivo', 'suave', 'bajo_grasa'],
    isFeatured: true,
    ingredients: [
      { name: 'pechuga de pollo', amount: '100', unit: 'g' },
      { name: 'hueso de pollo (opcional)', amount: '1', unit: 'unidad' },
      { name: 'zanahoria', amount: '1', unit: 'unidad' },
      { name: 'rama de apio', amount: '1', unit: 'unidad' },
      { name: 'cebolla', amount: '1/4', unit: 'unidad' },
      { name: 'diente de ajo', amount: '1', unit: 'unidad' },
      { name: 'agua', amount: '600', unit: 'ml' },
      { name: 'sal ligera', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Colocar todo en una olla con agua fría.',
      'Llevar a ebullición y luego cocinar a fuego lento 40–60 minutos.',
      'Retirar el hueso y desmechar el pollo.',
      'Servir el caldo con las verduras y el pollo.',
    ],
  },

  // ===================== SNACKS ========================

  {
    name: 'Pepino con limón y chile',
    description: 'Snack ultra ligero con sabor intenso. Perfecto para calmar el antojo salado sin sumar prácticamente calorías. Hidratante y digestivo.',
    imageUrl: 'https://images.pexels.com/photos/4113805/pexels-photo-4113805.jpeg',
    category: 'snack',
    accessLevel: 'free',
    prepTime: 3,
    cookTime: 0,
    nutrition: { calories: 40, protein: 2, carbs: 9, fat: 0 },
    tags: ['bajas_calorias', 'perdida_peso', 'light', 'hidratacion', 'sin_coccion', 'bajo_grasa'],
    isFeatured: false,
    ingredients: [
      { name: 'pepino mediano', amount: '1', unit: 'unidad' },
      { name: 'jugo de limón', amount: '1/2', unit: 'limón' },
      { name: 'sal ligera', amount: 'al gusto', unit: '' },
      { name: 'chile en polvo', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Cortar el pepino en rodajas o bastones.',
      'Rociar con jugo de limón.',
      'Añadir sal ligera y chile en polvo.',
      'Mezclar y servir.',
    ],
  },

  {
    name: 'Palitos de verduras con hummus',
    description: 'Snack saciante con alta fibra y proteína vegetal. Las verduras crudas aportan enzimas y el hummus brinda proteína y grasa saludable de calidad.',
    imageUrl: 'https://images.pexels.com/photos/3730951/pexels-photo-3730951.jpeg',
    category: 'snack',
    accessLevel: 'free',
    prepTime: 5,
    cookTime: 0,
    nutrition: { calories: 150, protein: 5, carbs: 16, fat: 7 },
    tags: ['bajas_calorias', 'perdida_peso', 'saciante', 'alta_fibra', 'vegano', 'sin_coccion'],
    isFeatured: false,
    ingredients: [
      { name: 'zanahoria en bastones', amount: '40', unit: 'g' },
      { name: 'apio en bastones', amount: '40', unit: 'g' },
      { name: 'pepino en bastones', amount: '40', unit: 'g' },
      { name: 'hummus', amount: '40', unit: 'g' },
    ],
    steps: [
      'Cortar las verduras en bastones.',
      'Colocar el hummus en un recipiente pequeño.',
      'Usar las verduras como dip.',
    ],
  },

  {
    name: 'Manzana con mantequilla de maní',
    description: 'Snack energético equilibrado: carbohidratos de la manzana y proteínas + grasas saludables del maní. Ideal 30–60 minutos antes de entrenar.',
    imageUrl: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
    category: 'snack',
    accessLevel: 'basic',
    prepTime: 3,
    cookTime: 0,
    nutrition: { calories: 190, protein: 4, carbs: 28, fat: 8 },
    tags: ['pre_entreno', 'energia', 'gluteos_piernas', 'saciante', 'sin_coccion'],
    isFeatured: false,
    ingredients: [
      { name: 'manzana pequeña', amount: '1', unit: 'unidad' },
      { name: 'mantequilla de maní natural', amount: '15', unit: 'g' },
    ],
    steps: [
      'Cortar la manzana en gajos.',
      'Servir con la mantequilla de maní para untar.',
      'Ideal consumirlo 30–60 minutos antes de entrenar.',
    ],
  },

  {
    name: 'Yogur con cacao y nueces',
    description: 'Snack antioxidante y rico en proteína que satisface el antojo dulce de forma saludable. Las nueces aportan omega-3 y el cacao flavonoides para la piel.',
    imageUrl: 'https://images.pexels.com/photos/1431305/pexels-photo-1431305.jpeg',
    category: 'snack',
    accessLevel: 'premium',
    prepTime: 3,
    cookTime: 0,
    nutrition: { calories: 210, protein: 15, carbs: 10, fat: 13 },
    tags: ['piel_radiante', 'antioxidante', 'omega3', 'alto_proteico', 'sin_coccion', 'bajo_azucar'],
    isFeatured: false,
    ingredients: [
      { name: 'yogur griego natural', amount: '150', unit: 'g' },
      { name: 'cacao en polvo sin azúcar', amount: '5', unit: 'g' },
      { name: 'nueces picadas', amount: '10', unit: 'g' },
      { name: 'stevia', amount: 'opcional', unit: '' },
    ],
    steps: [
      'Mezclar el yogur con el cacao y la stevia.',
      'Añadir las nueces por encima.',
      'Servir frío.',
    ],
  },

  // ===================== BATIDOS ========================

  {
    name: 'Batido verde detox suave',
    description: 'Batido 100% vegetal bajo en calorías con efectos depurativos y antioxidantes. Ideal para comenzar el día o como merienda en días de control calórico.',
    imageUrl: 'https://images.pexels.com/photos/5938241/pexels-photo-5938241.jpeg',
    category: 'batido',
    accessLevel: 'free',
    prepTime: 5,
    cookTime: 0,
    nutrition: { calories: 80, protein: 2, carbs: 19, fat: 0 },
    tags: ['bajas_calorias', 'perdida_peso', 'piel_radiante', 'detox', 'vegano', 'hidratacion'],
    isFeatured: false,
    ingredients: [
      { name: 'espinaca', amount: '1', unit: 'taza' },
      { name: 'pepino', amount: '1/2', unit: 'unidad' },
      { name: 'manzana verde', amount: '1/2', unit: 'unidad' },
      { name: 'jugo de limón', amount: '1/2', unit: 'limón' },
      { name: 'agua', amount: '200', unit: 'ml' },
      { name: 'hielo', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Agregar todos los ingredientes a la licuadora.',
      'Licuar hasta obtener una mezcla homogénea.',
      'Servir frío inmediatamente.',
    ],
  },

  {
    name: 'Batido de frutos rojos antioxidante',
    description: 'Batido cremoso con gran poder antioxidante gracias a los frutos rojos. Combate el envejecimiento celular, mejora la piel y reduce las ojeras.',
    imageUrl: 'https://images.pexels.com/photos/4144202/pexels-photo-4144202.jpeg',
    category: 'batido',
    accessLevel: 'basic',
    prepTime: 5,
    cookTime: 0,
    nutrition: { calories: 190, protein: 12, carbs: 30, fat: 3 },
    tags: ['piel_radiante', 'antioxidante', 'vitamina_c', 'probioticos', 'sin_coccion'],
    isFeatured: true,
    ingredients: [
      { name: 'frutos rojos congelados', amount: '150', unit: 'g' },
      { name: 'agua o bebida vegetal', amount: '150', unit: 'ml' },
      { name: 'yogur griego', amount: '100', unit: 'g' },
      { name: 'stevia', amount: 'opcional', unit: '' },
    ],
    steps: [
      'Colocar todos los ingredientes en la licuadora.',
      'Licuar hasta obtener textura cremosa.',
      'Servir inmediatamente.',
    ],
  },

  // ===================== BEBIDAS ========================

  {
    name: 'Agua saborizada con frutas y menta',
    description: 'Bebida de hidratación natural sin calorías. La vitamina C de los cítricos, la clorofila de la menta y los antioxidantes del pepino cuidan tu piel desde adentro.',
    imageUrl: 'https://images.pexels.com/photos/5938241/pexels-photo-5938241.jpeg',
    category: 'bebida',
    accessLevel: 'free',
    prepTime: 5,
    cookTime: 0,
    nutrition: { calories: 20, protein: 0, carbs: 5, fat: 0 },
    tags: ['bajas_calorias', 'hidratacion', 'piel_radiante', 'detox', 'vegano', 'sin_azucar'],
    isFeatured: false,
    ingredients: [
      { name: 'agua', amount: '1', unit: 'litro' },
      { name: 'naranja en rodajas', amount: '4', unit: 'rodajas' },
      { name: 'limón en rodajas', amount: '4', unit: 'rodajas' },
      { name: 'pepino en rodajas', amount: '4', unit: 'rodajas' },
      { name: 'hojas de menta', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Colocar las frutas y el pepino en una jarra con agua.',
      'Añadir hojas de menta.',
      'Refrigerar al menos 1 hora antes de tomar.',
    ],
  },

  {
    name: 'Café proteico sin azúcar',
    description: 'Bebida proteica con base de café para empezar el día con energía y saciedad. Perfecta para las mañanas de ayuno o como pre-entreno ligero.',
    imageUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    category: 'bebida',
    accessLevel: 'basic',
    prepTime: 5,
    cookTime: 3,
    nutrition: { calories: 120, protein: 15, carbs: 5, fat: 4 },
    tags: ['bajas_calorias', 'perdida_peso', 'alto_proteico', 'pre_entreno', 'sin_azucar', 'energia'],
    isFeatured: false,
    ingredients: [
      { name: 'café negro', amount: '1', unit: 'taza' },
      { name: 'leche o bebida vegetal', amount: '100', unit: 'ml' },
      { name: 'proteína en polvo sabor vainilla', amount: '15', unit: 'g' },
      { name: 'hielo', amount: 'opcional', unit: '' },
    ],
    steps: [
      'Preparar el café y mezclarlo con la leche.',
      'Añadir la proteína en polvo y batir hasta disolver.',
      'Servir caliente o con hielo al gusto.',
    ],
  },

];

// ============================================================
// RUNNER
// ============================================================

async function seedRecipesV2() {
  try {
    await connectDB();
    console.log('\n🌱 Iniciando seed de recetas v2 (lote 1 — 24 recetas)...\n');

    // Evitar duplicados por nombre
    let inserted = 0;
    for (const recipe of recipes) {
      const exists = await Recipe.findOne({ name: recipe.name });
      if (exists) {
        console.log(`  ⏭️  Ya existe: ${recipe.name}`);
        continue;
      }
      await Recipe.create(recipe);
      console.log(`  ✅ Insertada: ${recipe.name}`);
      inserted++;
    }

    console.log(`\n✨ Seed v2 completado — ${inserted} recetas nuevas insertadas.\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}

seedRecipesV2();
