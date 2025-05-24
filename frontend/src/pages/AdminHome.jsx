import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminHome() {
    return (
        <div className="card">
            <h2>Admin Panel</h2>
            <ul>
                <li><Link to="/admin/events">Manage Events</Link></li>
                <li><Link to="/admin/announcements">Manage Announcements</Link></li>
            </ul>
        </div>
    );
}

