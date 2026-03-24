'use strict';

const express = require('express');
const path    = require('path');
const router  = express.Router();

/**
 * Sirve el panel web del entrenador.
 * La URL secreta se configura en .env como TRAINER_PANEL_PATH.
 *
 * Ejemplo en .env:
 *   TRAINER_PANEL_PATH=mi-panel-entrenador-2025
 *
 * Acceso:  https://tu-backend.onrender.com/mi-panel-entrenador-2025
 */
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'trainer-panel.html'));
});

module.exports = router;
