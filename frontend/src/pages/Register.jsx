import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState('');

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await API.post('/auth/register', {
        email, password,
        interests: interests
          .split(',')
          .map(i => i.trim())
          .filter(i => i)
      });
      alert('✓ Registered – awaiting admin approval');
      nav('/login');
    } catch (err) {
      alert(err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>
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
        <div>
          <label>Interests</label>
          <input
            type="text"
            value={interests}
            onChange={e => setInterests(e.target.value)}
            placeholder="e.g. music, sports"
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
