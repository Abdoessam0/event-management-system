// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [recs, setRecs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all events + personalized recommendations
        Promise.all([
            API.get('/events'),
            API.get('/events/recommendations')
        ])
            .then(([allRes, recRes]) => {
                const allEvents = allRes.data;
                let recommended = recRes.data;

                // If no interests or no recs returned, pick 3 at random
                if (!recommended || recommended.length === 0) {
                    const shuffled = [...allEvents].sort(() => 0.5 - Math.random());
                    recommended = shuffled.slice(0, 3);
                }

                setEvents(allEvents);
                setRecs(recommended);
            })
            .catch(err => {
                console.error('Failed to load events or recommendations', err);
                setEvents([]);
                setRecs([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="container">Loading events…</div>;
    }

    // date formatting helper
    const fmtDate = iso => new Date(iso).toLocaleDateString();

    return (
        <div className="container">
            {recs.length > 0 && (
                <section className="card">
                    <h2>Recommended for you</h2>
                    <ul>
                        {recs.map(e => (
                            <li key={e._id || e.id} className="event-row">
                                <Link className="event-link" to={`/cart?eventId=${e._id || e.id}`}>
                                    {e.title}
                                </Link>
                                <span className="event-info">
                                    {fmtDate(e.date)} — {e.weather?.temp?.toFixed(0) ?? 'n/a'}°C
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <section className="card">
                <h2>All Events</h2>
                {events.length === 0 ? (
                    <p>No upcoming events.</p>
                ) : (
                    <ul>
                        {events.map(e => (
                            <li key={e._id} className="event-row">
                                <Link className="event-link" to={`/cart?eventId=${e._id}`}>
                                    {e.title}
                                </Link>
                                <span className="event-info">
                                    {fmtDate(e.date)} — {e.weather?.temp?.toFixed(0) ?? 'n/a'}°C
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
