import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Announcements() {
    const [ann, setAnn] = useState([]);
    const [loading, setLoad] = useState(true);

    useEffect(() => {
        API.get('/announcements')
            .then(r => setAnn(r.data))
            .catch(console.error)
            .finally(() => setLoad(false));
    }, []);

    if (loading) return <div className="container">Loading announcements…</div>;

    return (
        <div className="card">
            <h2>Announcements</h2>
            {ann.length === 0
                ? <p>No announcements.</p>
                : (
                    <ul>
                        {ann.map(a => (
                            <li key={a._id}>
                                <strong>{a.title}</strong>
                                <p>{a.content}</p>
                                <small>{new Date(a.createdAt).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                )
            }
        </div>
    );
}
