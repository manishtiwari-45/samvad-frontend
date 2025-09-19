import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import DiscoverClubsPage from './pages/DiscoverClubsPage';
import ClubDetailPage from './pages/ClubDetailPage';
import EditClubPage from './pages/EditClubPage';
import DiscoverEventsPage from './pages/DiscoverEventsPage';
import EventDetailPage from './pages/EventDetailPage';
import ProfilePage from './pages/ProfilePage';
import GalleryPage from './pages/GalleryPage';
import EnrollFacePage from './pages/EnrollFacePage';
import LiveAttendancePage from './pages/LiveAttendancePage';
import CreateClubPage from './pages/admin/CreateClubPage';
import CreateEventPage from './pages/admin/CreateEventPage';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return <Layout><Outlet /></Layout>;
};

function App() {
    const { user, loading } = useAuth();
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const hasGoogleClient = Boolean(googleClientId && String(googleClientId).trim());

    if (loading) return <LoadingSpinner fullScreen size="lg" message="Loading StellarHub..." />;

    return (
        <ErrorBoundary>
            {!hasGoogleClient && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    background: '#fde68a',
                    color: '#7c2d12',
                    padding: '8px 16px',
                    fontSize: '14px',
                    textAlign: 'center',
                    borderBottom: '1px solid #f59e0b'
                }}>
                    VITE_GOOGLE_CLIENT_ID is not set. Google login will be disabled in development.
                </div>
            )}
            {hasGoogleClient ? (
                <GoogleOAuthProvider clientId={googleClientId}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
                        <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
                        
                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/clubs" element={<DiscoverClubsPage />} />
                            <Route path="/clubs/:clubId" element={<ClubDetailPage />} />
                            <Route path="/clubs/:clubId/edit" element={<EditClubPage />} />
                            <Route path="/events" element={<DiscoverEventsPage />} />
                            <Route path="/events/:eventId" element={<EventDetailPage />} />
                            <Route path="/gallery" element={<GalleryPage />} />
                            <Route path="/admin/clubs/create" element={<CreateClubPage />} />
                            <Route path="/events/create" element={<CreateEventPage />} />
                            <Route path="/enroll-face" element={<EnrollFacePage />} />
                            <Route path="/attendance/live" element={<LiveAttendancePage />} />
                        </Route>

                        {/* Catch-all route */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </GoogleOAuthProvider>
            ) : (
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
                    <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
                    
                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/clubs" element={<DiscoverClubsPage />} />
                        <Route path="/clubs/:clubId" element={<ClubDetailPage />} />
                        <Route path="/clubs/:clubId/edit" element={<EditClubPage />} />
                        <Route path="/events" element={<DiscoverEventsPage />} />
                        <Route path="/events/:eventId" element={<EventDetailPage />} />
                        <Route path="/gallery" element={<GalleryPage />} />
                        <Route path="/admin/clubs/create" element={<CreateClubPage />} />
                        <Route path="/events/create" element={<CreateEventPage />} />
                        <Route path="/enroll-face" element={<EnrollFacePage />} />
                        <Route path="/attendance/live" element={<LiveAttendancePage />} />
                    </Route>

                    {/* Catch-all route */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            )}
        </ErrorBoundary>
    );
}

export default App;