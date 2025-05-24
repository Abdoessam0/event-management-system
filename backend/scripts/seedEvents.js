// backend/scripts/seedEvents.js
require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/event');

const TURKISH_EVENTS = [
    {
        externalId: '1',
        title: 'Istanbul Jazz Night',
        description: 'A night of smooth jazz by the Bosphorus.',
        date: '2025-07-20T20:00:00.000Z',
        location: 'Istanbul',
        interests: ['music', 'jazz'],
        ticketTypes: [
            { type: 'Regular', price: 50, quantity: 200 },
            { type: 'VIP', price: 100, quantity: 50 }
        ]
    },
    {
        externalId: '2',
        title: 'Ankara Tech Expo',
        description: 'The latest in Turkish and global tech innovations.',
        date: '2025-08-15T10:00:00.000Z',
        location: 'Ankara',
        interests: ['technology', 'expo'],
        ticketTypes: [
            { type: 'General', price: 30, quantity: 300 },
            { type: 'VIP', price: 80, quantity: 100 }
        ]
    },
    {
        externalId: '3',
        title: 'İzmir Seafood Festival',
        description: 'Sample the finest Aegean seafood cuisines.',
        date: '2025-09-05T12:00:00.000Z',
        location: 'İzmir',
        interests: ['food', 'festival'],
        ticketTypes: [
            { type: 'Entry', price: 25, quantity: 250 },
            { type: 'Premium', price: 60, quantity: 80 }
        ]
    },
    {
        externalId: '4',
        title: 'Bursa Silk Road Bazaar',
        description: 'A market celebrating Bursa’s historic silk heritage.',
        date: '2025-10-01T09:00:00.000Z',
        location: 'Bursa',
        interests: ['culture', 'bazaar'],
        ticketTypes: [
            { type: 'Standard', price: 20, quantity: 200 },
            { type: 'VIP', price: 45, quantity: 50 }
        ]
    },
    {
        externalId: '5',
        title: 'Antalya Beach Yoga',
        description: 'Sunrise yoga sessions on the Mediterranean coast.',
        date: '2025-07-10T06:30:00.000Z',
        location: 'Antalya',
        interests: ['wellness', 'yoga'],
        ticketTypes: [
            { type: 'Drop-in', price: 15, quantity: 100 },
            { type: 'Unlimited', price: 80, quantity: 25 }
        ]
    },
    {
        externalId: '6',
        title: 'Adana Kebap Cook-off',
        description: 'Who makes the best Adana kebab? Come taste & judge.',
        date: '2025-11-20T18:00:00.000Z',
        location: 'Adana',
        interests: ['food', 'competition'],
        ticketTypes: [
            { type: 'Taster', price: 35, quantity: 150 },
            { type: 'VIP', price: 70, quantity: 50 }
        ]
    },
    {
        externalId: '7',
        title: 'Konya Whirling Dervishes',
        description: 'Experience the spiritual Sema ceremony in Konya.',
        date: '2025-12-05T20:00:00.000Z',
        location: 'Konya',
        interests: ['culture', 'spirituality'],
        ticketTypes: [
            { type: 'General', price: 40, quantity: 180 },
            { type: 'VIP', price: 90, quantity: 40 }
        ]
    },
    {
        externalId: '8',
        title: 'Gaziantep Baklava Fair',
        description: 'The sweetest baklava competition in Turkey.',
        date: '2026-01-25T14:00:00.000Z',
        location: 'Gaziantep',
        interests: ['food', 'festival'],
        ticketTypes: [
            { type: 'Entry', price: 10, quantity: 300 },
            { type: 'Tasting', price: 50, quantity: 100 }
        ]
    },
    {
        externalId: '9',
        title: 'Kayseri Mountaineering Meetup',
        description: 'Guided climbs on Erciyes – all skill levels welcome.',
        date: '2026-02-14T08:00:00.000Z',
        location: 'Kayseri',
        interests: ['sports', 'outdoors'],
        ticketTypes: [
            { type: 'Participant', price: 60, quantity: 120 },
            { type: 'Supporter', price: 25, quantity: 80 }
        ]
    },
    {
        externalId: '10',
        title: 'Mersin International Film Fest',
        description: 'World cinema premieres by the Mediterranean Sea.',
        date: '2026-03-30T19:00:00.000Z',
        location: 'Mersin',
        interests: ['film', 'festival'],
        ticketTypes: [
            { type: 'Standard', price: 45, quantity: 200 },
            { type: 'VIP', price: 120, quantity: 50 }
        ]
    }
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true, useUnifiedTopology: true
    });

    console.log('→ Connected to MongoDB, seeding Turkish events…');
    await Event.deleteMany({});
    await Event.insertMany(TURKISH_EVENTS);
    console.log(`✔️ Seeded ${TURKISH_EVENTS.length} events`);

    await mongoose.disconnect();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
