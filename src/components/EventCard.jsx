import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerForEvent } from '../services/api';

const EventCard = ({ event }) => {
const { user } = useAuth();

const dummyData = {
    imageUrl: `https://picsum.photos/seed/${event.id + 100}/400/200`,
    category: 'Technology',
    price: Math.random() > 0.7 ? `$${Math.floor(Math.random() * 10) + 5}` : 'Free',
    level: ['Beginner', 'Intermediate', 'All Levels'][Math.floor(Math.random() * 3)]
};

const eventDate = new Date(event.date);
const eventTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const handleRegister = async (e) => {
    // In events ko pass karna zaroori hai taaki button click par page na badle
    e.preventDefault();
    e.stopPropagation();
    try {
        await registerForEvent(event.id);
        alert('Successfully registered for the event!');
    } catch (error) {
        alert(error.response?.data?.detail || 'Could not register for the event.');
    }
};

return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        {/* Link abhi bhi poore card par hai */}
        <Link to="#" className="block flex-grow">
            <div className="relative">
                <img className="w-full h-48 object-cover" src={dummyData.imageUrl} alt={`${event.name} image`} />
                <div className="absolute top-2 left-2 bg-white bg-opacity-90 text-gray-800 text-xs px-2 py-1 rounded-full">{dummyData.category}</div>
                <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full font-semibold">{dummyData.price}</div>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-1">{event.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2 flex-grow">{event.description}</p>
                <div className="flex items-center mt-4 text-sm text-gray-500"><Calendar size={14} className="mr-2" /><span>{eventDate.toDateString()}</span></div>
                <div className="flex items-center mt-2 text-sm text-gray-500"><Clock size={14} className="mr-2" /><span>{eventTime}</span></div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">{dummyData.level}</span>
                        <span className="text-indigo-600 font-semibold text-sm">View Details →</span>
                </div>
            </div>
        </Link>
        
        {/* Naya Conditional Register Button */}
        {user.role === 'student' && (
            <div className="p-4 pt-0">
                <button onClick={handleRegister} className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 text-sm font-semibold transition-transform transform hover:scale-105">
                    Register for Event
                </button>
            </div>
        )}
    </div>
);
};

export default EventCard;