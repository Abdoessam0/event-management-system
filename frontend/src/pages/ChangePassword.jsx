import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function ChangePassword() {
    const nav = useNavigate();
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await API.post('/auth/change-password', {
                oldPassword: oldPass,
                newPassword: newPass
            });
            alert('Password changed – please login again');
            localStorage.removeItem('token');
            nav('/login');
        } catch (err) {
            alert(err.response?.data?.msg || err.message);
        }
    };

    return (
        <div className="card">
            <h2>Change Password</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Old Password</label>
                    <input
                        type="password" required
                        value={oldPass}
                        onChange={e => setOldPass(e.target.value)}
                    />
                </div>
                <div>
                    <label>New Password</label>
                    <input
                        type="password" required
                        value={newPass}
                        onChange={e => setNewPass(e.target.value)}
                    />
                </div>
                <button type="submit">Update Password</button>
            </form>
        </div>
    );
}
