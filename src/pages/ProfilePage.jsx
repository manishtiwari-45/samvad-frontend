import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit, User, Mail, GraduationCap, BarChart, Trophy, Target, History, Plus, Calendar, Users, Award, TrendingUp, Star, MapPin, Phone, Globe } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Enhanced dummy data with more realistic information
    const dummyData = {
        major: "Computer Science",
        year: "Junior",
        bio: "Passionate about technology and innovation. Love to learn new things and collaborate on exciting projects. Always looking for opportunities to grow and make a positive impact.",
        points: 245,
        achievements: 5,
        location: "Sitare University Campus",
        phone: "+91 98765 43210",
        website: "github.com/johndoe",
        interests: ['Technology', 'Machine Learning', 'Web Development', 'Photography', 'Music', 'Sports'],
        skills: ['React', 'Python', 'JavaScript', 'Node.js', 'MongoDB'],
        recentActivity: [
            { type: 'event', title: 'Attended AI Workshop', club: 'Tech Club', date: '2025-01-08', icon: '🤖' },
            { type: 'join', title: 'Joined Photography Club', club: 'Photography Club', date: '2025-01-05', icon: '📸' },
            { type: 'achievement', title: 'Earned Leadership Badge', club: 'Student Council', date: '2025-01-03', icon: '🏆' },
            { type: 'event', title: 'Participated in Hackathon', club: 'Coding Club', date: '2025-01-01', icon: '💻' },
        ],
        goals: [
            { title: 'Join 5 Clubs', current: user?.clubs?.length || 0, target: 5, color: 'bg-accent' },
            { title: 'Attend 10 Events', current: user?.events_attending?.length || 0, target: 10, color: 'bg-success' },
            { title: 'Earn 500 Points', current: 245, target: 500, color: 'bg-warning' },
        ],
        badges: [
            { name: 'Early Adopter', description: 'One of the first users', color: 'bg-accent/10 text-accent' },
            { name: 'Active Member', description: 'Regularly participates', color: 'bg-success/10 text-success' },
            { name: 'Tech Enthusiast', description: 'Loves technology', color: 'bg-info/10 text-info' },
        ]
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-secondary">Loading profile...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Enhanced Profile Header */}
            <div className="card-elevated p-8 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-success/10 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
                
                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
                        {/* Avatar and basic info */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                            <div className="relative">
                                <img 
                                    className="h-32 w-32 rounded-2xl shadow-lg ring-4 ring-accent/20" 
                                    src={`https://ui-avatars.com/api/?name=${user.full_name}&background=388BFD&color=fff&size=128&font-size=0.4`} 
                                    alt="Profile" 
                                />
                                <div className="absolute -bottom-2 -right-2 bg-success rounded-full p-2">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                            </div>
                            
                            <div className="text-center sm:text-left">
                                <h1 className="text-3xl font-bold text-primary mb-2">{user.full_name}</h1>
                                <p className="text-secondary text-lg mb-1">{user.email}</p>
                                <p className="text-secondary-muted text-sm mb-3">{dummyData.major} • {dummyData.year}</p>
                                
                                {/* Contact info */}
                                <div className="flex flex-wrap gap-4 text-sm text-secondary">
                                    <div className="flex items-center">
                                        <MapPin size={14} className="mr-1" />
                                        {dummyData.location}
                                    </div>
                                    <div className="flex items-center">
                                        <Phone size={14} className="mr-1" />
                                        {dummyData.phone}
                                    </div>
                                    <div className="flex items-center">
                                        <Globe size={14} className="mr-1" />
                                        {dummyData.website}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex-shrink-0 ml-auto">
                            <button 
                                onClick={() => setIsEditing(!isEditing)}
                                className="btn-primary hover:scale-105 active:scale-95"
                            >
                                <Edit size={16} className="mr-2" />
                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-primary-muted leading-relaxed max-w-3xl">{dummyData.bio}</p>
                    </div>

                    {/* Enhanced Stats Bar */}
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 rounded-xl bg-card hover:bg-card-hover transition-all duration-200 hover:scale-105 cursor-pointer">
                            <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl mx-auto mb-2 transition-transform hover:scale-110">
                                <Users className="text-accent" size={20} />
                            </div>
                            <p className="text-2xl font-bold text-primary">{user.clubs?.length || 0}</p>
                            <p className="text-sm text-secondary">Clubs Joined</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-card hover:bg-card-hover transition-all duration-200 hover:scale-105 cursor-pointer">
                            <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-xl mx-auto mb-2 transition-transform hover:scale-110">
                                <Calendar className="text-success" size={20} />
                            </div>
                            <p className="text-2xl font-bold text-primary">{user.events_attending?.length || 0}</p>
                            <p className="text-sm text-secondary">Events Attended</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-card hover:bg-card-hover transition-all duration-200 hover:scale-105 cursor-pointer">
                            <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-xl mx-auto mb-2 transition-transform hover:scale-110">
                                <TrendingUp className="text-warning" size={20} />
                            </div>
                            <p className="text-2xl font-bold text-primary">{dummyData.points}</p>
                            <p className="text-sm text-secondary">Points Earned</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-card hover:bg-card-hover transition-all duration-200 hover:scale-105 cursor-pointer">
                            <div className="flex items-center justify-center w-12 h-12 bg-info/10 rounded-xl mx-auto mb-2 transition-transform hover:scale-110">
                                <Award className="text-info" size={20} />
                            </div>
                            <p className="text-2xl font-bold text-primary">{dummyData.achievements}</p>
                            <p className="text-sm text-secondary">Achievements</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    {/* Interests & Skills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Interests */}
                        <div className="card p-6">
                            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center">
                                <Star className="mr-2 text-accent" size={20} />
                                Interests
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {dummyData.interests.map(interest => (
                                    <span key={interest} className="badge-primary">
                                        {interest}
                                    </span>
                                ))}
                                <button className="badge border border-dashed border-border hover:border-accent hover:bg-accent/5 text-secondary hover:text-accent transition-all duration-200 hover:scale-105 active:scale-95">
                                    <Plus size={12} className="mr-1" />
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="card p-6">
                            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center">
                                <Target className="mr-2 text-success" size={20} />
                                Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {dummyData.skills.map(skill => (
                                    <span key={skill} className="badge-success">
                                        {skill}
                                    </span>
                                ))}
                                <button className="badge border border-dashed border-border hover:border-success hover:bg-success/5 text-secondary hover:text-success transition-all duration-200 hover:scale-105 active:scale-95">
                                    <Plus size={12} className="mr-1" />
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-primary mb-6 flex items-center">
                            <History className="mr-2 text-info" size={20} />
                            Recent Activity
                        </h2>
                        <div className="space-y-4">
                            {dummyData.recentActivity.map((activity, index) => (
                                <div key={activity.title} className="flex items-start space-x-4 p-4 rounded-xl bg-background-tertiary hover:bg-card transition-colors">
                                    <div className="flex-shrink-0 w-10 h-10 bg-card rounded-xl flex items-center justify-center text-lg">
                                        {activity.icon}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-medium text-primary truncate">{activity.title}</p>
                                        <p className="text-sm text-secondary">{activity.club}</p>
                                        <p className="text-xs text-secondary-muted mt-1">{new Date(activity.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className={`w-2 h-2 rounded-full ${
                                            activity.type === 'achievement' ? 'bg-warning' :
                                            activity.type === 'event' ? 'bg-accent' : 'bg-success'
                                        }`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                    {/* Goals Progress */}
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-primary mb-6 flex items-center">
                            <Target className="mr-2 text-accent" size={20} />
                            Goals
                        </h2>
                        <div className="space-y-6">
                            {dummyData.goals.map(goal => {
                                const progress = Math.min((goal.current / goal.target) * 100, 100);
                                return (
                                    <div key={goal.title}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium text-primary text-sm">{goal.title}</span>
                                            <span className="text-xs text-secondary">{goal.current}/{goal.target}</span>
                                        </div>
                                        <div className="w-full bg-background-tertiary rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-500 ${goal.color}`}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-secondary-muted mt-1">
                                            {progress.toFixed(0)}% complete
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Badges & Achievements */}
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-primary mb-6 flex items-center">
                            <Award className="mr-2 text-warning" size={20} />
                            Badges
                        </h2>
                        <div className="space-y-3">
                            {dummyData.badges.map(badge => (
                                <div key={badge.name} className={`p-3 rounded-xl ${badge.color}`}>
                                    <div className="font-medium text-sm">{badge.name}</div>
                                    <div className="text-xs opacity-80">{badge.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-primary mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button className="btn-secondary w-full justify-start">
                                <Users size={16} className="mr-2" />
                                Browse Clubs
                            </button>
                            <button className="btn-secondary w-full justify-start">
                                <Calendar size={16} className="mr-2" />
                                Find Events
                            </button>
                            <button className="btn-secondary w-full justify-start">
                                <Trophy size={16} className="mr-2" />
                                View Leaderboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Icons from different library, so need to get them from their source
const UserGroupIcon = (props) => (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.023.57-2.348 0-3.372m-7.5 2.962c.57-1.023.57-2.348 0-3.372m0 0a3 3 0 105.908 2.052 3 3 0 00-5.908-2.052zM12 7.5a3 3 0 100 6 3 3 0 000-6z" />
</svg>
);

const CalendarIcon = (props) => (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M5.25 6h13.5" />
</svg>
);


export default ProfilePage;