// backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

function signToken(user) {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, password, interests } = req.body;
        await new User({ email, password, interests }).save();
        res.status(201).json({ msg: 'Registered! Awaiting admin approval.' });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ msg: 'Email exists' });
        res.status(500).json({ msg: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
        if (!await user.comparePassword(password))
            return res.status(400).json({ msg: 'Invalid credentials' });
        if (!user.approved)
            return res.status(403).json({ msg: 'Awaiting admin approval' });
        const token = signToken(user);
        res.json({ token, role: user.role, firstLogin: user.firstLogin });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// POST /api/auth/change-password
router.post('/change-password', verifyToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!await user.comparePassword(oldPassword))
            return res.status(400).json({ msg: 'Old password incorrect' });
        user.password = newPassword;
        user.firstLogin = false;
        await user.save();
        res.json({ msg: 'Password changed' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
