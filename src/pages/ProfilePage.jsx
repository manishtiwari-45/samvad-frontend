import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit, User, Mail, GraduationCap, BarChart, Trophy, Target, History, Plus } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useAuth();

    // Dummy data jo hum baad mein real data se replace kar sakte hain
    const dummyData = {
        major: "Computer Science",
        year: "Junior",
        bio: "Passionate about technology and innovation. Love to learn new things and collaborate on exciting projects.",
        points: 245,
        achievements: 5,
        interests: ['Technology', 'Music', 'Sports'],
        recentActivity: [
            { type: 'event', title: 'Attended AI Workshop', club: 'Tech Club', date: '2025-01-08' },
            { type: 'join', title: 'Joined Photography Club', club: 'Photography Club', date: '2025-01-05' },
        ],
        goals: [
            { title: 'Join 5 Clubs', current: user.clubs.length, target: 5 },
        ]
    };

    if (!user) {
        return <div>Loading profile...</div>;
    }
    
    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                    <img className="h-24 w-24 rounded-full" src={`https://ui-avatars.com/api/?name=${user.full_name}&background=6366f1&color=fff&size=128`} alt="Profile" />
                    <div className="flex-grow text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row justify-between items-center">
                            <h1 className="text-3xl font-bold text-gray-800">{user.full_name}</h1>
                            <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 mt-2 sm:mt-0">
                                <Edit size={16} className="mr-2"/> Edit Profile
                            </button>
                        </div>
                        <p className="text-gray-500">{user.email}</p>
                        <p className="text-gray-500 text-sm">{dummyData.major} • {dummyData.year}</p>
                        <p className="mt-2 text-gray-700">{dummyData.bio}</p>
                    </div>
                </div>
                {/* Stats Bar */}
                <div className="mt-6 pt-4 border-t flex justify-around text-center">
                    <div>
                        <p className="text-2xl font-bold">{user.clubs.length}</p>
                        <p className="text-sm text-gray-500">Clubs</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{user.events_attending.length}</p>
                        <p className="text-sm text-gray-500">Events</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{dummyData.points}</p>
                        <p className="text-sm text-gray-500">Points</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{dummyData.achievements}</p>
                        <p className="text-sm text-gray-500">Achievements</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Interests */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Interests</h2>
                        <div className="flex flex-wrap gap-2">
                            {dummyData.interests.map(interest => (
                                <span key={interest} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{interest}</span>
                            ))}
                            <button className="flex items-center text-sm text-gray-500 hover:text-indigo-600">
                                <Plus size={14} className="mr-1"/> Add Interest
                            </button>
                        </div>
                    </div>
                    {/* Recent Activity */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                        <ul className="space-y-4">
                            {dummyData.recentActivity.map(activity => (
                                <li key={activity.title} className="flex items-center">
                                    <div className="p-2 bg-gray-100 rounded-full mr-4">{activity.type === 'event' ? '🗓️' : '🤝'}</div>
                                    <div>
                                        <p className="font-semibold">{activity.title}</p>
                                        <p className="text-sm text-gray-500">{activity.club} • {activity.date}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                    {/* Quick Stats */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h2>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center justify-between"><span className="flex items-center"><UserGroupIcon className="h-5 w-5 mr-2 text-gray-400"/>Clubs Joined</span> <span className="font-bold">{user.clubs.length}</span></li>
                            <li className="flex items-center justify-between"><span className="flex items-center"><CalendarIcon className="h-5 w-5 mr-2 text-gray-400"/>Events Attended</span> <span className="font-bold">{user.events_attending.length}</span></li>
                            <li className="flex items-center justify-between"><span className="flex items-center"><Trophy className="h-5 w-5 mr-2 text-gray-400"/>Points Earned</span> <span className="font-bold">{dummyData.points}</span></li>
                        </ul>
                    </div>
                    {/* Goals */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Goals</h2>
                        {dummyData.goals.map(goal => (
                            <div key={goal.title}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-semibold">{goal.title}</span>
                                    <span>{goal.current}/{goal.target}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(goal.current/goal.target)*100}%` }}></div>
                                </div>
                            </div>
                        ))}
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