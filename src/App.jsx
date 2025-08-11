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
import GalleryPage from './pages/GalleryPage';
import EnrollFacePage from './pages/EnrollFacePage';
import LiveAttendancePage from './pages/LiveAttendancePage'; // Nayi file import karein
import CreateClubPage from './pages/admin/CreateClubPage';
import CreateEventPage from './pages/admin/CreateEventPage';

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
                {/* Main Routes */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/clubs" element={<DiscoverClubsPage />} />
                <Route path="/clubs/:clubId" element={<ClubDetailPage />} />
                <Route path="/clubs/:clubId/edit" element={<EditClubPage />} />
                <Route path="/events" element={<DiscoverEventsPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/admin/clubs/create" element={<CreateClubPage />} />
                <Route path="/events/create" element={<CreateEventPage />} />
                
                {/* Student AI Feature Route */}
                <Route path="/enroll-face" element={<EnrollFacePage />} />

                {/* Naya, single Admin AI Feature Route */}
                <Route path="/attendance/live" element={<LiveAttendancePage />} />
                
                {/* Default Route */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Route>

            <Route path="*" element={<Navigate to={user ? "/" : "/auth" } />} />
        </Routes>
    );
}

export default App;