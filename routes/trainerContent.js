'use strict';

const express      = require('express');
const multer       = require('multer');
const path         = require('path');
const fs           = require('fs');
const router       = express.Router();
const trainerAuth  = require('../middleware/trainerAuth');
const Routine      = require('../models/Routine');
const Video        = require('../models/Video');
const Recipe       = require('../models/Recipe');
const Feedback     = require('../models/Feedback');

router.use(trainerAuth);

// ── Directorios de uploads (reutiliza los mismos del admin) ──────────────
const photosDir = path.join(__dirname, '../uploads/photos');
const videosDir = path.join(__dirname, '../uploads/videos');
[photosDir, videosDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ── Multer: fotos ────────────────────────────────────────────────────────
const photoUpload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, photosDir),
    filename:    (_, file, cb) => cb(null, 'photo-' + Date.now() + path.extname(file.originalname)),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Solo se permiten imágenes JPG, PNG, WEBP o GIF'));
  },
});

// ── Multer: videos ───────────────────────────────────────────────────────
const videoUpload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, videosDir),
    filename:    (_, file, cb) => cb(null, 'video-' + Date.now() + path.extname(file.originalname)),
  }),
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'].includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Formato no soportado. Use MP4, WebM o MOV'));
  },
});

// ════════════════════════════════════════════════════════════════════════
//  RUTINAS
// ════════════════════════════════════════════════════════════════════════

router.get('/routines', async (req, res) => {
  try {
    const routines = await Routine.find()
      .sort({ createdAt: -1 })
      .select('title category difficulty duration accessLevel isActive video createdAt')
      .lean();
    res.json({ routines });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/routines', async (req, res) => {
  try {
    const { title, description, category, difficulty, duration,
            accessLevel, videoUrl, thumbnail, tags } = req.body;

    if (!title || !duration) {
      return res.status(400).json({ success: false, error: 'Título y duración son requeridos' });
    }

    const routine = await Routine.create({
      title,
      description: description || '',
      category:    category    || 'other',
      difficulty:  difficulty  || 'beginner',
      duration:    Number(duration),
      accessLevel: accessLevel || 'free',
      video:       videoUrl ? { url: videoUrl } : undefined,
      thumbnail:   thumbnail  || '',
      tags:        tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      isActive:    true,
      createdBy:   req.user._id,
    });

    res.status(201).json({ success: true, routine });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.patch('/routines/:id', async (req, res) => {
  try {
    const routine = await Routine.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    );
    if (!routine) return res.status(404).json({ success: false, error: 'Rutina no encontrada' });
    res.json({ success: true, routine });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.delete('/routines/:id', async (req, res) => {
  try {
    await Routine.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ════════════════════════════════════════════════════════════════════════
//  VIDEOS
// ════════════════════════════════════════════════════════════════════════

router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 }).lean();
    res.json({ videos });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/videos/url', async (req, res) => {
  try {
    const { title, url, thumbnail, category } = req.body;
    if (!title || !url) {
      return res.status(400).json({ success: false, error: 'Título y URL son requeridos' });
    }
    const video = await Video.create({
      title,
      cloudUrl:  url,
      thumbnail: thumbnail || '',
      category:  category  || 'exercise',
      type:      'url',
    });
    res.status(201).json({ success: true, video });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/videos/upload', videoUpload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No se recibió archivo' });
    const video = await Video.create({
      title:    req.body.title || req.file.originalname,
      filepath: req.file.filename,
      category: req.body.category || 'exercise',
      type:     'local',
    });
    res.status(201).json({ success: true, video });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.delete('/videos/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (video?.filepath) {
      const fullPath = path.join(videosDir, video.filepath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ════════════════════════════════════════════════════════════════════════
//  FOTOS
// ════════════════════════════════════════════════════════════════════════

router.post('/photos/upload', photoUpload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No se recibió archivo' });
    const url = `/uploads/photos/${req.file.filename}`;
    res.status(201).json({ success: true, url, filename: req.file.filename });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get('/photos', (req, res) => {
  try {
    if (!fs.existsSync(photosDir)) return res.json({ photos: [] });
    const files = fs.readdirSync(photosDir)
      .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .map(f => ({ filename: f, url: `/uploads/photos/${f}` }));
    res.json({ photos: files });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.delete('/photos/:filename', (req, res) => {
  try {
    const filePath = path.join(photosDir, req.params.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ════════════════════════════════════════════════════════════════════════
//  RECETAS
// ════════════════════════════════════════════════════════════════════════

router.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 })
      .select('name category accessLevel prepTime isActive createdAt')
      .lean();
    res.json({ recipes });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/recipes', async (req, res) => {
  try {
    const {
      name, description, category, accessLevel,
      prepTime, calories, protein, carbs, fat,
      ingredients, steps, imageUrl,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, error: 'Nombre y categoría son requeridos' });
    }

    const recipe = await Recipe.create({
      name,
      description: description || '',
      category,
      accessLevel: accessLevel || 'free',
      prepTime:    Number(prepTime) || 0,
      imageUrl:    imageUrl || '',
      nutrition: {
        calories: Number(calories) || 0,
        protein:  Number(protein)  || 0,
        carbs:    Number(carbs)    || 0,
        fat:      Number(fat)      || 0,
      },
      ingredients: ingredients || [],
      steps:       steps       || [],
      isActive:    true,
    });

    res.status(201).json({ success: true, recipe });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.patch('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    );
    if (!recipe) return res.status(404).json({ success: false, error: 'Receta no encontrada' });
    res.json({ success: true, recipe });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.delete('/recipes/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ════════════════════════════════════════════════════════════════════════
//  COMENTARIOS (solo lectura)
// ════════════════════════════════════════════════════════════════════════

router.get('/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const total   = feedbacks.length;
    const unread  = feedbacks.filter(f => f.status === 'unread').length;
    const avgRating = total
      ? (feedbacks.reduce((s, f) => s + (f.rating || 0), 0) / total).toFixed(1)
      : 0;

    res.json({ success: true, feedbacks, stats: { total, unread, avgRating } });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.patch('/feedback/:id/read', async (req, res) => {
  try {
    await Feedback.findByIdAndUpdate(req.params.id, { status: 'read' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
