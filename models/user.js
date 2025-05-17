// backend/models/user.js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    approved: { type: Boolean, default: false },
    firstLogin: { type: Boolean, default: true },
    interests: [String]
});
module.exports = mongoose.model('User', userSchema);
