import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, ScanFace, CheckCircle, User, TentTree, Calendar, Trophy, Target, BookOpen, Zap, Plus, Activity, Star, Users, UserCheck, Clock, Shield } from 'lucide-react';
import RoleRequestModal from '../RoleRequestModal';
import { roleRequestApi } from '../../services/api';

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
    const [showRoleRequestModal, setShowRoleRequestModal] = useState(false);
    const [roleRequests, setRoleRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);

    // Use real user data with fallbacks
    const userClubs = user.clubs || [];
    const userEvents = user.events_attending || [];
    const dashboardData = {
        stats: {
            clubs: userClubs.length,
            events: userEvents.length,
            profile: user.face_encoding ? 'Complete' : 'Incomplete',
        },
        upcomingEvents: userEvents.filter(event => new Date(event.date) > new Date()).slice(0, 3),
        memberClubs: userClubs.slice(0, 3),
        recentActivity: [
            {
                icon: '🎉',
                title: 'Welcome to SAMVAD!',
                time: 'Just now'
            },
            {
                icon: '👤',
                title: 'Profile created successfully',
                time: '1 day ago'
            },
            {
                icon: '🔍',
                title: 'Explore clubs and events',
                time: '2 days ago'
            }
        ]
    };

    // Fetch user's role requests
    useEffect(() => {
        const fetchRoleRequests = async () => {
            if (user?.role === 'student') {
                setLoadingRequests(true);
                try {
                    const response = await roleRequestApi.getMyRequests();
                    setRoleRequests(response.data);
                } catch (error) {
                    console.error('Failed to fetch role requests:', error);
                } finally {
                    setLoadingRequests(false);
                }
            }
        };

        fetchRoleRequests();
    }, [user]);

    const handleRoleRequestSuccess = () => {
        // Refresh role requests after successful submission
        const fetchRoleRequests = async () => {
            try {
                const response = await roleRequestApi.getMyRequests();
                setRoleRequests(response.data);
            } catch (error) {
                console.error('Failed to fetch role requests:', error);
            }
        };
        fetchRoleRequests();
    };

    const hasPendingRequest = roleRequests.some(req => req.status === 'pending');
    const hasApprovedRequest = roleRequests.some(req => req.status === 'approved');

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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatsCard 
                    icon={<TentTree size={20} />} 
                    label="Clubs Joined" 
                    value={dashboardData.stats.clubs} 
                    color="success"
                />
                <StatsCard 
                    icon={<Calendar size={20} />} 
                    label="Events Registered" 
                    value={dashboardData.stats.events} 
                    color="info"
                />
                <StatsCard 
                    icon={<User size={20} />} 
                    label="Profile Status" 
                    value={dashboardData.stats.profile} 
                    color={user.face_encoding ? "success" : "warning"}
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

                    {/* Role Request Card - Only for students */}
                    {user.role === 'student' && (
                        <div className="card-hover p-6 animate-fade-in-up">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-primary flex items-center">
                                    <Shield size={20} className="mr-3 text-accent" />
                                    Admin Access
                                </h2>
                                {hasPendingRequest && (
                                    <div className="badge-warning">
                                        Pending Review
                                    </div>
                                )}
                                {hasApprovedRequest && (
                                    <div className="badge-success">
                                        Approved
                                    </div>
                                )}
                            </div>
                            
                            {hasApprovedRequest ? (
                                <div className="text-center p-6 bg-success/10 border border-success/20 rounded-xl">
                                    <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="text-success" size={24} />
                                    </div>
                                    <h3 className="font-semibold text-success mb-2">Admin Access Granted!</h3>
                                    <p className="text-sm text-secondary mb-4">Your role upgrade has been approved. You now have Club Admin privileges.</p>
                                    <div className="flex items-center justify-center text-xs text-secondary-muted">
                                        <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                                        Refresh the page to see your new dashboard
                                    </div>
                                </div>
                            ) : hasPendingRequest ? (
                                <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Clock className="text-yellow-600" size={24} />
                                    </div>
                                    <h3 className="font-semibold text-yellow-800 mb-2">Request Under Review</h3>
                                    <p className="text-sm text-yellow-700 mb-4">Your admin access request is being reviewed by Super Admins.</p>
                                    <div className="space-y-2">
                                        {roleRequests.filter(req => req.status === 'pending').map(request => (
                                            <div key={request.id} className="text-xs text-yellow-600 bg-yellow-100 rounded-lg p-2">
                                                <p><strong>Requested:</strong> {new Date(request.created_at).toLocaleDateString()}</p>
                                                <p><strong>Status:</strong> Pending Review</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-6 bg-accent/5 border border-accent/20 rounded-xl">
                                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <UserCheck className="text-accent" size={24} />
                                    </div>
                                    <h3 className="font-semibold text-primary mb-2">Need Admin Access?</h3>
                                    <p className="text-sm text-secondary mb-4">Request Club Admin privileges to manage clubs and events.</p>
                                    <button 
                                        onClick={() => setShowRoleRequestModal(true)}
                                        className="btn-primary"
                                    >
                                        <UserCheck size={16} className="mr-2" />
                                        Request Admin Access
                                    </button>
                                </div>
                            )}

                            {/* Show recent requests */}
                            {roleRequests.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-border">
                                    <h4 className="text-sm font-medium text-primary mb-2">Recent Requests</h4>
                                    <div className="space-y-2">
                                        {roleRequests.slice(0, 2).map(request => (
                                            <div key={request.id} className="flex items-center justify-between p-2 bg-background-tertiary rounded-lg">
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-2 h-2 rounded-full ${
                                                        request.status === 'pending' ? 'bg-yellow-500' :
                                                        request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></div>
                                                    <span className="text-xs text-secondary">
                                                        {new Date(request.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {request.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
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
            
            {/* Role Request Modal */}
            <RoleRequestModal
                isOpen={showRoleRequestModal}
                onClose={() => setShowRoleRequestModal(false)}
                onSuccess={handleRoleRequestSuccess}
            />
        </div>
    );
};

export default StudentDashboard;
