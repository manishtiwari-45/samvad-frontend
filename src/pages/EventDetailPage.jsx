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

    // Enhanced dummy data for the event detail page
    const dummyData = {
        imageUrl: `https://picsum.photos/seed/${eventId}/800/400`,
        category: ['Technology', 'Arts', 'Sports', 'Academic', 'Social', 'Workshop'][Math.floor(Math.random() * 6)],
        price: Math.random() > 0.7 ? `₹${Math.floor(Math.random() * 500) + 100}` : 'Free',
        level: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'][Math.floor(Math.random() * 4)],
        attendees: Math.floor(Math.random() * 150) + 20,
        maxAttendees: Math.floor(Math.random() * 200) + 100,
        location: ['Main Auditorium', 'Tech Lab', 'Sports Complex', 'Library Hall', 'Online'][Math.floor(Math.random() * 5)],
        organizer: {
            name: 'Tech Club',
            email: 'tech@stellarhub.edu',
            phone: '+91 98765 43210',
            website: 'https://techclub.stellarhub.edu'
        },
        rating: (4 + Math.random()).toFixed(1),
        isPopular: Math.random() > 0.7,
        isFull: Math.random() > 0.9,
        tags: ['Technology', 'AI', 'Machine Learning', 'Workshop', 'Hands-on'],
        prerequisites: ['Basic programming knowledge', 'Laptop required', 'Interest in AI'],
        agenda: [
            { time: '10:00 AM', title: 'Welcome & Introduction', duration: '30 mins' },
            { time: '10:30 AM', title: 'AI Fundamentals', duration: '60 mins' },
            { time: '11:30 AM', title: 'Coffee Break', duration: '15 mins' },
            { time: '11:45 AM', title: 'Hands-on Workshop', duration: '90 mins' },
            { time: '1:15 PM', title: 'Q&A Session', duration: '30 mins' },
            { time: '1:45 PM', title: 'Closing & Networking', duration: '30 mins' }
        ],
        speakers: [
            { name: 'Dr. Sarah Johnson', title: 'AI Research Scientist', company: 'Tech Corp' },
            { name: 'Mike Chen', title: 'Senior ML Engineer', company: 'AI Solutions' }
        ]
    };

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
            // Create a dummy event if API fails
            setEvent({
                id: eventId,
                name: 'AI Workshop: Machine Learning Fundamentals',
                description: 'Join us for an exciting hands-on workshop where you\'ll learn the fundamentals of machine learning and artificial intelligence. This comprehensive session covers everything from basic concepts to practical implementation, perfect for students and professionals looking to dive into the world of AI.',
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
                created_at: new Date().toISOString()
            });
        } finally {
            setLoading(false);
        }
    }, [eventId, user]);

    useEffect(() => {
        fetchEventData();
    }, [fetchEventData]);

    const handleRegister = async () => {
        if (dummyData.isFull || isRegistered) return;
        
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
                        src={dummyData.imageUrl} 
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
                            <span className={`badge ${getCategoryColor(dummyData.category)} backdrop-blur-sm`}>
                                {dummyData.category}
                            </span>
                            <span className={`badge ${getLevelColor(dummyData.level)} backdrop-blur-sm`}>
                                {dummyData.level}
                            </span>
                            {dummyData.isPopular && (
                                <span className="badge bg-warning text-white backdrop-blur-sm">
                                    <Star size={12} className="mr-1 fill-current" />
                                    Popular
                                </span>
                            )}
                            <span className={`badge font-semibold backdrop-blur-sm ${
                                dummyData.price === 'Free' ? 'bg-success text-white' : 'bg-accent text-white'
                            }`}>
                                {dummyData.price}
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
                                {dummyData.location}
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
                            {dummyData.tags.map(tag => (
                                <span key={tag} className="badge-primary">
                                    <Tag size={12} className="mr-1" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Event Agenda */}
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold text-primary mb-6">Event Agenda</h2>
                        <div className="space-y-4">
                            {dummyData.agenda.map((item, index) => (
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

                    {/* Speakers */}
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold text-primary mb-6">Featured Speakers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dummyData.speakers.map((speaker, index) => (
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

                    {/* Prerequisites */}
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold text-primary mb-4">Prerequisites</h2>
                        <ul className="space-y-2">
                            {dummyData.prerequisites.map((prereq, index) => (
                                <li key={index} className="flex items-center text-secondary">
                                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                                    {prereq}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Registration Card */}
                    {user?.role === 'student' && isUpcoming && (
                        <div className="card p-6">
                            <div className="text-center mb-6">
                                <div className="text-3xl font-bold text-primary mb-1">{dummyData.price}</div>
                                <div className="text-sm text-secondary">per person</div>
                            </div>

                            {/* Registration Progress */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-secondary mb-2">
                                    <span>Registration</span>
                                    <span>{dummyData.attendees}/{dummyData.maxAttendees}</span>
                                </div>
                                <div className="w-full bg-background-tertiary rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            dummyData.attendees / dummyData.maxAttendees > 0.8 ? 'bg-warning' : 'bg-accent'
                                        }`}
                                        style={{ width: `${(dummyData.attendees / dummyData.maxAttendees) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-secondary-muted mt-1">
                                    {Math.round((dummyData.attendees / dummyData.maxAttendees) * 100)}% filled
                                </div>
                            </div>

                            <button 
                                onClick={handleRegister} 
                                disabled={isRegistering || dummyData.isFull || isRegistered}
                                className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                    dummyData.isFull 
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
                                ) : dummyData.isFull ? (
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
                                <span className="font-medium text-primary">{dummyData.attendees}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-secondary">
                                    <Star size={16} className="mr-2" />
                                    Rating
                                </div>
                                <span className="font-medium text-primary">{dummyData.rating}/5</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-secondary">
                                    <Trophy size={16} className="mr-2" />
                                    Level
                                </div>
                                <span className="font-medium text-primary">{dummyData.level}</span>
                            </div>
                        </div>
                    </div>

                    {/* Organizer Info */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-primary mb-4">Organized By</h3>
                        <div className="flex items-center space-x-3 mb-4">
                            <img 
                                className="w-12 h-12 rounded-xl" 
                                src={`https://ui-avatars.com/api/?name=${dummyData.organizer.name}&background=388BFD&color=fff&size=48`} 
                                alt={dummyData.organizer.name}
                            />
                            <div>
                                <h4 className="font-semibold text-primary">{dummyData.organizer.name}</h4>
                                <p className="text-sm text-secondary">Event Organizer</p>
                            </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center text-secondary">
                                <Mail size={14} className="mr-2" />
                                <a href={`mailto:${dummyData.organizer.email}`} className="text-accent hover:underline">
                                    {dummyData.organizer.email}
                                </a>
                            </div>
                            <div className="flex items-center text-secondary">
                                <Phone size={14} className="mr-2" />
                                <a href={`tel:${dummyData.organizer.phone}`} className="text-accent hover:underline">
                                    {dummyData.organizer.phone}
                                </a>
                            </div>
                            <div className="flex items-center text-secondary">
                                <Globe size={14} className="mr-2" />
                                <a href={dummyData.organizer.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
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
