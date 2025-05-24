const express = require('express');
const User = require('../models/user');
const { verifyToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

// GET /api/admin/users
router.get('/users', verifyToken, isAdmin, async (req, res) => {
    const u = await User.find().select('-password');
    res.json(u);
});

// PATCH /api/admin/users/:id/approve
router.patch('/users/:id/approve', verifyToken, isAdmin, async (req, res) => {
    const u = await User.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    res.json(u);
});

module.exports = router;
