import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, ScanFace, CheckCircle } from 'lucide-react'; // ScanFace aur CheckCircle import karein

const StudentDashboard = () => {
    const { user } = useAuth();

    if (!user) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.full_name.split(' ')[0]}!</h1>
                <p className="text-gray-500 mt-1">Here's a quick overview of your activities.</p>
            </div>
            
            {/* Grid ko 2-column layout mein badla gaya hai */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* My Clubs Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">My Clubs</h2>
                    {user.clubs && user.clubs.length > 0 ? (
                        <div>
                            <p className="text-gray-600">You are a member of <span className="font-bold">{user.clubs.length}</span> club(s).</p>
                            <ul className="mt-4 space-y-2">
                            {user.clubs.slice(0, 3).map(club => (
                                <li key={club.id}><Link to={`/clubs/${club.id}`} className="text-sm font-semibold text-gray-700 hover:text-indigo-600">{club.name}</Link></li>
                            ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-500">You haven't joined any clubs yet.</p>
                    )}
                    <Link to="/clubs" className="flex items-center mt-6 text-indigo-600 font-semibold hover:underline">
                        Explore All Clubs <ArrowRight size={16} className="ml-2" />
                    </Link>
                </div>

                {/* My Events Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">My Events</h2>
                    {user.events_attending && user.events_attending.length > 0 ? (
                        <div>
                        <p className="text-gray-600">You are registered for <span className="font-bold">{user.events_attending.length}</span> event(s).</p>
                            <ul className="mt-4 space-y-2">
                            {user.events_attending.slice(0, 3).map(event => (
                                <li key={event.id} className="text-sm font-semibold text-gray-700">{event.name}</li> 
                            ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-500">You haven't registered for any events.</p>
                    )}
                    <Link to="/events" className="flex items-center mt-6 text-indigo-600 font-semibold hover:underline">
                        Discover More Events <ArrowRight size={16} className="ml-2" />
                    </Link>
                </div>

                {/* Profile Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">My Profile</h2>
                    <p className="text-gray-500">View your detailed profile, achievements, and activity.</p>
                    <Link to="/profile" className="flex items-center mt-6 text-indigo-600 font-semibold hover:underline">
                        Go to My Profile <ArrowRight size={16} className="ml-2" />
                    </Link>
                </div>
                
                {/* --- NAYA AI ATTENDANCE CARD --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <ScanFace size={22} className="mr-3 text-indigo-600" /> AI Attendance
                    </h2>
                    {user.face_encoding ? (
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                            <p className="mt-2 font-semibold text-green-700">Your face is enrolled!</p>
                            <p className="text-sm text-gray-500">You are ready for AI attendance.</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-500">Enroll your face once to use our AI-powered attendance system for all events.</p>
                            <Link to="/enroll-face" className="flex items-center mt-6 text-indigo-600 font-semibold hover:underline">
                                Enroll Your Face <ArrowRight size={16} className="ml-2" />
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;