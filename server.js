require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Importar estrategias de autenticación
require('./config/passport');

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');
const subscriptionRoutes = require('./routes/subscriptions');

// Inicializar app
const app = express();
const PORT = process.env.PORT || 5000;

// ========== MIDDLEWARES ==========

// Seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Demasiadas solicitudes, intenta más tarde',
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Session
app.use(session({
  secret: process.env.JWT_SECRET || 'tu-secreto-seguro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only en producción
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
  },
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// ========== CONEXIÓN BASE DE DATOS ==========

const connectDB = require('./config/database');
connectDB();

// ========== RUTAS ==========

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Autenticación
app.use('/auth', authRoutes);

// Usuarios
app.use('/users', userRoutes);

// Pagos
app.use('/payments', paymentRoutes);

// Suscripciones
app.use('/subscriptions', subscriptionRoutes);

// ========== MANEJO DE ERRORES ==========

app.use((err, req, res, next) => {
  console.error(err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err }),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// ========== INICIAR SERVIDOR ==========

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🎉 Eva Strong Backend - Iniciado        ║
╠════════════════════════════════════════════╣
║   Servidor: http://localhost:${PORT}            ║
║   Ambiente: ${process.env.NODE_ENV || 'development'}         ║
║   Base de datos: Conectada                 ║
╚════════════════════════════════════════════╝
  `);
});

module.exports = app;
