'use strict';

const express = require('express');
const path    = require('path');
const router  = express.Router();

/**
 * Sirve el panel web administrativo.
 * La URL secreta se configura en .env como ADMIN_PANEL_PATH.
 * Si no se define, usa un path por defecto (cámbialo antes de producción).
 *
 * Ejemplo en .env:
 *   ADMIN_PANEL_PATH=mi-panel-secreto-2025
 *
 * Acceso:  https://tu-backend.onrender.com/mi-panel-secreto-2025
 */
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin-panel.html'));
});

module.exports = router;
