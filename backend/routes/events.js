// backend/routes/events.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const Event = require('../models/event');
const {
    verifyToken,
    isAdmin,
    checkFirstLogin
} = require('../middleware/auth');

const router = express.Router();

// ─── Helper: fetch current weather for a city ──────────────────────────
async function fetchWeather(location) {
    const key = process.env.OPENWEATHER_API_KEY; // your 3f18a54d… key
    const url = `https://api.openweathermap.org/data/2.5/weather` +
        `?q=${encodeURIComponent(location)}` +
        `&appid=${key}&units=metric`;
    try {
        const resp = await axios.get(url);
        const w = resp.data.weather[0];
        const m = resp.data.main;
        return {
            main: w.main,
            description: w.description,
            temp: m.temp,
            icon: w.icon
        };
    } catch (err) {
        console.error(`Weather fetch failed for "${location}": ${err.message}`);
        return { main: null, description: null, temp: null, icon: null };
    }
}

// ─── 1) GET all events, sorted by date, with weather ───────────────────
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        const withWeather = await Promise.all(
            events.map(async ev => {
                ev.weather = await fetchWeather(ev.location);
                return ev;
            })
        );
        return res.json(withWeather);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

// ─── 2) GET recommendations (must be logged in & changed pw) ────────────
router.get(
    '/recommendations',
    verifyToken,
    checkFirstLogin,
    async (req, res) => {
        try {
            const interests = req.user.interests || [];
            const recs = await Event.find({
                interests: { $in: interests }
            }).sort({ date: 1 });

            const withWeather = await Promise.all(
                recs.map(async ev => {
                    ev.weather = await fetchWeather(ev.location);
                    return ev;
                })
            );
            return res.json(withWeather);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
);

// ─── 3) GET single event by ID ─────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const ev = await Event.findById(req.params.id);
        if (!ev) return res.status(404).json({ msg: 'Event not found' });
        ev.weather = await fetchWeather(ev.location);
        return res.json(ev);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

// ─── 4) POST create event (admin only) ────────────────────────────────
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const ev = await new Event(req.body).save();
        return res.status(201).json(ev);
    } catch (err) {
        return res.status(400).json({ msg: err.message });
    }
});

// ─── 5) PUT update event (admin only) ─────────────────────────────────
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const ev = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        return res.json(ev);
    } catch (err) {
        return res.status(400).json({ msg: err.message });
    }
});

// ─── 6) DELETE event (admin only) ─────────────────────────────────────
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        return res.json({ msg: 'Event deleted' });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
