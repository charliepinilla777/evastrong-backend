'use strict';

const express = require('express');
const router  = express.Router();
const Feedback = require('../models/Feedback');
const jwt = require('jsonwebtoken');

// Helper: obtener userId del token si existe (no obligatorio)
function optionalAuth(req) {
  try {
    const header = req.headers.authorization || '';
    const token  = header.replace('Bearer ', '');
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.id || payload._id || null;
  } catch {
    return null;
  }
}

// POST /feedback  — enviar comentario
router.post('/', async (req, res) => {
  try {
    const { name, email, rating, category, message } = req.body;

    if (!message || !rating) {
      return res.status(400).json({ success: false, message: 'El mensaje y la valoración son obligatorios.' });
    }

    const userId = optionalAuth(req);

    const feedback = await Feedback.create({
      userId,
      name:     name    || 'Anónima',
      email:    email   || '',
      rating:   Number(rating),
      category: category || 'general',
      message,
    });

    res.status(201).json({ success: true, message: '¡Gracias por tu comentario!', id: feedback._id });
  } catch (error) {
    console.error('Error al guardar feedback:', error);
    res.status(500).json({ success: false, message: 'Error al guardar tu comentario.' });
  }
});

module.exports = router;
