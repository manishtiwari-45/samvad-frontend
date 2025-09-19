import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, ScanFace, CheckCircle, User, TentTree, Calendar, Trophy, Target, BookOpen, Zap, Plus, Activity, Star, Users } from 'lucide-react';
import Chatbot from '../common/Chatbot';

// Enhanced Dashboard Card component
const DashboardCard = ({ to, icon, title, children, className = "", stats = null }) => (
    <div className={`card-hover p-6 flex flex-col animate-fade-in-up ${className}`}>
        <div className="flex-grow">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary flex items-center">
                    {icon}
                    {title}
                </h2>
                {stats && (
                    <div className="text-right">
                        <div className="text-2xl font-bold text-accent">{stats.value}</div>
                        <div className="text-xs text-secondary-muted">{stats.label}</div>
                    </div>
                )}
            </div>
            <div className="text-secondary text-sm leading-relaxed">
                {children}
            </div>
        </div>
        <Link to={to} className="btn-ghost mt-6 justify-start group">
            {title === "My Profile" ? "View Profile" : `Explore ${title}`}
            <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
        </Link>
    </div>
);

// Quick Action Card component
const QuickActionCard = ({ to, icon, title, description, color = "accent" }) => (
    <Link to={to} className="card-hover p-4 group animate-fade-in-up">
        <div className={`w-12 h-12 bg-${color}/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <div className={`text-${color}`}>
                {icon}
            </div>
        </div>
        <h3 className="font-semibold text-primary mb-1">{title}</h3>
        <p className="text-xs text-secondary leading-relaxed">{description}</p>
    </Link>
);

// Stats Card component
const StatsCard = ({ icon, label, value, change, color = "accent" }) => (
    <div className="card p-4 text-center animate-fade-in-up">
        <div className={`w-12 h-12 bg-${color}/10 rounded-xl flex items-center justify-center mx-auto mb-3`}>
            <div className={`text-${color}`}>
                {icon}
            </div>
        </div>
        <div className="text-2xl font-bold text-primary mb-1">{value}</div>
        <div className="text-sm text-secondary mb-1">{label}</div>
        {change && (
            <div className={`text-xs ${change > 0 ? 'text-success' : 'text-error'}`}>
                {change > 0 ? '+' : ''}{change}% this week
            </div>
        )}
    </div>
);

const StudentDashboard = () => {
    const { user } = useAuth();

    // Enhanced dummy data for better dashboard experience
    const dashboardData = {
        stats: {
            points: 245,
            streak: 7,
            achievements: 5,
            rank: 23,
        },
        recentActivity: [
            { type: 'event', title: 'Attended AI Workshop', time: '2 hours ago', icon: '🤖' },
            { type: 'club', title: 'Joined Photography Club', time: '1 day ago', icon: '📸' },
            { type: 'achievement', title: 'Earned Early Bird Badge', time: '3 days ago', icon: '🏆' },
        ],
        upcomingEvents: [
            { name: 'React Workshop', date: 'Tomorrow', time: '2:00 PM' },
            { name: 'Photography Walk', date: 'Friday', time: '4:00 PM' },
        ],
        recommendations: [
            { type: 'club', name: 'Coding Club', reason: 'Based on your interests' },
            { type: 'event', name: 'Design Thinking Workshop', reason: 'Popular in your network' },
        ]
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-secondary">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="animate-fade-in">
                <h1 className="text-4xl font-bold text-primary mb-2">
                    Welcome back, {user.full_name.split(' ')[0]}! 👋
                </h1>
                <p className="text-secondary text-lg">
                    Ready to explore new opportunities and connect with your community?
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard 
                    icon={<Trophy size={20} />} 
                    label="Points Earned" 
                    value={dashboardData.stats.points} 
                    change={12}
                    color="warning"
                />
                <StatsCard 
                    icon={<Zap size={20} />} 
                    label="Day Streak" 
                    value={dashboardData.stats.streak} 
                    change={5}
                    color="success"
                />
                <StatsCard 
                    icon={<Star size={20} />} 
                    label="Achievements" 
                    value={dashboardData.stats.achievements} 
                    change={0}
                    color="info"
                />
                <StatsCard 
                    icon={<Users size={20} />} 
                    label="Campus Rank" 
                    value={`#${dashboardData.stats.rank}`} 
                    change={-2}
                    color="accent"
                />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Cards */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* My Clubs Card */}
                        <DashboardCard 
                            to="/clubs" 
                            icon={<TentTree className="mr-3 text-success" size={20} />} 
                            title="My Clubs"
                            stats={{ value: user.clubs?.length || 0, label: "Joined" }}
                        >
                            {user.clubs && user.clubs.length > 0 ? (
                                <div>
                                    <p className="mb-3">You're actively participating in {user.clubs.length} club{user.clubs.length !== 1 ? 's' : ''}.</p>
                                    <div className="space-y-2">
                                        {user.clubs.slice(0, 2).map(club => (
                                            <div key={club.id} className="flex items-center p-2 bg-background-tertiary rounded-lg">
                                                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center mr-3">
                                                    <TentTree size={14} className="text-success" />
                                                </div>
                                                <Link to={`/clubs/${club.id}`} className="font-medium text-primary hover:text-accent transition-colors">
                                                    {club.name}
                                                </Link>
                                            </div>
                                        ))}
                                        {user.clubs.length > 2 && (
                                            <p className="text-xs text-secondary-muted">+{user.clubs.length - 2} more clubs</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <TentTree size={24} className="text-success" />
                                    </div>
                                    <p className="mb-2">No clubs joined yet</p>
                                    <p className="text-xs text-secondary-muted">Discover amazing communities to join!</p>
                                </div>
                            )}
                        </DashboardCard>

                        {/* My Events Card */}
                        <DashboardCard 
                            to="/events" 
                            icon={<Calendar className="mr-3 text-info" size={20} />} 
                            title="My Events"
                            stats={{ value: user.events_attending?.length || 0, label: "Registered" }}
                        >
                            {user.events_attending && user.events_attending.length > 0 ? (
                                <div>
                                    <p className="mb-3">You're registered for {user.events_attending.length} upcoming event{user.events_attending.length !== 1 ? 's' : ''}.</p>
                                    <div className="space-y-2">
                                        {user.events_attending.slice(0, 2).map(event => (
                                            <div key={event.id} className="flex items-center p-2 bg-background-tertiary rounded-lg">
                                                <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center mr-3">
                                                    <Calendar size={14} className="text-info" />
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <p className="font-medium text-primary truncate">{event.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {user.events_attending.length > 2 && (
                                            <p className="text-xs text-secondary-muted">+{user.events_attending.length - 2} more events</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Calendar size={24} className="text-info" />
                                    </div>
                                    <p className="mb-2">No events registered</p>
                                    <p className="text-xs text-secondary-muted">Find exciting events to attend!</p>
                                </div>
                            )}
                        </DashboardCard>
                    </div>

                    {/* AI Attendance Card */}
                    <div className="card-hover p-6 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-primary flex items-center">
                                <ScanFace size={20} className="mr-3 text-accent" />
                                AI Attendance
                            </h2>
                            <div className="badge-primary">
                                AI Powered
                            </div>
                        </div>
                        
                        {user.face_encoding ? (
                            <div className="text-center p-6 bg-success/10 border border-success/20 rounded-xl">
                                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-success" size={24} />
                                </div>
                                <h3 className="font-semibold text-success mb-2">Face Enrolled Successfully!</h3>
                                <p className="text-sm text-secondary mb-4">You can now use AI-powered attendance for all events.</p>
                                <div className="flex items-center justify-center text-xs text-secondary-muted">
                                    <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                                    Ready for automatic check-ins
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-6 bg-accent/5 border border-accent/20 rounded-xl">
                                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ScanFace className="text-accent" size={24} />
                                </div>
                                <h3 className="font-semibold text-primary mb-2">Enroll Your Face</h3>
                                <p className="text-sm text-secondary mb-4">Enable AI-powered attendance for seamless event check-ins.</p>
                                <Link to="/enroll-face" className="btn-primary">
                                    <ScanFace size={16} className="mr-2" />
                                    Start Enrollment
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="card p-6 animate-fade-in-up">
                        <h3 className="font-semibold text-primary mb-4 flex items-center">
                            <Zap size={18} className="mr-2 text-accent" />
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <QuickActionCard
                                to="/profile"
                                icon={<User size={18} />}
                                title="Profile"
                                description="View & edit"
                                color="accent"
                            />
                            <QuickActionCard
                                to="/clubs"
                                icon={<Plus size={18} />}
                                title="Join Club"
                                description="Find new ones"
                                color="success"
                            />
                            <QuickActionCard
                                to="/events"
                                icon={<Calendar size={18} />}
                                title="Events"
                                description="Discover more"
                                color="info"
                            />
                            <QuickActionCard
                                to="/gallery"
                                icon={<BookOpen size={18} />}
                                title="Gallery"
                                description="Browse photos"
                                color="warning"
                            />
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="card p-6 animate-fade-in-up">
                        <h3 className="font-semibold text-primary mb-4 flex items-center">
                            <Activity size={18} className="mr-2 text-info" />
                            Recent Activity
                        </h3>
                        <div className="space-y-3">
                            {dashboardData.recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start space-x-3 p-3 bg-background-tertiary rounded-lg">
                                    <div className="flex-shrink-0 text-lg">
                                        {activity.icon}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="text-sm font-medium text-primary truncate">{activity.title}</p>
                                        <p className="text-xs text-secondary-muted">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    {dashboardData.upcomingEvents.length > 0 && (
                        <div className="card p-6 animate-fade-in-up">
                            <h3 className="font-semibold text-primary mb-4 flex items-center">
                                <Calendar size={18} className="mr-2 text-success" />
                                Coming Up
                            </h3>
                            <div className="space-y-3">
                                {dashboardData.upcomingEvents.map((event, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-primary">{event.name}</p>
                                            <p className="text-xs text-secondary">{event.date} • {event.time}</p>
                                        </div>
                                        <div className="w-2 h-2 bg-success rounded-full"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Chatbot */}
            <Chatbot />
        </div>
    );
};

export default StudentDashboard;
