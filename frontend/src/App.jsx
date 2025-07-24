import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Questionnaire from './pages/Questionnaire';
import Recommendations from './pages/Recommendations';

function App() {
  return (
    <Routes>
      {/* Auth Routes (without layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* App Routes (with layout) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <div>Profile - Coming Soon</div>
          </ProtectedRoute>
        } />
        
        <Route path="/questionnaire" element={
          <ProtectedRoute>
            <Questionnaire />
          </ProtectedRoute>
        } />
        
        <Route path="/recommendations" element={
          <ProtectedRoute>
            <Recommendations />
          </ProtectedRoute>
        } />
        
        <Route path="/products" element={
          <ProtectedRoute>
            <div>Products - Coming Soon</div>
          </ProtectedRoute>
        } />
        
        <Route path="/routines" element={
          <ProtectedRoute>
            <div>Routines - Coming Soon</div>
          </ProtectedRoute>
        } />
        
        <Route path="/reviews" element={
          <ProtectedRoute>
            <div>Reviews - Coming Soon</div>
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <div>Admin Dashboard - Coming Soon</div>
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
