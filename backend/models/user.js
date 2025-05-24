// backend/models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    approved: { type: Boolean, default: false },
    firstLogin: { type: Boolean, default: true },
    interests: [{ type: String, trim: true }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Instance method to compare password
userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
