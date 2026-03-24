const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// ========== OBTENER PERFIL (alias /me y /profile) ==========

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ========== ACTUALIZAR PERFIL ==========

router.put('/profile', authMiddleware, [
  body('name').optional().trim().not().isEmpty(),
  body('phone').optional().trim(),
  body('age').optional().isInt(),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('fitnessLevel').optional().isIn(['beginner', 'intermediate', 'advanced']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const updates = {};
    const allowedFields = ['name', 'phone', 'age', 'gender', 'fitnessLevel', 'goals'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Perfil actualizado',
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ========== CAMBIAR CONTRASEÑA ==========

router.post('/change-password', authMiddleware, [
  body('currentPassword').not().isEmpty(),
  body('newPassword').isLength({ min: 8 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    
    // Verificar contraseña actual
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta',
      });
    }
    
    // Cambiar contraseña
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ========== OBTENER USUARIO POR ID ==========

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }
    
    res.json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ========== ELIMINAR CUENTA ==========

router.delete('/account/delete', authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Verificar contraseña
    if (user.password) {
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Contraseña incorrecta',
        });
      }
    }
    
    // Marcar como inactivo en lugar de eliminar
    user.active = false;
    await user.save();
    
    res.json({
      success: true,
      message: 'Cuenta eliminada',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
