require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.checkFirstLogin = (req, res, next) => {
    if (req.user.firstLogin)
        return res.status(403).json({ msg: 'Change password on first login' });
    next();
};

exports.verifyToken = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
        return res.status(401).json({ msg: 'No token provided' });

    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ msg: 'User not found' });

        req.user = {
            id: user._id,
            role: user.role,
            firstLogin: user.firstLogin
        };
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token invalid or expired' });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin')
        return res.status(403).json({ msg: 'Admin only endpoint' });
    next();
};

exports.checkFirstLogin = (req, res, next) => {
    if (req.user.firstLogin)
        return res.status(403).json({ msg: 'Password change required on first login' });
    next();
};
