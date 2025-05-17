// backend/app.js

// 1) Load environment variables and connect to MongoDB
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// 2) Import core modules
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// 3) Import routers
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const eventsRouter = require('./routes/events');
const announceRouter = require('./routes/announcements');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// 4) Initialize Express app & mount global middlewares
const app = express();
app.use(cors());                                  // Enable CORS
app.use(logger('dev'));                           // HTTP request logger
app.use(express.json());                          // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(cookieParser());                          // Parse cookies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// 5) Mount API routers (in correct order)
app.use('/api/auth', authRouter);      // register, login, change-password
app.use('/api/admin', adminRouter);     // approve users
app.use('/api/events', eventsRouter);    // events CRUD
app.use('/api/announcements', announceRouter);  // announcements CRUD

// 6) Mount remaining routes (express-generator defaults)
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 7) Export the configured app
module.exports = app;
