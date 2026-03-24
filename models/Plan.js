const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealSchema = new Schema({
  mealType: {
    type: String,
    enum: ['desayuno', 'snack_manana', 'almuerzo', 'snack_tarde', 'cena', 'post_entreno'],
    required: true,
  },
  label: { type: String, required: true }, // "Desayuno", "Snack mañana", etc.
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
  optional: { type: Boolean, default: false },
  note: { type: String, trim: true }, // "Solo si entrenas este día"
}, { _id: false });

const planSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  dayNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 7,
  },
  theme: {
    type: String,
    enum: ['perdida_peso', 'gluteos_piernas', 'piel_radiante', 'saciedad', 'gluteos_heavy', 'bienestar', 'equilibrado'],
    required: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 300,
  },
  // Acceso al plan (todos los planes son visibles, pero las comidas premium se bloquean)
  accessLevel: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free',
  },
  meals: [mealSchema],
  nutrition: {
    caloriesMin: { type: Number, default: 0 },
    caloriesMax: { type: Number, default: 0 },
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

planSchema.index({ dayNumber: 1 });
planSchema.index({ theme: 1 });

module.exports = mongoose.model('Plan', planSchema);
