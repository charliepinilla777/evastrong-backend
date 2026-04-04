require('dotenv').config();
const Recipe = require('../models/Recipe');
const connectDB = require('../config/database');

// ============================================================
// 23 recetas nuevas — lote 2 (completa las 50 junto con V2)
// Categorías: almuerzo, desayuno, snack, bebida, batido, cena
// ============================================================

const recipes = [

  // ===================== ALMUERZOS ========================

  {
    name: 'Pollo al horno con verduras arcoíris',
    description: 'Pechuga de pollo jugosa con una bandeja de verduras de colores horneadas al punto. Ligero, completo y cargado de vitaminas. Ideal para bajar peso sin renunciar al sabor.',
    imageUrl: 'https://images.pexels.com/photos/4106480/pexels-photo-4106480.jpeg',
    category: 'almuerzo',
    accessLevel: 'free',
    prepTime: 5,
    cookTime: 25,
    nutrition: { calories: 380, protein: 35, carbs: 18, fat: 18 },
    tags: ['bajas_calorias', 'perdida_peso', 'saludable', 'alto_proteico', 'bajo_grasa', 'horno'],
    isFeatured: true,
    ingredients: [
      { name: 'pechuga de pollo', amount: '120', unit: 'g' },
      { name: 'zanahoria en bastones', amount: '1/2', unit: 'taza' },
      { name: 'brócoli', amount: '1/2', unit: 'taza' },
      { name: 'pimentón en tiras', amount: '1/2', unit: 'taza' },
      { name: 'aceite de oliva', amount: '10', unit: 'ml' },
      { name: 'sal, pimienta y ajo en polvo', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Precalentar el horno a 180°C.',
      'Colocar el pollo y las verduras en una bandeja, añadir aceite y especias.',
      'Mezclar bien para cubrir todo.',
      'Hornear 20–25 minutos hasta que el pollo esté cocido y las verduras tiernas.',
    ],
  },

  {
    name: 'Filete de pescado con ensalada de col',
    description: 'Pescado a la plancha con ensalada crujiente de col y zanahoria. Bajo en calorías y alto en omega-3 si se usa salmón, ideal para la piel y el corazón.',
    imageUrl: 'https://images.pexels.com/photos/3296273/pexels-photo-3296273.jpeg',
    category: 'almuerzo',
    accessLevel: 'free',
    prepTime: 10,
    cookTime: 12,
    nutrition: { calories: 320, protein: 30, carbs: 10, fat: 18 },
    tags: ['bajas_calorias', 'perdida_peso', 'piel_radiante', 'omega3', 'bajo_grasa', 'cardiaco'],
    isFeatured: false,
    ingredients: [
      { name: 'filete de pescado (merluza, salmón o similar)', amount: '120', unit: 'g' },
      { name: 'col rallada', amount: '1', unit: 'taza' },
      { name: 'zanahoria rallada', amount: '1/4', unit: 'taza' },
      { name: 'aceite de oliva', amount: '10', unit: 'ml' },
      { name: 'jugo de limón', amount: '1/2', unit: 'limón' },
      { name: 'sal y pimienta', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Salpimentar el filete y cocinarlo a la plancha o al horno hasta que esté en su punto.',
      'Mezclar col y zanahoria ralladas con aceite, limón, sal y pimienta.',
      'Servir el pescado junto con la ensalada de col.',
    ],
  },

  {
    name: 'Pasta integral con atún y tomate',
    description: 'Pasta integral con atún y sofrito de tomate. Plato clásico mediterráneo cargado de carbohidratos complejos y proteína magra, perfecto para los días de entrenamiento de piernas.',
    imageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    category: 'almuerzo',
    accessLevel: 'free',
    prepTime: 5,
    cookTime: 20,
    nutrition: { calories: 520, protein: 30, carbs: 70, fat: 14 },
    tags: ['altas_calorias', 'gluteos_piernas', 'energia', 'carbohidratos', 'pre_entreno', 'masa_muscular'],
    isFeatured: false,
    ingredients: [
      { name: 'pasta integral', amount: '70', unit: 'g (en crudo)' },
      { name: 'atún en agua escurrido', amount: '80', unit: 'g' },
      { name: 'tomate picado', amount: '1', unit: 'unidad' },
      { name: 'cebolla', amount: '1/4', unit: 'unidad' },
      { name: 'aceite de oliva', amount: '10', unit: 'ml' },
      { name: 'sal, pimienta y orégano', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Cocinar la pasta según las instrucciones del paquete.',
      'Saltear cebolla y tomate con aceite hasta que se ablanden.',
      'Agregar el atún y la pasta escurrida, mezclar bien.',
      'Sazonar con sal, pimienta y orégano.',
    ],
  },

  {
    name: 'Salteado de ternera magra con brócoli',
    description: 'Salteado asiático de carne magra con brócoli. Alto en proteína, hierro y creatina natural para apoyar el crecimiento muscular de glúteos y piernas.',
    imageUrl: 'https://images.pexels.com/photos/4106480/pexels-photo-4106480.jpeg',
    category: 'almuerzo',
    accessLevel: 'basic',
    prepTime: 10,
    cookTime: 12,
    nutrition: { calories: 340, protein: 30, carbs: 10, fat: 18 },
    tags: ['alto_proteico', 'musculacion', 'gluteos_piernas', 'masa_muscular', 'hierro'],
    isFeatured: false,
    ingredients: [
      { name: 'carne de res magra en tiras', amount: '100', unit: 'g' },
      { name: 'brócoli', amount: '1', unit: 'taza' },
      { name: 'pimentón', amount: '1/4', unit: 'taza' },
      { name: 'aceite de oliva', amount: '5', unit: 'ml' },
      { name: 'salsa de soya baja en sodio', amount: '10', unit: 'ml' },
      { name: 'ajo y jengibre', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Saltear ajo y jengibre picados con el aceite.',
      'Añadir la carne en tiras y dorar 3–4 minutos.',
      'Incorporar brócoli y pimentón, saltear 3 minutos más.',
      'Agregar la salsa de soya, mezclar y servir.',
    ],
  },

  {
    name: 'Ensalada de pollo, frijoles negros y aguacate',
    description: 'Ensalada completa con las tres macros en equilibrio. El aguacate y los frijoles aportan grasas y fibra saciante, mientras el pollo proporciona proteína de calidad.',
    imageUrl: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    category: 'almuerzo',
    accessLevel: 'basic',
    prepTime: 10,
    cookTime: 10,
    nutrition: { calories: 420, protein: 28, carbs: 28, fat: 22 },
    tags: ['gluteos_piernas', 'saludable', 'alta_fibra', 'saciante', 'aguacate'],
    isFeatured: false,
    ingredients: [
      { name: 'pechuga de pollo a la plancha en cubos', amount: '80', unit: 'g' },
      { name: 'frijoles negros cocidos', amount: '60', unit: 'g' },
      { name: 'lechuga', amount: '1', unit: 'taza' },
      { name: 'aguacate', amount: '1/4', unit: 'unidad' },
      { name: 'tomate', amount: '1/4', unit: 'taza' },
      { name: 'aceite de oliva', amount: '10', unit: 'ml' },
      { name: 'jugo de limón, sal y pimienta', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Colocar la lechuga en un bowl.',
      'Añadir pollo, frijoles, tomate y aguacate.',
      'Aliñar con aceite, limón, sal y pimienta.',
      'Mezclar suavemente y servir.',
    ],
  },

  {
    name: 'Ensalada de garbanzos con atún',
    description: 'Combinación perfecta de proteína animal y vegetal con fibra. Súper saciante y lista en minutos, sin cocción extra si usas garbanzos de bote.',
    imageUrl: 'https://images.pexels.com/photos/4106480/pexels-photo-4106480.jpeg',
    category: 'almuerzo',
    accessLevel: 'basic',
    prepTime: 8,
    cookTime: 0,
    nutrition: { calories: 360, protein: 28, carbs: 24, fat: 16 },
    tags: ['bajas_calorias', 'perdida_peso', 'saciante', 'alta_fibra', 'sin_coccion'],
    isFeatured: false,
    ingredients: [
      { name: 'garbanzos cocidos', amount: '80', unit: 'g' },
      { name: 'atún en agua escurrido', amount: '80', unit: 'g' },
      { name: 'cebolla picada', amount: '1/4', unit: 'taza' },
      { name: 'pimentón en cubos', amount: '1/4', unit: 'taza' },
      { name: 'aceite de oliva', amount: '10', unit: 'ml' },
      { name: 'jugo de limón, sal y pimienta', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Mezclar garbanzos, atún, cebolla y pimentón en un bowl.',
      'Aliñar con aceite, limón, sal y pimienta.',
      'Servir fría.',
    ],
  },

  {
    name: 'Zoodles de calabacín con pollo',
    description: 'Sustituto de pasta sin carbohidratos: fideos de calabacín salteados con pollo y tomates cherry. Perfecto para los días de déficit calórico estricto.',
    imageUrl: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg',
    category: 'almuerzo',
    accessLevel: 'premium',
    prepTime: 10,
    cookTime: 12,
    nutrition: { calories: 260, protein: 30, carbs: 8, fat: 11 },
    tags: ['bajas_calorias', 'perdida_peso', 'bajo_carbo', 'bajo_azucar', 'light', 'definicion'],
    isFeatured: true,
    ingredients: [
      { name: 'pechuga de pollo en tiras', amount: '100', unit: 'g' },
      { name: 'calabacín grande en espiral (zoodles)', amount: '1', unit: 'unidad' },
      { name: 'tomate cherry', amount: '1/4', unit: 'taza' },
      { name: 'diente de ajo', amount: '1', unit: 'unidad' },
      { name: 'aceite de oliva', amount: '5', unit: 'ml' },
      { name: 'sal, pimienta y orégano', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Saltear el ajo picado en aceite a fuego medio.',
      'Añadir el pollo y dorar 4–5 minutos.',
      'Agregar los zoodles y los tomates cherry, cocinar 3–4 minutos.',
      'Sazonar con sal, pimienta y orégano.',
    ],
  },

  {
    name: 'Ensalada de lentejas con pollo y manzana',
    description: 'Combinación original y nutritiva de lentejas, pollo y manzana que une proteína, fibra y un toque dulce natural. Saciante y perfecta para controlar el apetito.',
    imageUrl: 'https://images.pexels.com/photos/1435895/pexels-photo-1435895.jpeg',
    category: 'almuerzo',
    accessLevel: 'premium',
    prepTime: 10,
    cookTime: 0,
    nutrition: { calories: 380, protein: 28, carbs: 35, fat: 12 },
    tags: ['bajas_calorias', 'perdida_peso', 'saciante', 'alta_fibra', 'equilibrado'],
    isFeatured: false,
    ingredients: [
      { name: 'lentejas cocidas', amount: '80', unit: 'g' },
      { name: 'pechuga de pollo a la plancha en tiras', amount: '80', unit: 'g' },
      { name: 'manzana en cubos', amount: '1/4', unit: 'unidad' },
      { name: 'tomate', amount: '1/4', unit: 'taza' },
      { name: 'cebolla', amount: '1/4', unit: 'taza' },
      { name: 'aceite de oliva', amount: '10', unit: 'ml' },
      { name: 'jugo de limón, sal y pimienta', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Mezclar lentejas, pollo, manzana, tomate y cebolla.',
      'Aliñar con aceite, limón, sal y pimienta.',
      'Servir fría.',
    ],
  },

  {
    name: 'Caldo de albóndigas ligero',
    description: 'Caldo reconfortante con albóndigas de carne magra y verduras. Nutritivo, alto en proteína y mucho más ligero que la versión tradicional.',
    imageUrl: 'https://images.pexels.com/photos/6287521/pexels-photo-6287521.jpeg',
    category: 'almuerzo',
    accessLevel: 'premium',
    prepTime: 15,
    cookTime: 25,
    nutrition: { calories: 320, protein: 26, carbs: 22, fat: 12 },
    tags: ['saludable', 'alto_proteico', 'recuperacion', 'digestivo', 'casero'],
    isFeatured: false,
    ingredients: [
      { name: 'carne molida magra', amount: '80', unit: 'g' },
      { name: 'clara de huevo', amount: '1', unit: 'unidad' },
      { name: 'pan rallado integral', amount: '1', unit: 'cda' },
      { name: 'zanahoria', amount: '1/2', unit: 'unidad' },
      { name: 'papa pequeña', amount: '1/2', unit: 'unidad' },
      { name: 'calabacín', amount: '1/4', unit: 'unidad' },
      { name: 'caldo de verduras', amount: '400', unit: 'ml' },
      { name: 'sal, pimienta y cilantro', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Mezclar la carne con la clara, el pan rallado, sal y pimienta y formar albóndigas pequeñas.',
      'Hervir el caldo con las verduras en cubos.',
      'Añadir las albóndigas y cocinar a fuego medio 20 minutos.',
      'Terminar con cilantro picado y servir.',
    ],
  },

  {
    name: 'Bowl veggie de tofu y quinoa',
    description: 'Bowl vegetariano completo con proteína vegetal de tofu y quinoa. Libre de carne, alto en aminoácidos esenciales y perfecto para la salud general.',
    imageUrl: 'https://images.pexels.com/photos/4106480/pexels-photo-4106480.jpeg',
    category: 'almuerzo',
    accessLevel: 'premium',
    prepTime: 10,
    cookTime: 15,
    nutrition: { calories: 420, protein: 24, carbs: 38, fat: 18 },
    tags: ['vegetariano', 'saludable', 'alto_proteico', 'equilibrado', 'sin_carne'],
    isFeatured: false,
    ingredients: [
      { name: 'tofu firme en cubos', amount: '100', unit: 'g' },
      { name: 'quinoa cocida', amount: '60', unit: 'g' },
      { name: 'brócoli', amount: '1', unit: 'taza' },
      { name: 'zanahoria', amount: '1/4', unit: 'taza' },
      { name: 'aceite de oliva', amount: '10', unit: 'ml' },
      { name: 'salsa de soya baja en sodio', amount: 'al gusto', unit: '' },
      { name: 'ajo y pimienta', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Dorar el tofu en sartén con un poco de aceite hasta que esté dorado.',
      'Añadir brócoli y zanahoria y saltear 4 minutos.',
      'Agregar salsa de soya y ajo, mezclar.',
      'Servir sobre la quinoa cocida.',
    ],
  },

  // ===================== DESAYUNOS ========================

  {
    name: 'Arepa integral con huevo y aguacate',
    description: 'Versión fit del desayuno latino por excelencia. La arepa integral aporta energía sostenida, el huevo proteína y el aguacate grasas saludables para un entrenamiento de calidad.',
    imageUrl: 'https://images.pexels.com/photos/7045691/pexels-photo-7045691.jpeg',
    category: 'desayuno',
    accessLevel: 'basic',
    prepTime: 5,
    cookTime: 12,
    nutrition: { calories: 340, protein: 18, carbs: 36, fat: 14 },
    tags: ['gluteos_piernas', 'energia', 'carbohidratos', 'saciante', 'latino'],
    isFeatured: false,
    ingredients: [
      { name: 'arepa integral pequeña', amount: '1', unit: 'unidad' },
      { name: 'huevo', amount: '1', unit: 'unidad' },
      { name: 'clara de huevo', amount: '1', unit: 'unidad' },
      { name: 'aguacate', amount: '1/4', unit: 'unidad' },
      { name: 'sal y pimienta', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Asar la arepa en plancha o comal hasta que esté dorada por ambos lados.',
      'Cocinar el huevo y la clara revueltos con sal y pimienta.',
      'Abrir la arepa y rellenar con el huevo y el aguacate en láminas.',
    ],
  },

  {
    name: 'Overnight oats de mango y chía',
    description: 'Avena nocturna cremosa con mango tropical y semillas de chía. Rica en vitamina C y antioxidantes que benefician la piel y favorecen la hidratación celular.',
    imageUrl: 'https://images.pexels.com/photos/3731474/pexels-photo-3731474.jpeg',
    category: 'desayuno',
    accessLevel: 'premium',
    prepTime: 5,
    cookTime: 0,
    nutrition: { calories: 260, protein: 9, carbs: 42, fat: 7 },
    tags: ['piel_radiante', 'vitamina_c', 'antioxidante', 'sin_coccion', 'prep_adelantada'],
    isFeatured: false,
    ingredients: [
      { name: 'avena', amount: '40', unit: 'g' },
      { name: 'leche o bebida vegetal', amount: '150', unit: 'ml' },
      { name: 'mango en cubos', amount: '1/2', unit: 'taza' },
      { name: 'semillas de chía', amount: '10', unit: 'g' },
      { name: 'stevia', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Mezclar avena, leche y chía en un frasco.',
      'Añadir los cubos de mango.',
      'Tapar y refrigerar mínimo 4 horas o toda la noche.',
      'Servir frío.',
    ],
  },

  {
    name: 'Tostadas con ricotta y frutos rojos',
    description: 'Desayuno antioxidante con proteína de la ricotta y el poder de los frutos rojos para combatir ojeras, mejorar la luminosidad de la piel y saciar sin exceso de calorías.',
    imageUrl: 'https://images.pexels.com/photos/1438082/pexels-photo-1438082.jpeg',
    category: 'desayuno',
    accessLevel: 'premium',
    prepTime: 5,
    cookTime: 3,
    nutrition: { calories: 260, protein: 12, carbs: 34, fat: 8 },
    tags: ['piel_radiante', 'antioxidante', 'vitamina_c', 'bajas_calorias', 'light'],
    isFeatured: true,
    ingredients: [
      { name: 'pan integral', amount: '2', unit: 'rebanadas' },
      { name: 'ricotta light o queso fresco bajo en grasa', amount: '40', unit: 'g' },
      { name: 'frutos rojos', amount: '40', unit: 'g' },
      { name: 'miel', amount: '5', unit: 'g' },
    ],
    steps: [
      'Tostar el pan integral.',
      'Untar la ricotta sobre cada tostada.',
      'Colocar los frutos rojos encima.',
      'Terminar con un hilo de miel.',
    ],
  },

  // ===================== SNACKS ========================

  {
    name: 'Rollitos de jamón de pavo y queso',
    description: 'Snack sin carbohidratos, altísimo en proteína y listo en segundos. Perfecto para calmar el hambre entre comidas sin sumar calorías vacías.',
    imageUrl: 'https://images.pexels.com/photos/4106480/pexels-photo-4106480.jpeg',
    category: 'snack',
    accessLevel: 'free',
    prepTime: 3,
    cookTime: 0,
    nutrition: { calories: 160, protein: 20, carbs: 2, fat: 8 },
    tags: ['bajas_calorias', 'perdida_peso', 'alto_proteico', 'bajo_carbo', 'sin_coccion', 'definicion'],
    isFeatured: false,
    ingredients: [
      { name: 'jamón de pavo', amount: '60', unit: 'g' },
      { name: 'queso bajo en grasa', amount: '40', unit: 'g' },
      { name: 'hojas de lechuga', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Colocar una loncha de queso sobre cada loncha de jamón.',
      'Enrollar y sujetar con un palillo si es necesario.',
      'Acompañar con hojas de lechuga.',
    ],
  },

  {
    name: 'Mini bowl de fruta y yogur',
    description: 'Snack sencillo y antioxidante que cuida la piel desde adentro. El yogur griego aporta proteína y probióticos, mientras las frutas brindan vitaminas y enzimas naturales.',
    imageUrl: 'https://images.pexels.com/photos/4144202/pexels-photo-4144202.jpeg',
    category: 'snack',
    accessLevel: 'free',
    prepTime: 3,
    cookTime: 0,
    nutrition: { calories: 140, protein: 9, carbs: 20, fat: 3 },
    tags: ['piel_radiante', 'probioticos', 'antioxidante', 'vitamina_c', 'sin_coccion', 'bajas_calorias'],
    isFeatured: false,
    ingredients: [
      { name: 'yogur griego', amount: '100', unit: 'g' },
      { name: 'plátano en rodajas', amount: '1/2', unit: 'unidad' },
      { name: 'fresas', amount: '20', unit: 'g' },
      { name: 'canela', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Colocar el yogur en un bowl pequeño.',
      'Añadir el plátano en rodajas y las fresas.',
      'Espolvorear canela y servir.',
    ],
  },

  {
    name: 'Ensalada caprese ligera',
    description: 'La caprese en versión fit: mozzarella light, tomate fresco y albahaca. Ligera, antiinflamatoria y perfecta como snack o acompañamiento.',
    imageUrl: 'https://images.pexels.com/photos/5949880/pexels-photo-5949880.jpeg',
    category: 'snack',
    accessLevel: 'basic',
    prepTime: 5,
    cookTime: 0,
    nutrition: { calories: 190, protein: 12, carbs: 6, fat: 14 },
    tags: ['saludable', 'antiinflamatorio', 'sin_coccion', 'light', 'bajo_carbo'],
    isFeatured: false,
    ingredients: [
      { name: 'mozzarella fresca light', amount: '60', unit: 'g' },
      { name: 'tomate en rodajas', amount: '1', unit: 'unidad' },
      { name: 'hojas de albahaca', amount: 'al gusto', unit: '' },
      { name: 'aceite de oliva', amount: '5', unit: 'ml' },
      { name: 'sal y pimienta', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Alternar rodajas de tomate y mozzarella en un plato.',
      'Decorar con hojas de albahaca.',
      'Aliñar con aceite de oliva, sal y pimienta.',
    ],
  },

  {
    name: 'Garbanzos tostados especiados',
    description: 'Snack crujiente y saciante con fibra y proteína vegetal. La alternativa saludable a las papas fritas, con el bonus de las especias antiinflamatorias.',
    imageUrl: 'https://images.pexels.com/photos/3730951/pexels-photo-3730951.jpeg',
    category: 'snack',
    accessLevel: 'basic',
    prepTime: 5,
    cookTime: 25,
    nutrition: { calories: 180, protein: 7, carbs: 28, fat: 5 },
    tags: ['bajas_calorias', 'perdida_peso', 'alta_fibra', 'saciante', 'vegano', 'antiinflamatorio'],
    isFeatured: false,
    ingredients: [
      { name: 'garbanzos cocidos', amount: '80', unit: 'g' },
      { name: 'aceite de oliva', amount: '5', unit: 'ml' },
      { name: 'sal, pimentón y comino', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Secar bien los garbanzos con papel absorbente.',
      'Mezclar con aceite y especias hasta cubrir uniformemente.',
      'Hornear a 180°C durante 20–25 minutos, moviendo a mitad de tiempo.',
      'Dejar enfriar para que queden crujientes.',
    ],
  },

  {
    name: 'Barritas caseras de avena y frutos secos',
    description: 'Barritas energéticas sin azúcar añadida. Ideales como pre-entreno para rutinas de glúteos y piernas: energía sostenida gracias a los carbohidratos complejos y las grasas saludables.',
    imageUrl: 'https://images.pexels.com/photos/5946087/pexels-photo-5946087.jpeg',
    category: 'snack',
    accessLevel: 'premium',
    prepTime: 10,
    cookTime: 0,
    nutrition: { calories: 220, protein: 7, carbs: 26, fat: 9 },
    tags: ['pre_entreno', 'energia', 'gluteos_piernas', 'carbohidratos', 'sin_coccion'],
    isFeatured: true,
    ingredients: [
      { name: 'avena', amount: '60', unit: 'g' },
      { name: 'miel', amount: '15', unit: 'g' },
      { name: 'mantequilla de maní', amount: '15', unit: 'g' },
      { name: 'nueces picadas', amount: '10', unit: 'g' },
      { name: 'semillas de chía o linaza', amount: '10', unit: 'g' },
      { name: 'agua', amount: '20', unit: 'ml' },
    ],
    steps: [
      'Mezclar todos los ingredientes hasta obtener una masa compacta.',
      'Colocar en un molde pequeño forrado con papel film y presionar bien.',
      'Refrigerar 2 horas mínimo.',
      'Cortar en barritas y conservar en nevera.',
    ],
  },

  // ===================== BEBIDAS ========================

  {
    name: 'Latte dorado (golden milk)',
    description: 'Bebida antiinflamatoria por excelencia. La cúrcuma y el jengibre reducen la inflamación, mejoran la circulación y contribuyen a una piel luminosa y sin ojeras.',
    imageUrl: 'https://images.pexels.com/photos/5938241/pexels-photo-5938241.jpeg',
    category: 'bebida',
    accessLevel: 'basic',
    prepTime: 3,
    cookTime: 5,
    nutrition: { calories: 120, protein: 6, carbs: 18, fat: 4 },
    tags: ['antiinflamatorio', 'piel_radiante', 'digestivo', 'suave', 'sin_azucar'],
    isFeatured: true,
    ingredients: [
      { name: 'leche o bebida vegetal', amount: '200', unit: 'ml' },
      { name: 'cúrcuma en polvo', amount: '1/2', unit: 'cdta' },
      { name: 'jengibre en polvo', amount: '1/4', unit: 'cdta' },
      { name: 'pimienta negra', amount: '1', unit: 'pizca' },
      { name: 'miel', amount: '1', unit: 'cdta' },
    ],
    steps: [
      'Calentar la leche en una olla a fuego suave.',
      'Añadir cúrcuma, jengibre y pimienta negra, mezclar bien con varilla.',
      'Endulzar con miel.',
      'Servir caliente.',
    ],
  },

  {
    name: 'Té frío de frutos rojos',
    description: 'Bebida refrescante sin calorías con el poder antioxidante de los frutos rojos. Hidrata, reduce la inflamación y aporta vitamina C para la piel.',
    imageUrl: 'https://images.pexels.com/photos/4146120/pexels-photo-4146120.jpeg',
    category: 'bebida',
    accessLevel: 'free',
    prepTime: 5,
    cookTime: 5,
    nutrition: { calories: 35, protein: 0, carbs: 9, fat: 0 },
    tags: ['bajas_calorias', 'piel_radiante', 'antioxidante', 'vitamina_c', 'hidratacion', 'sin_azucar'],
    isFeatured: false,
    ingredients: [
      { name: 'té verde o negro', amount: '1', unit: 'taza' },
      { name: 'fresas en rodajas', amount: '4–5', unit: 'unidades' },
      { name: 'arándanos', amount: '1/4', unit: 'taza' },
      { name: 'hielo', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Preparar el té y dejar enfriar a temperatura ambiente.',
      'Añadir las fresas y arándanos.',
      'Agregar hielo y servir frío.',
    ],
  },

  // ===================== BATIDOS ========================

  {
    name: 'Batido proteico de café frío',
    description: 'Batido que combina el efecto termogénico del café con proteína en polvo. Potencia la pérdida de grasa, mejora el foco mental y sacia durante horas.',
    imageUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    category: 'batido',
    accessLevel: 'premium',
    prepTime: 5,
    cookTime: 0,
    nutrition: { calories: 150, protein: 20, carbs: 6, fat: 4 },
    tags: ['bajas_calorias', 'perdida_peso', 'alto_proteico', 'pre_entreno', 'energia', 'sin_azucar'],
    isFeatured: false,
    ingredients: [
      { name: 'café frío', amount: '1', unit: 'taza' },
      { name: 'bebida vegetal', amount: '150', unit: 'ml' },
      { name: 'proteína en polvo (sabor neutro o vainilla)', amount: '1', unit: 'scoop (25g)' },
      { name: 'hielo', amount: 'al gusto', unit: '' },
      { name: 'stevia', amount: 'opcional', unit: '' },
    ],
    steps: [
      'Colocar el café, la bebida vegetal, la proteína y el hielo en la licuadora.',
      'Licuar hasta que quede espumoso y sin grumos.',
      'Endulzar con stevia si se desea.',
      'Servir inmediatamente.',
    ],
  },

  // ===================== CENAS ========================

  {
    name: 'Tortilla francesa de espinaca y queso light',
    description: 'Cena proteica y muy baja en carbohidratos. La espinaca aporta hierro y ácido fólico, y el queso light añade calcio sin exceso de grasas.',
    imageUrl: 'https://images.pexels.com/photos/3731471/pexels-photo-3731471.jpeg',
    category: 'cena',
    accessLevel: 'basic',
    prepTime: 5,
    cookTime: 8,
    nutrition: { calories: 260, protein: 28, carbs: 3, fat: 14 },
    tags: ['bajas_calorias', 'perdida_peso', 'alto_proteico', 'bajo_carbo', 'definicion', 'hierro'],
    isFeatured: false,
    ingredients: [
      { name: 'huevos', amount: '2', unit: 'unidades' },
      { name: 'claras de huevo', amount: '2', unit: 'unidades' },
      { name: 'espinaca', amount: '1/2', unit: 'taza' },
      { name: 'queso bajo en grasa', amount: '20', unit: 'g' },
      { name: 'sal y pimienta', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Batir los huevos y las claras con sal y pimienta.',
      'Verter en sartén antiadherente y cocinar a fuego medio.',
      'Añadir espinaca salteada y queso en el centro cuando la tortilla empiece a cuajar.',
      'Doblar y servir.',
    ],
  },

  {
    name: 'Pechuga a la plancha con puré de coliflor',
    description: 'Cena low-carb de alta proteína: pollo jugoso a la plancha sobre un cremoso puré de coliflor como alternativa saludable al puré de papa tradicional.',
    imageUrl: 'https://images.pexels.com/photos/4106480/pexels-photo-4106480.jpeg',
    category: 'cena',
    accessLevel: 'premium',
    prepTime: 10,
    cookTime: 20,
    nutrition: { calories: 300, protein: 35, carbs: 10, fat: 12 },
    tags: ['bajas_calorias', 'perdida_peso', 'bajo_carbo', 'bajo_azucar', 'alto_proteico', 'definicion'],
    isFeatured: true,
    ingredients: [
      { name: 'pechuga de pollo', amount: '120', unit: 'g' },
      { name: 'coliflor', amount: '150', unit: 'g' },
      { name: 'aceite de oliva', amount: '5', unit: 'ml' },
      { name: 'leche o bebida vegetal', amount: '10', unit: 'ml' },
      { name: 'sal, pimienta y ajo en polvo', amount: 'al gusto', unit: '' },
    ],
    steps: [
      'Cocinar la coliflor al vapor hasta que esté muy blanda.',
      'Triturar con leche, sal y pimienta hasta obtener puré liso.',
      'Cocinar el pollo a la plancha con sal, pimienta y ajo en polvo.',
      'Servir el pollo sobre el puré de coliflor.',
    ],
  },

];

// ============================================================
// RUNNER
// ============================================================

async function seedRecipesV3() {
  try {
    await connectDB();
    console.log('\n🌱 Iniciando seed de recetas v3 (lote 2 — 23 recetas)...\n');

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

    console.log(`\n✨ Seed v3 completado — ${inserted} recetas nuevas insertadas.\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}

seedRecipesV3();
