import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight, Star, Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { eventApi } from '../services/api';

const EventCard = ({ event }) => {
    const { user } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Use real event data with fallbacks
    const eventImageUrl = event.image_url || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop&crop=center`;
    const eventLocation = event.location || 'Location TBA';
    const eventPrice = event.price || 'Free';
    const registeredCount = event.attendees?.length || 0;
    const maxAttendees = event.max_attendees || 100;
    const organizerName = event.club?.name || 'Event Organizer';
    const eventCategory = event.category || 'General';
    const isFull = registeredCount >= maxAttendees;

    const eventDate = new Date(event.date);
    const eventTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isUpcoming = eventDate > new Date();
    const daysUntil = Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24));

    const getCategoryColor = (category) => {
        const colors = {
            'Technology': 'bg-accent/10 text-accent',
            'Arts': 'bg-warning/10 text-warning',
            'Sports': 'bg-success/10 text-success',
            'Academic': 'bg-info/10 text-info',
            'Social': 'bg-error/10 text-error',
            'Workshop': 'bg-secondary/10 text-secondary',
        };
        return colors[category] || 'bg-secondary/10 text-secondary';
    };

    const getLevelColor = (level) => {
        const colors = {
            'Beginner': 'bg-success/10 text-success',
            'Intermediate': 'bg-warning/10 text-warning',
            'Advanced': 'bg-error/10 text-error',
            'All Levels': 'bg-info/10 text-info',
        };
        return colors[level] || 'bg-secondary/10 text-secondary';
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isFull) return;
        
        setIsRegistering(true);
        try {
            await eventApi.register(event.id);
            // Show success notification (you could use a toast library)
            alert('Successfully registered for the event!');
        } catch (error) {
            alert(error.response?.data?.detail || 'Could not register for the event.');
        } finally {
            setIsRegistering(false);
        }
    };

    const handleBookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsBookmarked(!isBookmarked);
    };

    return (
        <div className="card-hover overflow-hidden group animate-fade-in-up relative">
            {/* Popular badge - show if event has high registration */}
            {registeredCount > maxAttendees * 0.8 && (
                <div className="absolute top-3 left-3 z-10">
                    <div className="bg-warning text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                        <Star size={12} className="mr-1 fill-current" />
                        Popular
                    </div>
                </div>
            )}

            {/* Bookmark button */}
            <button
                onClick={handleBookmark}
                className="absolute top-3 right-3 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Bookmark event"
            >
                {isBookmarked ? <BookmarkCheck size={16} className="text-accent" /> : <Bookmark size={16} />}
            </button>

            <Link to={`/events/${event.id}`} className="block">
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                    <img 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        src={eventImageUrl} 
                        alt={`${event.name} image`}
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Price badge */}
                    <div className="absolute bottom-3 right-3">
                        <span className={`badge font-semibold ${
                            eventPrice === 'Free' ? 'bg-success text-white' : 'bg-accent text-white'
                        } backdrop-blur-sm`}>
                            {eventPrice}
                        </span>
                    </div>

                    {/* Date indicator */}
                    {isUpcoming && daysUntil <= 7 && (
                        <div className="absolute bottom-3 left-3">
                            <div className="bg-warning/90 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm">
                                {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                            </div>
                        </div>
                    )}
                </div>

                {/* Event Details */}
                <div className="p-6">
                    {/* Category */}
                    <div className="flex items-center mb-3">
                        <span className={`badge ${getCategoryColor(eventCategory)}`}>
                            {eventCategory}
                        </span>
                    </div>

                    {/* Event Title */}
                    <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors duration-300 mb-2 line-clamp-1">
                        {event.name}
                    </h3>

                    {/* Event Description */}
                    <p className="text-sm text-secondary leading-relaxed mb-4 line-clamp-2">
                        {event.description || "Join us for an exciting event that will expand your horizons and connect you with amazing people."}
                    </p>

                    {/* Event Meta Information */}
                    <div className="space-y-2 mb-4 text-sm text-secondary">
                        <div className="flex items-center">
                            <Calendar size={14} className="mr-2 text-accent" />
                            <span>{eventDate.toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                            })}</span>
                            <Clock size={14} className="ml-4 mr-2 text-accent" />
                            <span>{eventTime}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin size={14} className="mr-2 text-accent" />
                            <span>{eventLocation}</span>
                        </div>
                        <div className="flex items-center">
                            <Users size={14} className="mr-2 text-accent" />
                            <span>{registeredCount}/{maxAttendees} registered</span>
                        </div>
                    </div>

                    {/* Organizer */}
                    <div className="text-xs text-secondary-muted mb-4">
                        Organized by <span className="font-medium text-secondary">{organizerName}</span>
                    </div>

                    {/* Progress bar for registration */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs text-secondary-muted mb-1">
                            <span>Registration</span>
                            <span>{Math.round((registeredCount / maxAttendees) * 100)}%</span>
                        </div>
                        <div className="w-full bg-background-tertiary rounded-full h-1.5">
                            <div 
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    registeredCount / maxAttendees > 0.8 ? 'bg-warning' : 'bg-accent'
                                }`}
                                style={{ width: `${(registeredCount / maxAttendees) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Action area */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-xs text-secondary-muted">
                            Click to view details
                        </span>
                        <div className="flex items-center text-accent font-medium text-sm group-hover:text-accent-hover transition-colors">
                            <span>Learn More</span>
                            <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
            </Link>
            
            {/* Registration Button */}
            {user?.role === 'student' && isUpcoming && (
                <div className="p-6 pt-0">
                    <button 
                        onClick={handleRegister} 
                        disabled={isRegistering || isFull}
                        className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            isFull 
                                ? 'bg-secondary/20 text-secondary cursor-not-allowed' 
                                : 'btn-success hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg'
                        }`}
                    >
                        {isRegistering ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Registering...
                            </div>
                        ) : isFull ? (
                            'Event Full'
                        ) : (
                            'Register Now'
                        )}
                    </button>
                </div>
            )}

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
    );
};

export default EventCard;