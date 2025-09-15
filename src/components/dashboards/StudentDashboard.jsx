import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, ScanFace, CheckCircle, User, TentTree, Calendar } from 'lucide-react';
import Chatbot from '../common/Chatbot'; // Import the new Chatbot component

// Card component ko naye dark theme colors ke saath update kiya gaya hai
const DashboardCard = ({ to, icon, title, children }) => (
    <div className="bg-card border border-border p-6 rounded-xl shadow-lg flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-accent/50">
        <div className="flex-grow">
            <h2 className="text-xl font-bold text-primary flex items-center mb-3">
                {icon}
                {title}
            </h2>
            <div className="text-secondary text-sm">
                {children}
            </div>
        </div>
        <Link to={to} className="flex items-center mt-6 text-accent font-semibold hover:text-accent-hover group">
            {title === "My Profile" ? "Go to Profile" : `Explore ${title}`}
            <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
        </Link>
    </div>
);

const StudentDashboard = () => {
    const { user } = useAuth();

    if (!user) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-4xl font-bold text-primary">Welcome, {user.full_name.split(' ')[0]}!</h1>
                <p className="text-secondary mt-1">Here's a quick overview of your activities and opportunities.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* My Clubs Card */}
                <DashboardCard to="/clubs" icon={<TentTree className="mr-3 text-green-500"/>} title="My Clubs">
                    {user.clubs && user.clubs.length > 0 ? (
                        <div>
                            <p>You are a member of <span className="font-bold text-primary">{user.clubs.length}</span> club(s).</p>
                            <ul className="mt-3 space-y-2 list-disc list-inside">
                            {user.clubs.slice(0, 2).map(club => (
                                <li key={club.id}><Link to={`/clubs/${club.id}`} className="hover:text-accent">{club.name}</Link></li>
                            ))}
                            </ul>
                        </div>
                    ) : (
                        <p>You haven't joined any clubs yet.</p>
                    )}
                </DashboardCard>

                {/* My Events Card */}
                <DashboardCard to="/events" icon={<Calendar className="mr-3 text-purple-500"/>} title="My Events">
                    {user.events_attending && user.events_attending.length > 0 ? (
                        <div>
                        <p>You are registered for <span className="font-bold text-primary">{user.events_attending.length}</span> event(s).</p>
                            <ul className="mt-3 space-y-2 list-disc list-inside">
                            {user.events_attending.slice(0, 2).map(event => (
                                <li key={event.id}>{event.name}</li> 
                            ))}
                            </ul>
                        </div>
                    ) : (
                        <p>You haven't registered for any events.</p>
                    )}
                </DashboardCard>

                {/* My Profile Card */}
                <DashboardCard to="/profile" icon={<User className="mr-3 text-blue-500"/>} title="My Profile">
                    <p>View your detailed profile, achievements, activity, and goals.</p>
                </DashboardCard>
                
                {/* AI Attendance Card */}
                <div className="bg-card border border-border p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-accent/50">
                    <h2 className="text-xl font-bold text-primary flex items-center mb-3">
                    <ScanFace size={22} className="mr-3 text-accent" /> AI Attendance
                    </h2>
                    {user.face_encoding ? (
                        <div className="text-center p-4 bg-green-900/50 border border-green-500/30 rounded-lg">
                            <CheckCircle className="h-10 w-10 text-green-400 mx-auto" />
                            <p className="mt-2 font-semibold text-green-300">Your face is enrolled!</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-secondary text-sm">Enroll your face to use our AI-powered attendance system for all events.</p>
                            <Link to="/enroll-face" className="flex items-center mt-6 text-accent font-semibold hover:text-accent-hover group">
                                Enroll Your Face <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </>
                    )}
                </div>
            </div>
            
            {/* Add the Chatbot component here */}
            <Chatbot />
        </div>
    );
};

export default StudentDashboard;
