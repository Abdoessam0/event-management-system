// backend/routes/tickets.js
const express = require('express');
const Ticket = require('../models/ticket');
const Event = require('../models/event');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// POST /api/tickets/purchase
router.post('/purchase', verifyToken, async (req, res) => {
    try {
        const { eventId, ticketType, quantity, paymentMethod } = req.body;

        // validate paymentMethod
        if (!['ONLINE', 'CASH'].includes(paymentMethod)) {
            return res.status(400).json({ msg: 'Invalid payment method' });
        }

        const ev = await Event.findById(eventId);
        if (!ev) return res.status(404).json({ msg: 'Event not found' });

        const tt = ev.ticketTypes.find(t => t.type === ticketType);
        if (!tt || tt.quantity < quantity) {
            return res.status(400).json({ msg: 'Insufficient tickets' });
        }

        // decrement availability
        tt.quantity -= quantity;
        await ev.save();

        const totalPrice = tt.price * quantity;

        // create ticket with paymentMethod
        const ticket = await new Ticket({
            user: req.user.id,
            event: eventId,
            ticketType,
            quantity,
            totalPrice,
            paymentMethod
        }).save();

        res.status(201).json(ticket);

    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

module.exports = router;
