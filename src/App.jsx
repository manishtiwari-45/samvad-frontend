import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import DiscoverClubsPage from './pages/DiscoverClubsPage';
import ClubDetailPage from './pages/ClubDetailPage';
import EditClubPage from './pages/EditClubPage';
import DiscoverEventsPage from './pages/DiscoverEventsPage';
import ProfilePage from './pages/ProfilePage';
import UserManagementPage from './pages/UserManagementPage'; // Nayi file import karein

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    return user ? <Layout><Outlet /></Layout> : <Navigate to="/auth" />;
};

function App() {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-xl">Loading CampusConnect...</div>;

    return (
        <Routes>
            <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
            
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/clubs" element={<DiscoverClubsPage />} />
                <Route path="/clubs/:clubId" element={<ClubDetailPage />} />
                <Route path="/clubs/:clubId/edit" element={<EditClubPage />} />
                <Route path="/events" element={<DiscoverEventsPage />} />
                
                {/* Naya Admin Route */}
                <Route path="/admin/user-management" element={<UserManagementPage />} />
                
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Route>

            <Route path="*" element={<Navigate to={user ? "/" : "/auth" } />} />
        </Routes>
    );
}

export default App;