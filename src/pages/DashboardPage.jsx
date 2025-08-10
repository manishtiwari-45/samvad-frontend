import React from 'react';
import { useAuth } from '../context/AuthContext';
// Purana Header import hata diya gaya hai
import StudentDashboard from '../components/dashboards/StudentDashboard';
import ClubAdminDashboard from '../components/dashboards/ClubAdminDashboard';
import SuperAdminDashboard from '../components/dashboards/SuperAdminDashboard';

const DashboardPage = () => {
  const { user } = useAuth();

  // Yeh function decide karega ki kaun sa dashboard dikhana hai
  const renderDashboard = () => {
    if (!user) {
        return <div>Loading...</div>; // Ya ek loading spinner
    }

    switch (user.role) {
      case 'student':
        return <StudentDashboard />;
      case 'club_admin':
        return <ClubAdminDashboard />;
      case 'super_admin':
        return <SuperAdminDashboard />;
      default:
        return <div>Unknown user role.</div>;
    }
  };

  // Component ab sirf sahi dashboard ko render karega
  return renderDashboard();
};

export default DashboardPage;