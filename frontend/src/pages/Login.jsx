import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
    const nav = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            if (data.firstLogin) nav('/change-password');
            else nav('/dashboard');
        } catch (err) {
            alert(err.response?.data?.msg || err.message);
        }
    };

    return (
        <div className="card">
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email" required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password" required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}
