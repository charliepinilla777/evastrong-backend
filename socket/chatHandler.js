const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

module.exports = (io) => {
  // ========== MIDDLEWARE DE AUTENTICACIÓN ==========
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Token no proporcionado'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('Usuario no encontrado'));
      }

      if (!user.hasActiveSubscription()) {
        return next(new Error('Sin suscripción activa'));
      }

      socket.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(new Error('Token expirado'));
      }
      next(new Error('Token inválido'));
    }
  });

  // ========== CONEXIÓN ==========
  io.on('connection', (socket) => {
    console.log(`Socket conectado: ${socket.user.name} (${socket.id})`);

    // Unir al usuario a su sala personal (para notificaciones)
    socket.join(`user:${socket.user._id}`);

    // ========== join_room ==========
    socket.on('join_room', async ({ roomId }) => {
      try {
        const room = await ChatRoom.findOne({
          _id: roomId,
          participants: socket.user._id,
        });

        if (!room) {
          return socket.emit('error', { message: 'No tienes acceso a esta sala' });
        }

        socket.join(roomId);
        socket.emit('room_joined', { roomId });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // ========== leave_room ==========
    socket.on('leave_room', ({ roomId }) => {
      socket.leave(roomId);
      socket.emit('room_left', { roomId });
    });

    // ========== send_message ==========
    socket.on('send_message', async ({ roomId, content }) => {
      try {
        if (!content || !content.trim()) {
          return socket.emit('error', { message: 'El contenido no puede estar vacío' });
        }

        if (content.length > 1000) {
          return socket.emit('error', { message: 'Mensaje demasiado largo (máx. 1000 caracteres)' });
        }

        // Verificar que el usuario es participante
        const room = await ChatRoom.findOne({
          _id: roomId,
          participants: socket.user._id,
        });

        if (!room) {
          return socket.emit('error', { message: 'No tienes acceso a esta sala' });
        }

        // Crear mensaje en DB
        const message = await Message.create({
          sender: socket.user._id,
          room: roomId,
          content: content.trim(),
          readBy: [socket.user._id],
        });

        // Actualizar lastMessage en la sala
        await ChatRoom.findByIdAndUpdate(roomId, {
          lastMessage: message._id,
          lastMessageAt: message.createdAt,
        });

        const populated = await message.populate('sender', 'name avatar');

        // Emitir a todos en la sala
        io.to(roomId).emit('new_message', {
          _id: populated._id,
          roomId,
          sender: {
            _id: populated.sender._id,
            name: populated.sender.name,
            avatar: populated.sender.avatar,
          },
          content: populated.content,
          createdAt: populated.createdAt,
          readBy: populated.readBy,
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // ========== typing ==========
    socket.on('typing', ({ roomId }) => {
      socket.to(roomId).emit('user_typing', {
        userId: socket.user._id,
        userName: socket.user.name,
        roomId,
      });
    });

    // ========== stop_typing ==========
    socket.on('stop_typing', ({ roomId }) => {
      socket.to(roomId).emit('user_stop_typing', {
        userId: socket.user._id,
        roomId,
      });
    });

    // ========== mark_read ==========
    socket.on('mark_read', async ({ roomId }) => {
      try {
        await Message.updateMany(
          { room: roomId, readBy: { $ne: socket.user._id } },
          { $addToSet: { readBy: socket.user._id } }
        );

        socket.to(roomId).emit('messages_read', {
          userId: socket.user._id,
          roomId,
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // ========== desconexión ==========
    socket.on('disconnect', () => {
      console.log(`Socket desconectado: ${socket.user.name} (${socket.id})`);
    });
  });
};
