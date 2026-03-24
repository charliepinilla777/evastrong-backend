const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  name: {
    type: String,
    default: 'Anónima',
  },
  email: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  category: {
    type: String,
    enum: ['general', 'rutinas', 'dietas', 'app', 'soporte', 'otro'],
    default: 'general',
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  status: {
    type: String,
    enum: ['pending', 'read', 'replied'],
    default: 'pending',
  },
  adminReply: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
