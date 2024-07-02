// src/userRoutes.js
const express = require('express');
const router = express.Router();
const db = require('./db');

// Middleware para verificar si el usuario es administrador
function isAdmin(req, res, next) {
  if (req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
}

// Obtener todos los usuarios (solo admin)
router.get('/', isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un usuario (admin y self)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { displayName, role } = req.body;
  if (req.user.role !== 'admin' && req.user.id !== id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    await db.query('UPDATE users SET displayName = ?, role = ? WHERE id = ?', [displayName, role, id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un usuario (solo admin)
router.delete('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
