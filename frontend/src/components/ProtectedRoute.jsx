import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
    // You can add a spinner here
    return <div>Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/auth" />;
};

export default ProtectedRoute;