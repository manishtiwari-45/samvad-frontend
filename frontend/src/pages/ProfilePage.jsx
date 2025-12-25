import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsApi } from '../services/api';
import { Edit, Shield, Calendar, Users, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useAuth();
    const [userActivity, setUserActivity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserActivity = async () => {
            try {
                const response = await analyticsApi.getUserActivity();
                setUserActivity(response.data);
            } catch (error) {
                console.error('Failed to fetch user activity:', error);
                setUserActivity({
                    clubs_joined: 0,
                    upcoming_events: 0,
                    clubs: [],
                    events: []
                });
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserActivity();
        }
    }, [user]);

    if (!user || loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-secondary">Loading profile...</p>
                </div>
            </div>
        );
    }

    const getRoleColor = (role) => {
        const colors = {
            student: 'bg-blue-100 text-blue-800',
            club_admin: 'bg-purple-100 text-purple-800',
            super_admin: 'bg-red-100 text-red-800'
        };
        return colors[role] || colors.student;
    };

    const getRoleLabel = (role) => {
        const labels = {
            student: 'Student',
            club_admin: 'Club Admin',
            super_admin: 'Super Admin'
        };
        return labels[role] || 'Student';
    };
    
    return (
        <div className="min-h-screen bg-background mobile-container">
            <div className="max-w-4xl mx-auto py-8 space-y-8">
                {/* Profile Header */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        {/* Profile Picture */}
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {user.full_name?.charAt(0)?.toUpperCase()}
                        </div>
                        
                        {/* User Info */}
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.full_name}</h1>
                                    <p className="text-gray-600 mb-2">{user.email}</p>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                                        <Shield className="h-4 w-4 mr-1" />
                                        {getRoleLabel(user.role)}
                                    </span>
                                </div>
                                <button className="mt-4 sm:mt-0 btn-primary mobile-button flex items-center">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {userActivity?.clubs_joined || 0}
                        </h3>
                        <p className="text-gray-600">Clubs Joined</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {userActivity?.upcoming_events || 0}
                        </h3>
                        <p className="text-gray-600">Upcoming Events</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {user.whatsapp_verified ? 'Verified' : 'Pending'}
                        </h3>
                        <p className="text-gray-600">Account Status</p>
                    </div>
                </div>

                {/* My Clubs */}
                {userActivity?.clubs && userActivity.clubs.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Clubs</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userActivity.clubs.map((club, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <h3 className="font-medium text-gray-900">{club}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upcoming Events */}
                {userActivity?.events && userActivity.events.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
                        <div className="space-y-4">
                            {userActivity.events.map((event, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{event.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            {new Date(event.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Account Settings */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div>
                                <h3 className="font-medium text-gray-900">WhatsApp Verification</h3>
                                <p className="text-sm text-gray-600">
                                    {user.whatsapp_verified ? 'Your WhatsApp is verified' : 'Verify your WhatsApp for notifications'}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                user.whatsapp_verified 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {user.whatsapp_verified ? 'Verified' : 'Pending'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <h3 className="font-medium text-gray-900">Face Recognition</h3>
                                <p className="text-sm text-gray-600">
                                    {user.face_encoding ? 'Face enrolled for attendance' : 'Enroll your face for AI attendance'}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                user.face_encoding 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {user.face_encoding ? 'Enrolled' : 'Not Enrolled'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;