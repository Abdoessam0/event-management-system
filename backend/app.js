require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

// Routers

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const eventsRouter = require('./routes/events');
const announcementsRouter = require('./routes/announcements');
const adminRouter = require('./routes/admin');
const ticketsRouter = require('./routes/tickets');
const app = express();

// Disable ETag to avoid 304 caching for JSON APIs
app.disable('etag');

// ———— Connect MongoDB ————
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error', err));

// ———— Middlewares ————
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// ———— Static public folder ————
app.use(express.static(path.join(__dirname, 'public')));

// ———— Mount routers ————

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/events', eventsRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/announcements', announcementsRouter);


// ———— 404 handler ————
app.use((req, res, next) => {
    next(createError(404));
});

// ———— Error handler ————
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;
