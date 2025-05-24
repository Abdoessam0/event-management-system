const express = require('express');
const User = require('../models/user');
const { verifyToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

// GET /api/users/me  — current user profile
router.get('/me', verifyToken, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
});

// GET /api/users     — list all users (admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
    const users = await User.find().select('-password');
    return res.json(users);
});

module.exports = router;
