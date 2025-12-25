import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Star, Calendar } from 'lucide-react';

const ClubCard = ({ club }) => {
    // Use real club data with fallbacks
    const clubImageUrl = club.cover_image_url || `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop&crop=center`;
    const memberCount = club.members?.length || 0;
    const eventCount = club.events?.length || 0;
    const clubCategory = club.category || 'General';
    const isActive = true; // Assume all clubs are active unless specified otherwise

    const getCategoryColor = (category) => {
        const colors = {
            'Technology': 'bg-accent/10 text-accent',
            'Arts': 'bg-warning/10 text-warning',
            'Sports': 'bg-success/10 text-success',
            'Academic': 'bg-info/10 text-info',
            'Social': 'bg-error/10 text-error',
        };
        return colors[category] || 'bg-secondary/10 text-secondary';
    };

    return (
        <Link 
            to={`/clubs/${club.id}`} 
            className="card-hover block overflow-hidden group animate-fade-in-up"
        >
            {/* Club Image/Header */}
            <div className="relative h-48 overflow-hidden">
                <img 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src={clubImageUrl} 
                    alt={`${club.name} cover`}
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Status indicator */}
                <div className="absolute top-3 left-3">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                        isActive ? 'bg-success/20 text-success' : 'bg-secondary/20 text-secondary'
                    } backdrop-blur-sm`}>
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-success' : 'bg-secondary'}`}></div>
                        <span>{isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 right-3">
                    <span className={`badge ${getCategoryColor(clubCategory)} backdrop-blur-sm`}>
                        {clubCategory}
                    </span>
                </div>

                {/* Club name overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-xl font-bold text-white mb-1 group-hover:text-accent-light transition-colors duration-300">
                        {club.name}
                    </h2>
                </div>
            </div>

            {/* Club Details */}
            <div className="p-6">
                <p className="text-secondary text-sm leading-relaxed mb-4 line-clamp-2">
                    {club.description || "Join this amazing club and connect with like-minded individuals who share your passion and interests."}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-secondary">
                            <Users size={14} className="mr-1" />
                            <span>{memberCount} members</span>
                        </div>
                        <div className="flex items-center text-secondary">
                            <Calendar size={14} className="mr-1" />
                            <span>{eventCount} events</span>
                        </div>
                    </div>
                    <div className="flex items-center text-accent">
                        <span className="text-xs font-medium">Est. {club.founded_date ? new Date(club.founded_date).getFullYear() : 'Recently'}</span>
                    </div>
                </div>

                {/* Action area */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-secondary-muted">
                        Click to explore
                    </span>
                    <div className="flex items-center text-accent font-medium text-sm group-hover:text-accent-hover transition-colors">
                        <span>View Details</span>
                        <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </Link>
    );
};

export default ClubCard;