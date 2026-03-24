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

module.exports = mongoose.model('WorkoutHistory', workoutHistorySchema);
