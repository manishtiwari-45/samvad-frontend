import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Star } from 'lucide-react';

const ClubCard = ({ club }) => {
    // Dummy data jo hum baad mein real data se replace kar sakte hain
    const dummyData = {
        imageUrl: `https://picsum.photos/seed/${club.id}/400/200`,
        rating: (4 + Math.random()).toFixed(1),
        tags: ['Technology', 'Innovation'],
        memberCount: Math.floor(Math.random() * 200) + 50,
    };

    return (
        <Link 
            to={`/clubs/${club.id}`} 
            className="block bg-card border border-border rounded-lg shadow-lg overflow-hidden group hover:shadow-2xl hover:border-accent/50 transition-all duration-300 hover:-translate-y-1"
        >
            <div className="relative">
                <img className="w-full h-40 object-cover" src={dummyData.imageUrl} alt={`${club.name} image`} />
                <div className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm text-primary text-xs px-2 py-1 rounded-full">{dummyData.tags[0]}</div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors duration-300">{club.name}</h3>
                <p className="text-sm text-secondary mt-1 line-clamp-2">{club.description}</p>
                <div className="flex justify-between items-center mt-4 text-sm text-secondary">
                    <span className="flex items-center">
                        <Users size={16} className="mr-1.5" /> {dummyData.memberCount} members
                    </span>
                    <span className="flex items-center font-bold text-yellow-500">
                        <Star size={16} className="mr-1" fill="currentColor" /> {dummyData.rating}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ClubCard;