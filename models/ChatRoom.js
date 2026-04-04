const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['direct', 'group'],
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Solo para grupos
    name: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Índice único compuesto para DMs (garantiza 1 sala por par de usuarios)
chatRoomSchema.index(
  { type: 1, participants: 1 },
  {
    unique: false, // No unique porque participantes son arrays, manejamos lógica en la ruta
    sparse: true,
  }
);

// Índices para búsquedas de salas por participante y actividad
chatRoomSchema.index({ participants: 1 });
chatRoomSchema.index({ createdBy: 1 });
chatRoomSchema.index({ type: 1, lastMessageAt: -1 });

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
