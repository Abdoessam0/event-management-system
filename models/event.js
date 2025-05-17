// backend/models/event.js
const mongoose = require('mongoose');

const ticketTypeSchema = new mongoose.Schema({
	type: { type: String, required: true },
	price: { type: Number, required: true }
}, { _id: false });

const eventSchema = new mongoose.Schema({
	title: { type: String, required: true },
	type: { type: String, required: true },
	date: { type: Date, required: true },
	description: { type: String },
	location: { type: String },
	seats: { type: Number, required: true },
	availableSeats: { type: Number, required: true },
	ticketTypes: { type: [ticketTypeSchema], default: [] },
	weatherOk: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
