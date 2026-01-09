const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// ========== GOOGLE OAUTH ==========

// Iniciar login con Google
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Callback de Google
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = req.user.generateJWT();
    
    // Redirigir a la app Flutter con el token
    const deepLink = `com.evastrong.app://auth?token=${token}&userId=${req.user._id}`;
    res.redirect(deepLink);
  }
);

// ========== APPLE OAUTH ==========

// Iniciar login con Apple
router.get('/apple',
  passport.authenticate('apple', {
    scope: ['name', 'email']
  })
);

// Callback de Apple
router.get('/apple/callback',
  passport.authenticate('apple', { failureRedirect: '/login' }),
  (req, res) => {
    const token = req.user.generateJWT();
    
    // Redirigir a la app Flutter con el token
    const deepLink = `com.evastrong.app://auth?token=${token}&userId=${req.user._id}`;
    res.redirect(deepLink);
  }
);

// ========== REGISTRO MANUAL ==========

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres'),
  body('name').trim().not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { email, password, name } = req.body;
    
    // Verificar si usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado',
      });
    }
    
    // Crear nuevo usuario
    const user = await User.create({
      email,
      password,
      name,
      provider: 'local',
    });
    
    const token = user.generateJWT();
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ========== LOGIN MANUAL ==========

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { email, password } = req.body;
    
    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email o contraseña incorrectos',
      });
    }
    
    // Verificar contraseña
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Email o contraseña incorrectos',
      });
    }
    
    // Generar token
    const token = user.generateJWT();
    
    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();
    
    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ========== LOGOUT ==========

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json({ success: true, message: 'Logout exitoso' });
  });
});

// ========== VERIFICAR TOKEN ==========

router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado',
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      success: true,
      message: 'Token válido',
      userId: decoded.id,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
    });
  }
});

// ========== REFRESH TOKEN ==========

router.post('/refresh', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado',
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    
    res.json({
      success: true,
      message: 'Token renovado',
      token: newToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }
});

module.exports = router;
