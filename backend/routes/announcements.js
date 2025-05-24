// backend/routes/announcements.js
const express = require('express');
const router = express.Router();
const Announcement = require('../models/announcement');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET /api/announcements
router.get('/', async (req, res) => {
    try {
        const list = await Announcement.find().sort({ createdAt: -1 });
        res.json(list);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// POST /api/announcements    (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const a = await new Announcement(req.body).save();
        res.status(201).json(a);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

// PUT /api/announcements/:id (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const a = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(a);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

// DELETE /api/announcements/:id (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Deleted' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
