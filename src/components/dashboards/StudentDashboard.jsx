    import React, { useState, useEffect } from 'react';
    import { getRecommendedEvents } from '../../services/api';
    import { Link } from 'react-router-dom';
    import { useAuth } from '../../context/AuthContext';
    import { CalendarIcon, UserGroupIcon, SparklesIcon } from '@heroicons/react/24/outline';

    const StudentDashboard = () => {
        const { user } = useAuth();
        const [recommendations, setRecommendations] = useState([]);
        const [loadingRecs, setLoadingRecs] = useState(true);

        useEffect(() => {
            const fetchRecs = async () => {
                try {
                    const response = await getRecommendedEvents();
                    setRecommendations(response.data);
                } catch (error) {
                    console.error("Failed to fetch recommendations", error);
                } finally {
                    setLoadingRecs(false);
                }
            };
            fetchRecs();
        }, []);

        return (
            <div className="max-w-7xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-gray-800">My Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* My Clubs */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 flex items-center"><UserGroupIcon className="h-6 w-6 mr-2 text-indigo-500"/>My Clubs</h2>
                        {user.clubs && user.clubs.length > 0 ? (
                            <ul className="space-y-3">
                            {user.clubs.map(club => (
                                <li key={club.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <Link to={`/clubs/${club.id}`} className="font-semibold text-gray-800 hover:text-indigo-600">{club.name}</Link>
                                </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">You haven't joined any clubs yet. <Link to="/explore" className="text-indigo-600 font-semibold">Explore clubs</Link>.</p>
                        )}
                    </div>

                    {/* My Events */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 flex items-center"><CalendarIcon className="h-6 w-6 mr-2 text-green-500"/>My Events</h2>
                        {user.events_attending && user.events_attending.length > 0 ? (
                            <ul className="space-y-3">
                                {user.events_attending.map(event => (
                                    <li key={event.id} className="p-3 bg-gray-50 rounded-lg">
                                        <p className="font-semibold text-gray-800">{event.name}</p>
                                        <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">You haven't registered for any events. <Link to="/explore" className="text-indigo-600 font-semibold">Find an event</Link>.</p>
                        )}
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 flex items-center"><SparklesIcon className="h-6 w-6 mr-2 text-yellow-500"/>Recommended For You</h2>
                        {loadingRecs ? <p>Loading...</p> : recommendations.length > 0 ? (
                            <ul className="space-y-3">
                                {recommendations.map(event => (
                                    <li key={event.id} className="p-3 bg-gray-50 rounded-lg">
                                        <p className="font-semibold text-gray-800">{event.name}</p>
                                        <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No recommendations right now. Join more clubs to get suggestions!</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    export default StudentDashboard;