import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react'; // Using a more appropriate icon

const ClubCard = ({ club }) => {
    // A fallback image in case a club doesn't have a cover image
    const fallbackImage = `https://placehold.co/400x200/1a202c/ffffff?text=${club.name.replace(/\s+/g, '+')}`;

    return (
        <Link 
            to={`/clubs/${club.id}`} 
            className="block bg-card border border-border rounded-lg shadow-lg overflow-hidden group hover:shadow-2xl hover:border-accent/50 transition-all duration-300 hover:-translate-y-1"
        >
            <div className="relative">
                <img 
                    className="w-full h-40 object-cover" 
                    // Use the real cover image URL from the club data
                    src={club.cover_image_url || fallbackImage} 
                    alt={`${club.name} cover`} 
                    // Add an error handler for broken image links
                    onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                />
                {/* Use the real category from the club data */}
                {club.category && (
                    <div className="absolute top-2 right-2 bg-background/70 backdrop-blur-sm text-primary text-xs px-2 py-1 rounded-full flex items-center">
                        <Tag size={12} className="mr-1" />
                        {club.category}
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors duration-300 truncate">{club.name}</h3>
                <p className="text-sm text-secondary mt-1 h-10 line-clamp-2">{club.description}</p>
                {/* Member count and rating have been removed to avoid showing dummy data */}
            </div>
        </Link>
    );
};

export default ClubCard;
