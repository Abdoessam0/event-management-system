// backend/routes/events.js

const express = require('express');
const Event = require('../models/event');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// — List all events —
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// — Create new event (Admin only) —
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const data = req.body;
        data.availableSeats = data.seats;  // initialize availableSeats
        const ev = await new Event(data).save();
        res.status(201).json(ev);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// — Update event (Admin only) —
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!ev) return res.status(404).json({ msg: 'Event not found' });
        res.json(ev);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// — Delete event (Admin only) —
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const ev = await Event.findByIdAndDelete(req.params.id);
        if (!ev) return res.status(404).json({ msg: 'Event not found' });
        res.json({ msg: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
