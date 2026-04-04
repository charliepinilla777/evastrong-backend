'use strict';

const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const router   = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Routine  = require('../models/Routine');
const Video    = require('../models/Video');

router.use(adminAuth);

// ── Directorios de uploads ────────────────────────────────────────────────
const photosDir = path.join(__dirname, '../uploads/photos');
const videosDir = path.join(__dirname, '../uploads/videos');
[photosDir, videosDir].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

// ── Multer: fotos ─────────────────────────────────────────────────────────
const photoUpload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, photosDir),
    filename:    (_, file, cb) => cb(null, 'photo-' + Date.now() + path.extname(file.originalname)),
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_, file, cb) => {
    /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Solo se permiten imágenes JPG, PNG, WEBP o GIF'));
  },
});

// ── Multer: videos ────────────────────────────────────────────────────────
const videoUpload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, videosDir),
    filename:    (_, file, cb) => cb(null, 'video-' + Date.now() + path.extname(file.originalname)),
  }),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
  fileFilter: (_, file, cb) => {
    ['video/mp4','video/webm','video/quicktime','video/x-msvideo'].includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Formato no soportado. Use MP4, WebM o MOV'));
  },
});

// ════════════════════════════════════════════════════════════════════════════
//  RUTINAS
// ════════════════════════════════════════════════════════════════════════════

// GET  /admin-content/routines
router.get('/routines', async (req, res) => {
  try {
    const routines = await Routine.find()
      .sort({ createdAt: -1 })
      .select('title category difficulty duration accessLevel isActive isFeatured video createdAt')
      .lean();
    res.json({ routines });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /admin-content/routines
router.post('/routines', async (req, res) => {
  try {
    const { title, titleEn, description, descriptionEn, category, difficulty, duration, accessLevel, videoUrl, thumbnail, tags } = req.body;

    if (!title || !duration) {
      return res.status(400).json({ success: false, error: 'Título y duración son obligatorios.' });
    }

    const routine = await Routine.create({
      title,
      titleEn:     titleEn     || '',
      description: description || '',
      descriptionEn: descriptionEn || '',
      category:    category    || 'other',
      difficulty:  difficulty  || 'beginner',
      duration:    Number(duration),
      accessLevel: accessLevel || 'free',
      instructor:  req.user._id || req.user.id,
      instructorName: 'Eva Strong Admin',
      video: videoUrl ? { url: videoUrl, thumbnail: thumbnail || '' } : undefined,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      isActive: true,
    });

    res.status(201).json({ success: true, routine });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// PATCH /admin-content/routines/:id  (solo campos permitidos)
router.patch('/routines/:id', async (req, res) => {
  try {
    // Whitelist: solo campos que el admin puede modificar desde este endpoint
    const allowed = ['isActive', 'isFeatured', 'accessLevel', 'category', 'difficulty', 'titleEn', 'descriptionEn'];
    const update  = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ success: false, error: 'No hay campos válidos para actualizar' });
    }
    const updated = await Routine.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).lean();
    if (!updated) return res.status(404).json({ success: false, error: 'Rutina no encontrada' });
    res.json({ success: true, routine: updated });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// DELETE /admin-content/routines/:id
router.delete('/routines/:id', async (req, res) => {
  try {
    await Routine.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
//  VIDEOS
// ════════════════════════════════════════════════════════════════════════════

// GET /admin-content/videos
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .select('title category difficulty accessLevel isActive video thumbnail createdAt')
      .lean();
    res.json({ videos });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /admin-content/videos  — por URL (YouTube / Vimeo / directo)
router.post('/videos/url', async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, category, difficulty, accessLevel } = req.body;
    if (!title || !videoUrl) return res.status(400).json({ success: false, error: 'Título y URL son obligatorios.' });

    const video = await Video.create({
      title,
      description: description || '',
      category:    category    || 'exercise',
      difficulty:  difficulty  || 'beginner',
      accessLevel: accessLevel || 'free',
      uploadedBy:  req.user._id || req.user.id,
      uploadedByName: 'Eva Strong Admin',
      video:     { cloudUrl: videoUrl },
      thumbnail: { url: thumbnailUrl || '' },
      isActive: true,
    });

    res.status(201).json({ success: true, video });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /admin-content/videos/upload  — archivo local
router.post('/videos/upload', videoUpload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No se recibió ningún video.' });
    const { title, description, category, difficulty, accessLevel } = req.body;

    const fileUrl = `/uploads/videos/${req.file.filename}`;
    const video = await Video.create({
      title:       title || req.file.originalname,
      description: description || '',
      category:    category    || 'exercise',
      difficulty:  difficulty  || 'beginner',
      accessLevel: accessLevel || 'free',
      uploadedBy:  req.user._id || req.user.id,
      uploadedByName: 'Eva Strong Admin',
      video:     { filename: req.file.filename, filepath: fileUrl, mimeType: req.file.mimetype, size: req.file.size },
      isActive: true,
    });

    res.status(201).json({ success: true, video, url: fileUrl });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// DELETE /admin-content/videos/:id
router.delete('/videos/:id', async (req, res) => {
  try {
    const v = await Video.findById(req.params.id).lean();
    if (!v) return res.status(404).json({ success: false, error: 'Video no encontrado' });

    // Borrar archivo local si existe
    if (v.video?.filename) {
      const fp = path.join(videosDir, v.video.filename);
      fs.unlink(fp, (err) => { if (err && err.code !== 'ENOENT') console.error('Error borrando archivo:', err.message); });
    }

    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
//  FOTOS
// ════════════════════════════════════════════════════════════════════════════

// POST /admin-content/photos/upload
router.post('/photos/upload', photoUpload.single('photo'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No se recibió ninguna foto.' });
    const url = `/uploads/photos/${req.file.filename}`;
    res.json({ success: true, url, filename: req.file.filename });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /admin-content/photos
router.get('/photos', (req, res) => {
  try {
    const files = fs.existsSync(photosDir) ? fs.readdirSync(photosDir) : [];
    const photos = files.map(f => ({ filename: f, url: `/uploads/photos/${f}` }));
    res.json({ photos });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// DELETE /admin-content/photos/:filename
router.delete('/photos/:filename', (req, res) => {
  try {
    const fp = path.join(photosDir, req.params.filename);
    fs.unlink(fp, (err) => { if (err && err.code !== 'ENOENT') console.error('Error borrando archivo:', err.message); });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
