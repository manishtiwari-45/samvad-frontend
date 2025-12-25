import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
    Calendar, 
    Clock, 
    MapPin, 
    Users, 
    Star, 
    Share2, 
    Bookmark, 
    BookmarkCheck,
    ArrowLeft,
    User,
    Tag,
    Trophy,
    Globe,
    Phone,
    Mail
} from 'lucide-react';
import { format } from 'date-fns';

const EventDetailPage = () => {
    const { eventId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    // Use real event data with fallbacks
    const eventImageUrl = event?.image_url || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&crop=center`;
    const eventLocation = event?.location || 'Location TBA';
    const eventPrice = event?.price || 'Free';
    const registeredCount = event?.attendees?.length || 0;
    const maxAttendees = event?.max_attendees || 100;
    const organizerName = event?.club?.name || 'Event Organizer';
    const organizerEmail = event?.club?.contact_email || 'contact@samvad.edu';
    const organizerWebsite = event?.club?.website_url || '#';
    const eventCategory = event?.category || 'General';
    const eventTags = event?.tags || [eventCategory];
    const isFull = registeredCount >= maxAttendees;
    const isPopular = registeredCount > maxAttendees * 0.8;

    const fetchEventData = useCallback(async () => {
        try {
            setLoading(true);
            const eventRes = await eventApi.getById(eventId);
            setEvent(eventRes.data);
            
            // Check if user is already registered
            if (user && eventRes.data.attendees) {
                setIsRegistered(eventRes.data.attendees.includes(user.id));
            }
        } catch (error) {
            console.error("Failed to fetch event data", error);
            // Show error message if event not found
            console.error('Event not found or API error:', error);
            setEvent(null);
        } finally {
            setLoading(false);
        }
    }, [eventId, user]);

    useEffect(() => {
        fetchEventData();
    }, [fetchEventData]);

    const handleRegister = async () => {
        if (isFull || isRegistered) return;
        
        setIsRegistering(true);
        try {
            await eventApi.register(eventId);
            setIsRegistered(true);
            alert('Successfully registered for the event!');
        } catch (error) {
            alert(error.response?.data?.detail || 'Could not register for the event.');
        } finally {
            setIsRegistering(false);
        }
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: event.name,
                text: event.description,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Event link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-secondary">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-primary mb-4">Event Not Found</h2>
                <p className="text-secondary mb-6">The event you're looking for doesn't exist or has been removed.</p>
                <button 
                    onClick={() => navigate('/events')} 
                    className="btn-primary"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Events
                </button>
            </div>
        );
    }

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

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Back Button */}
            <button 
                onClick={() => navigate('/events')} 
                className="btn-ghost hover:scale-105 active:scale-95"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Events
            </button>

            {/* Event Header */}
            <div className="card-elevated overflow-hidden">
                {/* Hero Image */}
                <div className="relative h-64 md:h-80">
                    <img 
                        className="w-full h-full object-cover" 
                        src={eventImageUrl} 
                        alt={event.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Floating Action Buttons */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                            onClick={handleBookmark}
                            className="p-3 bg-background/90 backdrop-blur-sm rounded-full text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200 hover:scale-110 active:scale-95"
                        >
                            {isBookmarked ? <BookmarkCheck size={20} className="text-accent" /> : <Bookmark size={20} />}
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-3 bg-background/90 backdrop-blur-sm rounded-full text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200 hover:scale-110 active:scale-95"
                        >
                            <Share2 size={20} />
                        </button>
                    </div>

                    {/* Event Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`badge ${getCategoryColor(eventCategory)} backdrop-blur-sm`}>
                                {eventCategory}
                            </span>
                            {isPopular && (
                                <span className="badge bg-warning text-white backdrop-blur-sm">
                                    <Star size={12} className="mr-1 fill-current" />
                                    Popular
                                </span>
                            )}
                            <span className={`badge font-semibold backdrop-blur-sm ${
                                eventPrice === 'Free' ? 'bg-success text-white' : 'bg-accent text-white'
                            }`}>
                                {eventPrice}
                            </span>
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.name}</h1>
                        
                        <div className="flex flex-wrap gap-4 text-white/90 text-sm">
                            <div className="flex items-center">
                                <Calendar size={16} className="mr-2" />
                                {eventDate.toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    month: 'long', 
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </div>
                            <div className="flex items-center">
                                <Clock size={16} className="mr-2" />
                                {eventTime}
                            </div>
                            <div className="flex items-center">
                                <MapPin size={16} className="mr-2" />
                                {eventLocation}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold text-primary mb-4">About This Event</h2>
                        <p className="text-secondary leading-relaxed mb-6">
                            {event.description || "Join us for an exciting event that will expand your horizons and connect you with amazing people. This comprehensive session covers everything you need to know and more!"}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {eventTags.map(tag => (
                                <span key={tag} className="badge-primary">
                                    <Tag size={12} className="mr-1" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Event Agenda - Only show if agenda data exists */}
                    {event.agenda && event.agenda.length > 0 && (
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold text-primary mb-6">Event Agenda</h2>
                            <div className="space-y-4">
                                {event.agenda.map((item, index) => (
                                    <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-background-tertiary hover:bg-card transition-colors">
                                        <div className="flex-shrink-0 w-20 text-sm font-medium text-accent">
                                            {item.time}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">{item.title}</h3>
                                            <p className="text-sm text-secondary">{item.duration}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Speakers - Only show if speakers data exists */}
                    {event.speakers && event.speakers.length > 0 && (
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold text-primary mb-6">Featured Speakers</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {event.speakers.map((speaker, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-background-tertiary">
                                        <img 
                                            className="w-12 h-12 rounded-xl" 
                                            src={`https://ui-avatars.com/api/?name=${speaker.name}&background=388BFD&color=fff&size=48`} 
                                            alt={speaker.name}
                                        />
                                        <div>
                                            <h3 className="font-semibold text-primary">{speaker.name}</h3>
                                            <p className="text-sm text-secondary">{speaker.title}</p>
                                            <p className="text-xs text-secondary-muted">{speaker.company}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Prerequisites - Only show if prerequisites data exists */}
                    {event.prerequisites && event.prerequisites.length > 0 && (
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold text-primary mb-4">Prerequisites</h2>
                            <ul className="space-y-2">
                                {event.prerequisites.map((prereq, index) => (
                                    <li key={index} className="flex items-center text-secondary">
                                        <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                                        {prereq}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Registration Card */}
                    {user?.role === 'student' && isUpcoming && (
                        <div className="card p-6">
                            <div className="text-center mb-6">
                                <div className="text-3xl font-bold text-primary mb-1">{eventPrice}</div>
                                <div className="text-sm text-secondary">per person</div>
                            </div>

                            {/* Registration Progress */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-secondary mb-2">
                                    <span>Registration</span>
                                    <span>{registeredCount}/{maxAttendees}</span>
                                </div>
                                <div className="w-full bg-background-tertiary rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            registeredCount / maxAttendees > 0.8 ? 'bg-warning' : 'bg-accent'
                                        }`}
                                        style={{ width: `${(registeredCount / maxAttendees) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-secondary-muted mt-1">
                                    {Math.round((registeredCount / maxAttendees) * 100)}% filled
                                </div>
                            </div>

                            <button 
                                onClick={handleRegister} 
                                disabled={isRegistering || isFull || isRegistered}
                                className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                    isFull 
                                        ? 'bg-secondary/20 text-secondary cursor-not-allowed' 
                                        : isRegistered
                                        ? 'bg-success/20 text-success cursor-not-allowed'
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
                                ) : isRegistered ? (
                                    '✓ Registered'
                                ) : (
                                    'Register Now'
                                )}
                            </button>

                            {isUpcoming && daysUntil <= 7 && (
                                <div className="mt-4 p-3 bg-warning/10 rounded-lg text-center">
                                    <div className="text-warning font-semibold">
                                        {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow!' : `${daysUntil} days left!`}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Event Details */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-primary mb-4">Event Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-secondary">
                                    <Users size={16} className="mr-2" />
                                    Attendees
                                </div>
                                <span className="font-medium text-primary">{registeredCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-secondary">
                                    <Trophy size={16} className="mr-2" />
                                    Category
                                </div>
                                <span className="font-medium text-primary">{eventCategory}</span>
                            </div>
                        </div>
                    </div>

                    {/* Organizer Info */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-primary mb-4">Organized By</h3>
                        <div className="flex items-center space-x-3 mb-4">
                            <img 
                                className="w-12 h-12 rounded-xl" 
                                src={`https://ui-avatars.com/api/?name=${organizerName}&background=388BFD&color=fff&size=48`} 
                                alt={organizerName}
                            />
                            <div>
                                <h4 className="font-semibold text-primary">{organizerName}</h4>
                                <p className="text-sm text-secondary">Event Organizer</p>
                            </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center text-secondary">
                                <Mail size={14} className="mr-2" />
                                <a href={`mailto:${organizerEmail}`} className="text-accent hover:underline">
                                    {organizerEmail}
                                </a>
                            </div>
                            <div className="flex items-center text-secondary">
                                <Globe size={14} className="mr-2" />
                                <a href={organizerWebsite} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                                    Visit Website
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;
