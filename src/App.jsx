import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage'; // This will now be our 'Explore' page
import ClubDetailPage from './pages/ClubDetailPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-xl">Loading CampusConnect...</div>;
  }

  return (
    <Routes>
      {/* Route for authentication page */}
      <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
      
      {/* Protected Routes - only accessible when logged in */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/explore" element={<HomePage />} />
        <Route path="/clubs/:clubId" element={<ClubDetailPage />} />
        {/* The root path now redirects to the dashboard if logged in */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Route>

      {/* Fallback for any other path, redirects to login if not authenticated */}
      <Route path="*" element={<Navigate to="/auth" />} />
    </Routes>
  );
}

export default App;