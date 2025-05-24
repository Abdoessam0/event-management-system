import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
        return <Navigate to="/login" replace />;
    }
    return children;
}
