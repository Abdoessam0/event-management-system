// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// — Register —
router.post('/register', async (req, res) => {
    console.log('🔔 Hit Register endpoint');
    try {
        const { email, password, interests } = req.body;
        if (await User.findOne({ email })) {
            return res.status(400).json({ msg: 'Email already exists' });
        }
        const hashed = await bcrypt.hash(password, 10);
        await new User({ email, password: hashed, interests }).save();
        res.json({ msg: 'Registered successfully, pending admin approval.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// — Login —
router.post('/login', async (req, res) => {
    console.log('🔔 Hit Login endpoint');
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
        if (!user.approved) return res.status(403).json({ msg: 'User not approved yet.' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = {
            id: user._id,
            role: user.role,
            firstLogin: user.firstLogin
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// — Change Password (First Login) —
router.post('/change-password', async (req, res) => {
    console.log('🔔 Hit Change-Password endpoint');
    try {
        const header = req.headers.authorization;
        if (!header) return res.status(401).json({ msg: 'No token provided' });

        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const { newPassword } = req.body;
        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        user.firstLogin = false;
        await user.save();

        res.json({ msg: 'Password changed successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
