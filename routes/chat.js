const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Middleware para verificar suscripción activa
const requireSubscription = async (req, res, next) => {
  if (!req.user.hasActiveSubscription()) {
    return res.status(403).json({
      success: false,
      message: 'Necesitas una suscripción activa para usar el chat',
    });
  }
  next();
};

// Aplicar auth + suscripción a todas las rutas
router.use(authMiddleware, requireSubscription);

// GET /chat/conversations — Lista DMs y grupos del usuario
router.get('/conversations', async (req, res) => {
  try {
    const rooms = await ChatRoom.find({
      participants: req.user._id,
    })
      .populate('participants', 'name avatar')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'name' },
      })
      .sort({ lastMessageAt: -1 });

    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /chat/messages/:roomId — Historial paginado
router.get('/messages/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 50;

    // Verificar que el usuario es participante
    const room = await ChatRoom.findOne({
      _id: roomId,
      participants: req.user._id,
    });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Sala no encontrada' });
    }

    const messages = await Message.find({ room: roomId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Marcar como leídos
    await Message.updateMany(
      { room: roomId, readBy: { $ne: req.user._id } },
      { $addToSet: { readBy: req.user._id } }
    );

    res.json({ success: true, data: messages.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /chat/rooms — Crear sala grupal
router.post('/rooms', async (req, res) => {
  try {
    const { name, participantIds } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'El nombre del grupo es requerido' });
    }

    const allParticipants = [
      req.user._id,
      ...participantIds.filter((id) => id !== req.user._id.toString()),
    ];

    const room = await ChatRoom.create({
      type: 'group',
      name: name.trim(),
      participants: allParticipants,
      createdBy: req.user._id,
    });

    const populated = await room.populate('participants', 'name avatar');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /chat/rooms/public — Listar salas grupales disponibles
router.get('/rooms/public', async (req, res) => {
  try {
    const rooms = await ChatRoom.find({ type: 'group' })
      .populate('participants', 'name avatar')
      .populate('createdBy', 'name')
      .sort({ lastMessageAt: -1 });

    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /chat/rooms/:roomId/join — Unirse a sala grupal
router.post('/rooms/:roomId/join', async (req, res) => {
  try {
    const room = await ChatRoom.findOne({ _id: req.params.roomId, type: 'group' });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Sala no encontrada' });
    }

    if (room.participants.some((p) => p.toString() === req.user._id.toString())) {
      return res.status(400).json({ success: false, message: 'Ya eres participante de esta sala' });
    }

    room.participants.push(req.user._id);
    await room.save();

    const populated = await room.populate('participants', 'name avatar');
    res.json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /chat/direct/:recipientId — Crear o recuperar DM
router.post('/direct/:recipientId', async (req, res) => {
  try {
    const { recipientId } = req.params;

    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'No puedes chatear contigo mismo' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Buscar DM existente entre los dos usuarios
    const existingRoom = await ChatRoom.findOne({
      type: 'direct',
      participants: { $all: [req.user._id, recipientId], $size: 2 },
    }).populate('participants', 'name avatar');

    if (existingRoom) {
      return res.json({ success: true, data: existingRoom });
    }

    // Crear nuevo DM
    const room = await ChatRoom.create({
      type: 'direct',
      participants: [req.user._id, recipientId],
    });

    const populated = await room.populate('participants', 'name avatar');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
