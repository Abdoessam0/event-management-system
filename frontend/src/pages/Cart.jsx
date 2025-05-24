// src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';

export default function Cart() {
    const nav = useNavigate();
    const params = new URLSearchParams(useLocation().search);
    const eventId = params.get('eventId');

    const [ev, setEv] = useState(null);
    const [qty, setQty] = useState(1);
    const [type, setType] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('ONLINE');

    useEffect(() => {
        if (!eventId) return nav('/dashboard');

        API.get(`/events/${eventId}`)
            .then(r => {
                setEv(r.data);
                setType(r.data.ticketTypes[0]?.type || '');
            })
            .catch(err => {
                console.error('Failed to load event:', err);
                alert('Could not load event.');
                nav('/dashboard');
            });
    }, [eventId, nav]);

    if (!ev) {
        return <div className="container">Loading event…</div>;
    }

    const buy = async () => {
        try {
            await API.post('/tickets/purchase', {
                eventId,
                ticketType: type,
                quantity: Number(qty),
                paymentMethod,            // now included
            });
            alert('Purchase successful!');
            nav('/dashboard');
        } catch (err) {
            alert(err.response?.data?.msg || err.message);
        }
    };

    return (
        <div className="card" style={{ maxWidth: 500, margin: '2rem auto' }}>
            <h2>{ev.title}</h2>
            <p><strong>Date:</strong> {new Date(ev.date).toLocaleString()}</p>
            <p><strong>Location:</strong> {ev.location}</p>
            <p>
                <strong>Weather:</strong>{' '}
                {ev.weather?.temp != null
                    ? `${ev.weather.temp.toFixed(0)}°C — ${ev.weather.main}`
                    : 'n/a'}
            </p>

            <div className="ticket-controls">
                <div>
                    <label>Type</label>
                    <select value={type} onChange={e => setType(e.target.value)}>
                        {ev.ticketTypes.map(tt => (
                            <option key={tt.type} value={tt.type}>
                                {tt.type} (${tt.price})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Quantity</label>
                    <input
                        type="number"
                        min="1"
                        max={ev.ticketTypes.find(t => t.type === type)?.quantity || 1}
                        value={qty}
                        onChange={e => setQty(e.target.value)}
                    />
                </div>

                <div>
                    <label>Payment Method</label>
                    <select
                        value={paymentMethod}
                        onChange={e => setPaymentMethod(e.target.value)}
                    >
                        <option value="ONLINE">Online</option>
                        <option value="CASH">Cash</option>
                    </select>
                </div>
            </div>

            <button className="btn-primary" onClick={buy}>
                Buy Ticket
            </button>
        </div>
    );
}
