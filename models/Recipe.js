const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  name: { type: String, required: true, trim: true },
  amount: { type: String, required: true },
  unit: { type: String, trim: true, default: '' },
}, { _id: false });

const nutritionSchema = new Schema({
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },  // gramos
  carbs: { type: Number, default: 0 },    // gramos
  fat: { type: Number, default: 0 },      // gramos
}, { _id: false });

const recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  imageUrl: {
    type: String,
    trim: true,
  },

  // Categoría de comida
  category: {
    type: String,
    enum: ['desayuno', 'almuerzo', 'cena', 'merienda', 'snack', 'batido', 'bebida'],
    required: true,
  },

  // Nivel de acceso (igual que rutinas)
  accessLevel: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'premium',
  },

  // Ingredientes
  ingredients: [ingredientSchema],

  // Pasos de preparación
  steps: [{ type: String, trim: true }],

  // Información nutricional
  nutrition: {
    type: nutritionSchema,
    default: () => ({}),
  },

  // Tiempos (en minutos)
  prepTime: { type: Number, default: 0, min: 0 },
  cookTime: { type: Number, default: 0, min: 0 },

  // Metadatos
  tags: [String],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },

  // Traducciones al inglés (opcionales)
  nameEn: { type: String, trim: true, maxlength: 100 },
  descriptionEn: { type: String, trim: true, maxlength: 500 },
  ingredientsEn: [ingredientSchema],
  stepsEn: [{ type: String, trim: true }],
  tagsEn: [String],

  // Auditoría
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Actualizar updatedAt al guardar
recipeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Índices
recipeSchema.index({ category: 1, accessLevel: 1 });
recipeSchema.index({ isFeatured: -1, isActive: 1 });
recipeSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
