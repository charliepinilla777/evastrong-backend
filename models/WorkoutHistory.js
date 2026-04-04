const mongoose = require('mongoose');

const workoutHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  routineName: {
    type: String,
    required: true,
  },
  routineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Routine',
    default: null,
  },
  category: {
    type: String,
    default: 'general',
  },
  durationMinutes: {
    type: Number,
    required: true,
  },
  caloriesEstimated: {
    type: Number,
    default: 0,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

// Índices para historial del usuario y estadísticas de rutinas
workoutHistorySchema.index({ user: 1, completedAt: -1 });
workoutHistorySchema.index({ routineId: 1 });
workoutHistorySchema.index({ completedAt: -1 });
workoutHistorySchema.index({ user: 1, routineId: 1, completedAt: -1 });

module.exports = mongoose.model('WorkoutHistory', workoutHistorySchema);
