import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './AdminAnnouncements.css';

export default function AdminAnnouncements() {
    const [ann, setAnn] = useState([]);
    const [form, setForm] = useState({ _id: '', title: '', content: '' });

    // Load all
    useEffect(() => {
        API.get('/announcements').then(r => setAnn(r.data));
    }, []);

    const onChange = e => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const refresh = () => API.get('/announcements').then(r => setAnn(r.data));

    const onSubmit = async e => {
        e.preventDefault();
        try {
            if (form._id) {
                await API.put(`/announcements/${form._id}`, {
                    title: form.title, content: form.content
                });
            } else {
                await API.post('/announcements', {
                    title: form.title, content: form.content
                });
            }
            setForm({ _id: '', title: '', content: '' });
            refresh();
        } catch (err) {
            alert(err.response?.data?.msg || err.message);
        }
    };

    const onEdit = a => {
        setForm({ _id: a._id, title: a.title, content: a.content });
    };

    const onDelete = async id => {
        if (!window.confirm('Delete this announcement?')) return;
        await API.delete(`/announcements/${id}`);
        refresh();
    };

    return (
        <div className="container">
            <h2>Admin: Announcements</h2>
            <div className="admin-ann-grid">
                <div>
                    <h3>All Announcements</h3>
                    <ul className="admin-ann-list">
                        {ann.map(a => (
                            <li key={a._id}>
                                <div>
                                    <strong>{a.title}</strong><br />
                                    <small>{new Date(a.createdAt).toLocaleString()}</small>
                                </div>
                                <div>
                                    <button onClick={() => onEdit(a)}>Edit</button>
                                    <button onClick={() => onDelete(a._id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>{form._id ? 'Edit Announcement' : 'New Announcement'}</h3>
                    <form onSubmit={onSubmit} className="admin-ann-form">
                        <label>
                            Title
                            <input
                                name="title"
                                value={form.title}
                                onChange={onChange}
                                required />
                        </label>
                        <label>
                            Content
                            <textarea
                                name="content"
                                value={form.content}
                                onChange={onChange}
                                required
                                rows="4" />
                        </label>
                        <button type="submit">
                            {form._id ? 'Update' : 'Create'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
