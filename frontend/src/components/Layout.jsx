import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
    const nav = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        nav('/login');
    };

    return (
        <>
            <header>
                <Link to={token ? "/dashboard" : "/"} className="logo">EventSys</Link>
                <nav>
                    {token ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/announcements">Announcements</Link>
                            {role === 'admin' && <Link to="/admin">Admin</Link>}
                            <button onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>
            </header>
            <main className="container">
                {children || <Outlet />}
            </main>
        </>
    );
}
