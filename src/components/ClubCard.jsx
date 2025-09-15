import React from 'react';
import { Link } from 'react-router-dom';

const ClubCard = ({ club }) => {
    return (
        <Link 
            to={`/clubs/${club.id}`} 
            className="block bg-card border border-border rounded-xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:border-accent/50 hover:-translate-y-1"
        >
            {/* Top Section with large title */}
            <div className="h-32 flex items-center justify-center p-4">
                <h2 className="text-3xl font-bold text-primary text-center truncate group-hover:text-accent transition-colors duration-300">
                    {club.name}
                </h2>
            </div>

            {/* Bottom Section with details */}
            <div className="p-4 border-t border-border">
                <h3 className="font-bold text-primary truncate">{club.name}</h3>
                <p className="text-sm text-secondary mt-1 h-10 line-clamp-2">{club.description}</p>
            </div>
        </Link>
    );
};

export default ClubCard;