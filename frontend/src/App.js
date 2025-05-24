import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Announcements from './pages/Announcements';
import AdminHome from './pages/AdminHome';
import AdminEvents from './pages/AdminEvents';
import AdminAnnouncements from './pages/AdminAnnouncements';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* First login must change password */}
          <Route path="/change-password" element={
            <ProtectedRoute><ChangePassword /></ProtectedRoute>
          } />

          {/* User pages */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />

          {/* Admin Panel */}
          <Route path="/admin" element={<AdminRoute><AdminHome /></AdminRoute>} />
          <Route path="/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
          <Route path="/admin/announcements" element={<AdminRoute><AdminAnnouncements /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
