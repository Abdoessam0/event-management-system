const mongoose = require('mongoose');

const ticketTypeSchema = new mongoose.Schema({
    type: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
}, { _id: false });

const eventSchema = new mongoose.Schema({
    externalId: { type: String, unique: true, sparse: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, required: true },
    location: { type: String, trim: true },
    interests: [{ type: String, trim: true }],
    ticketTypes: [ticketTypeSchema],
    weather: {
        main: String,
        description: String,
        temp: Number,
        icon: String
    },
    isCancelled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
