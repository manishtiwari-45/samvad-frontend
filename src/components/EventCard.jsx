import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';

const EventCard = ({ event }) => {
    // Dummy data jo hum baad mein real data se replace kar sakte hain
    const dummyData = {
        imageUrl: `https://picsum.photos/seed/${event.id + 100}/400/200`,
        category: 'Technology',
        price: Math.random() > 0.7 ? `$${Math.floor(Math.random() * 10) + 5}` : 'Free',
        level: ['Beginner', 'Intermediate', 'All Levels'][Math.floor(Math.random() * 3)]
    };

    const eventDate = new Date(event.date);
    const eventTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300">
            <Link to="#" className="block"> {/* Abhi ke liye Event Detail page nahi hai, isliye # */}
                <div className="relative">
                    <img className="w-full h-48 object-cover" src={dummyData.imageUrl} alt={`${event.name} image`} />
                    <div className="absolute top-2 left-2 bg-white bg-opacity-90 text-gray-800 text-xs px-2 py-1 rounded-full">{dummyData.category}</div>
                    <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full font-semibold">{dummyData.price}</div>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-1">{event.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                    
                    <div className="flex items-center mt-4 text-sm text-gray-500">
                        <Calendar size={14} className="mr-2" />
                        <span>{eventDate.toDateString()}</span>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock size={14} className="mr-2" />
                        <span>{eventTime}</span>
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">{dummyData.level}</span>
                        <span className="text-indigo-600 font-semibold text-sm">View Details →</span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default EventCard;