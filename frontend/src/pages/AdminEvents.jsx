//src/pages/AdminEvents.jsx
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './AdminEvents.css'; // we'll add some styles

export default function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [form, setForm] = useState({
        _id: '',
        title: '',
        date: '',
        location: '',
        seats: '',
        ticketTypes: 'Regular:30,VIP:60'
    });
    const [loading, setLoading] = useState(true);

    // load events
    useEffect(() => {
        API.get('/events')
            .then(r => setEvents(r.data))
            .finally(() => setLoading(false));
    }, []);

    // handle field change
    const onChange = e => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    // parse ticketTypes string into array
    function parseTicketTypes(str) {
        return str.split(',')
            .map(pair => {
                const [type, price] = pair.split(':');
                return { type: type.trim(), price: Number(price) };
            });
    }

    // submit create or update
    const onSubmit = async e => {
        e.preventDefault();
        const payload = {
            title: form.title,
            date: new Date(form.date).toISOString(),
            location: form.location,
            seats: Number(form.seats),
            ticketTypes: parseTicketTypes(form.ticketTypes)
        };

        try {
            if (form._id) {
                // update
                await API.put(`/events/${form._id}`, payload);
            } else {
                // create
                await API.post('/events', payload);
            }
            // reload list
            const { data } = await API.get('/events');
            setEvents(data);
            // reset form
            setForm({ _id: '', title: '', date: '', location: '', seats: '', ticketTypes: 'Regular:30,VIP:60' });
        } catch (err) {
            alert(err.response?.data?.msg || err.message);
        }
    };

    // prepare form for edit
    const onEdit = ev => {
        setForm({
            _id: ev._id,
            title: ev.title,
            date: ev.date.slice(0, 16),     // YYYY-MM-DDThh:mm
            location: ev.location,
            seats: ev.seats,
            ticketTypes: ev.ticketTypes
                .map(tt => `${tt.type}:${tt.price}`)
                .join(',')
        });
    };

    // delete
    const onDelete = async id => {
        if (!window.confirm('Delete this event?')) return;
        try {
            await API.delete(`/events/${id}`);
            setEvents(es => es.filter(e => e._id !== id));
        } catch (err) {
            alert(err.response?.data?.msg || err.message);
        }
    };

    if (loading) return <div className="container">Loading…</div>;

    return (
        <div className="container">
            <h2>Admin: Manage Events</h2>

            <div className="admin-events-grid">
                {/* Event list */}
                <div>
                    <h3>All Events</h3>
                    <ul className="admin-event-list">
                        {events.map(e => (
                            <li key={e._id}>
                                <span>{e.title} — {new Date(e.date).toLocaleString()}</span>
                                <div>
                                    <button onClick={() => onEdit(e)}>Edit</button>
                                    <button onClick={() => onDelete(e._id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Create/Edit form */}
                <div>
                    <h3>{form._id ? 'Edit Event' : 'New Event'}</h3>
                    <form onSubmit={onSubmit} className="admin-event-form">
                        <label>Title
                            <input
                                name="title"
                                value={form.title}
                                onChange={onChange}
                                required
                            />
                        </label>
                        <label>Date & Time
                            <input
                                type="datetime-local"
                                name="date"
                                value={form.date}
                                onChange={onChange}
                                required
                            />
                        </label>
                        <label>Location
                            <input
                                name="location"
                                value={form.location}
                                onChange={onChange}
                                required
                            />
                        </label>
                        <label>Seats
                            <input
                                type="number"
                                name="seats"
                                value={form.seats}
                                onChange={onChange}
                                required
                            />
                        </label>
                        <label>Ticket Types (e.g. Regular:30,VIP:60)
                            <input
                                name="ticketTypes"
                                value={form.ticketTypes}
                                onChange={onChange}
                                required
                            />
                        </label>

                        <button type="submit">
                            {form._id ? 'Update Event' : 'Create Event'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
