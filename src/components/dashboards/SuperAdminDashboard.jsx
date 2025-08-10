import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/api';
import { Link } from 'react-router-dom';
import { Users, TentTree, CalendarDays, HeartPulse, ShieldAlert, Settings, AlertTriangle, CheckCircle, Scan, UserCog, BarChart2, ShieldCheck } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            {change && <p className="text-xs text-green-500">{change}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
            <Icon size={24} />
        </div>
    </div>
);

const AlertItem = ({ title, description, time, icon: Icon, color }) => (
    <div className={`border-l-4 border-${color}-500 bg-${color}-50 p-4 rounded-r-lg`}>
        <div className="flex items-start">
            <Icon className={`h-6 w-6 text-${color}-600 mr-3`} />
            <div>
                <p className={`font-semibold text-${color}-800`}>{title}</p>
                <p className="text-sm text-gray-600">{description}</p>
                <p className="text-xs text-gray-400 mt-1">{time}</p>
            </div>
        </div>
    </div>
);

const SuperAdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getDashboardStats();
                setStats(response.data);
            } catch (error) { 
                console.error("Failed to fetch dashboard stats", error); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading Dashboard...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Monitor and manage the entire CampusConnect platform.</p>
                </div>
                <div className="flex space-x-2">
                    <button className="flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200"><ShieldAlert size={16} className="mr-2"/> System Alerts</button>
                    <button className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200"><Settings size={16} className="mr-2"/> System Settings</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats?.total_users || 0} change="+156 this week" icon={Users} color="blue" />
                <StatCard title="Active Clubs" value={stats?.active_clubs || 0} change="+2 pending" icon={TentTree} color="green" />
                <StatCard title="Total Events" value={stats?.total_events || 0} change="23 this month" icon={CalendarDays} color="purple" />
                <StatCard title="System Health" value="98.5%" change="All systems operational" icon={HeartPulse} color="teal" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800">Pending Club Approvals</h2>
                        <div className="mt-4 space-y-4">
                            <div className="border p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-bold">Robotics Club</p>
                                    <p className="text-sm text-gray-500">Requested by: Dr. Sarah Johnson</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"><CheckCircle size={20}/></button>
                                    <button className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"><AlertTriangle size={20}/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">System Management</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link to="/admin/user-management" className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 text-center">
                                <UserCog className="h-8 w-8 text-blue-600 mb-2"/>
                                <span className="font-semibold text-sm text-blue-800">User Management</span>
                            </Link>
                            <Link to="/admin/club-oversight" className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 text-center">
                                <ShieldCheck className="h-8 w-8 text-green-600 mb-2"/>
                                <span className="font-semibold text-sm text-green-800">Club Oversight</span>
                            </Link>
                            <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 text-center"><BarChart2 className="h-8 w-8 text-purple-600 mb-2"/><span className="font-semibold text-sm text-purple-800">Analytics</span></button>
                            <button className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 text-center"><Settings className="h-8 w-8 text-orange-600 mb-2"/><span className="font-semibold text-sm text-orange-800">System Config</span></button>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800">System Alerts</h2>
                    <div className="mt-4 space-y-4">
                        <AlertItem title="High Server Load" description="Server load is at 85%. Consider scaling." time="10 minutes ago" icon={AlertTriangle} color="yellow" />
                        <AlertItem title="Backup Completed" description="Daily database backup completed successfully." time="2 hours ago" icon={CheckCircle} color="blue" />
                        <AlertItem title="Security Scan" description="Weekly scan completed with no issues found." time="1 day ago" icon={Scan} color="green" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;