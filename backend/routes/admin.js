// backend/routes/admin.js
const express = require('express');
const User = require('../models/user');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// List pending users
router.get('/pending-users', verifyToken, isAdmin, async (req, res) => {
    const users = await User.find({ approved: false }).select('-password');
    res.json(users);
});

// Approve user
router.post('/approve-user/:userId', verifyToken, isAdmin, async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    user.approved = true;
    await user.save();
    res.json({ msg: 'User approved.' });
});

module.exports = router;
