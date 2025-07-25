import React from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import ClubAdminDashboard from '../components/dashboards/ClubAdminDashboard';
// ... (imports remain the same)
import SuperAdminDashboard from '../components/dashboards/SuperAdminDashboard'; // <-- Add this import

const DashboardPage = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    if (!user) return <div>Loading...</div>;

    switch (user.role) {
      case 'student':
        return <StudentDashboard />;
      case 'club_admin':
        return <ClubAdminDashboard />;
      case 'super_admin':
        return <SuperAdminDashboard />; // <-- This line renders our new component
      default:
        return <div>Unknown user role.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default DashboardPage;
