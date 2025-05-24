// backend/scripts/seedAnnouncements.js
require('dotenv').config();
const mongoose = require('mongoose');
const Announcement = require('../models/announcement');

const ANNOUNCEMENTS = [
    {
        title: 'Welcome to the Event Management System',
        content: 'We’re live! Browse upcoming events across Turkey and secure your tickets now.'
    },
    {
        title: 'New: Weather-Based Cancellations',
        content: 'Events now show “Can’t proceed” if rain, thunderstorm or snow is forecast. Stay dry!'
    },
    {
        title: 'First-Time Login Reminder',
        content: 'Don’t forget to change your password on your first login for maximum security.'
    },
    {
        title: 'Tickets on Sale: Istanbul Jazz Night',
        content: 'Don’t miss the smooth jazz evening by the Bosphorus—grab your Regular or VIP seats today!'
    },
    {
        title: 'Scheduled Maintenance',
        content: 'The system will undergo maintenance on June 1, 2025 at 02:00 AM UTC. Brief downtime expected.'
    }
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true, useUnifiedTopology: true
    });
    console.log('→ Connected to MongoDB, seeding announcements…');

    await Announcement.deleteMany({});
    await Announcement.insertMany(ANNOUNCEMENTS);
    console.log(`✔️ Seeded ${ANNOUNCEMENTS.length} announcements`);

    await mongoose.disconnect();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
