import React, { useState, useEffect } from 'react';
import { eventApi } from '../services/api';
import EventCard from '../components/EventCard';
import { Search, Filter, Sparkles, Loader2, Frown, Calendar, Clock, MapPin, Users, Star, SlidersHorizontal, X, Grid3X3, List } from 'lucide-react';

// Enhanced dummy data with more details
const dummyEvents = [
    { 
        id: 'd1', 
        name: 'AI & Machine Learning Workshop', 
        description: 'A comprehensive hands-on workshop covering the fundamentals of AI, machine learning algorithms, and practical applications in real-world scenarios.', 
        date: '2025-01-25T10:00:00Z',
        category: 'Technology',
        level: 'Intermediate',
        price: 'Free',
        location: 'Tech Lab'
    },
    { 
        id: 'd2', 
        name: 'Annual Music Fest', 
        description: 'Experience the best musical talent on campus with performances from student bands, solo artists, and special guest musicians.', 
        date: '2025-01-27T18:00:00Z',
        category: 'Arts',
        level: 'All Levels',
        price: '₹200',
        location: 'Main Auditorium'
    },
    { 
        id: 'd3', 
        name: 'Photography Exhibition', 
        description: 'A stunning showcase of visual artistry captured by our talented student photographers, featuring diverse themes and techniques.', 
        date: '2025-01-30T12:00:00Z',
        category: 'Arts',
        level: 'All Levels',
        price: 'Free',
        location: 'Gallery Hall'
    },
    { 
        id: 'd4', 
        name: 'Startup Pitch Competition', 
        description: 'Present your innovative business ideas to industry experts and compete for funding and mentorship opportunities.', 
        date: '2025-02-02T14:00:00Z',
        category: 'Academic',
        level: 'Advanced',
        price: '₹100',
        location: 'Business Center'
    },
    { 
        id: 'd5', 
        name: 'Sports Day Championship', 
        description: 'Annual inter-college sports competition featuring various athletic events, team sports, and individual competitions.', 
        date: '2025-02-05T09:00:00Z',
        category: 'Sports',
        level: 'All Levels',
        price: 'Free',
        location: 'Sports Complex'
    },
    { 
        id: 'd6', 
        name: 'Cultural Dance Festival', 
        description: 'Celebrate diversity through traditional and contemporary dance performances from different cultures around the world.', 
        date: '2025-02-08T19:00:00Z',
        category: 'Arts',
        level: 'All Levels',
        price: '₹150',
        location: 'Main Auditorium'
    },
];

const categories = ['All', 'Technology', 'Arts', 'Sports', 'Academic', 'Social', 'Workshop'];
const timeFilters = ['All Time', 'This Week', 'This Month', 'Next Month'];
const priceFilters = ['All Prices', 'Free', 'Paid'];
const levelFilters = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

const DiscoverEventsPage = () => {
    const [allEvents, setAllEvents] = useState([]);
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedTime, setSelectedTime] = useState('All Time');
    const [selectedPrice, setSelectedPrice] = useState('All Prices');
    const [selectedLevel, setSelectedLevel] = useState('All Levels');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allEventsPromise = eventApi.getAll();
                const recommendedEventsPromise = eventApi.getRecommendations();

                const [allEventsRes, recommendedEventsRes] = await Promise.all([
                    allEventsPromise,
                    recommendedEventsPromise,
                ]);
                
                setAllEvents(allEventsRes.data.length > 0 ? allEventsRes.data : dummyEvents);
                setRecommendedEvents(recommendedEventsRes.data.length > 0 ? recommendedEventsRes.data : dummyEvents.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch events", error);
                setError("Could not load events. Please try again later.");
                setAllEvents(dummyEvents);
                setRecommendedEvents(dummyEvents.slice(0, 3));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredEvents = allEvents.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
        const matchesPrice = selectedPrice === 'All Prices' || 
                           (selectedPrice === 'Free' && event.price === 'Free') ||
                           (selectedPrice === 'Paid' && event.price !== 'Free');
        const matchesLevel = selectedLevel === 'All Levels' || event.level === selectedLevel;
        
        // Time filter logic
        let matchesTime = true;
        if (selectedTime !== 'All Time') {
            const eventDate = new Date(event.date);
            const now = new Date();
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            const oneMonth = 30 * 24 * 60 * 60 * 1000;
            
            switch (selectedTime) {
                case 'This Week':
                    matchesTime = eventDate - now <= oneWeek && eventDate > now;
                    break;
                case 'This Month':
                    matchesTime = eventDate - now <= oneMonth && eventDate > now;
                    break;
                case 'Next Month':
                    matchesTime = eventDate - now > oneMonth && eventDate - now <= 2 * oneMonth;
                    break;
            }
        }
        
        return matchesSearch && matchesCategory && matchesPrice && matchesLevel && matchesTime;
    });

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All');
        setSelectedTime('All Time');
        setSelectedPrice('All Prices');
        setSelectedLevel('All Levels');
    };

    const renderAllEvents = () => {
        if (loading) {
            return (
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-secondary">Discovering amazing events...</p>
                </div>
            );
        }

        if (error && filteredEvents.length === 0) {
            return (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Frown className="text-error" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Oops! Something went wrong</h3>
                    <p className="text-secondary mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="btn-primary"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        if (filteredEvents.length === 0) {
            return (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="text-secondary" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-2">No events found</h3>
                    <p className="text-secondary mb-4">Try adjusting your search or filters to find what you're looking for.</p>
                    <button onClick={clearFilters} className="btn-secondary">
                        Clear Filters
                    </button>
                </div>
            );
        }

        const gridClass = viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4';

        return (
            <div className={gridClass}>
                {filteredEvents.map((event, index) => (
                    <div key={event.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                        <EventCard event={event} viewMode={viewMode} />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Enhanced Hero Section */}
            <div className="card-elevated p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-info/10 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
                        Discover <span className="text-gradient">Amazing</span> Events
                    </h1>
                    <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto mb-6">
                        From workshops to festivals, find experiences that inspire, educate, and connect you with your community.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <div className="flex items-center bg-background-tertiary px-3 py-2 rounded-full">
                            <Calendar size={16} className="mr-2 text-accent" />
                            <span className="text-secondary">50+ Events Monthly</span>
                        </div>
                        <div className="flex items-center bg-background-tertiary px-3 py-2 rounded-full">
                            <Users size={16} className="mr-2 text-success" />
                            <span className="text-secondary">2000+ Attendees</span>
                        </div>
                        <div className="flex items-center bg-background-tertiary px-3 py-2 rounded-full">
                            <Star size={16} className="mr-2 text-warning" />
                            <span className="text-secondary">4.9 Event Rating</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Recommended Events Section */}
            {recommendedEvents.length > 0 && (
                <div className="card p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-warning/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-primary flex items-center">
                                <Sparkles size={24} className="mr-3 text-warning animate-pulse" />
                                Recommended For You
                            </h2>
                            <div className="badge-success">
                                <Sparkles size={12} className="mr-1" />
                                AI Powered
                            </div>
                        </div>
                        <p className="text-secondary mb-6">Events curated based on your interests and activity</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Search and Filters */}
            <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={20} />
                        <input
                            type="text"
                            placeholder="Search events by name or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-lg pl-12 pr-4"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`btn-secondary ${showFilters ? 'bg-accent/10 text-accent border-accent/50' : ''}`}
                    >
                        <SlidersHorizontal size={16} className="mr-2" />
                        Filters
                    </button>

                    {/* View Mode Toggle */}
                    <div className="flex bg-card border border-border rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-accent text-white' : 'text-secondary hover:text-primary'}`}
                        >
                            <Grid3X3 size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-accent text-white' : 'text-secondary hover:text-primary'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>

                {/* Expandable Filters */}
                {showFilters && (
                    <div className="card p-6 animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-primary mb-3">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="input w-full"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Time Filter */}
                            <div>
                                <label className="block text-sm font-medium text-primary mb-3">Time</label>
                                <select
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="input w-full"
                                >
                                    {timeFilters.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Filter */}
                            <div>
                                <label className="block text-sm font-medium text-primary mb-3">Price</label>
                                <select
                                    value={selectedPrice}
                                    onChange={(e) => setSelectedPrice(e.target.value)}
                                    className="input w-full"
                                >
                                    {priceFilters.map(price => (
                                        <option key={price} value={price}>{price}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Level Filter */}
                            <div>
                                <label className="block text-sm font-medium text-primary mb-3">Level</label>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                    className="input w-full"
                                >
                                    {levelFilters.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <div className="mt-6 flex justify-center">
                            <button onClick={clearFilters} className="btn-ghost">
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-primary">
                        {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                    </h2>
                    {(searchTerm || selectedCategory !== 'All' || selectedTime !== 'All Time') && (
                        <p className="text-secondary mt-1">
                            {searchTerm && `Searching for "${searchTerm}"`}
                            {searchTerm && (selectedCategory !== 'All' || selectedTime !== 'All Time') && ' • '}
                            {selectedCategory !== 'All' && `${selectedCategory} category`}
                            {selectedCategory !== 'All' && selectedTime !== 'All Time' && ' • '}
                            {selectedTime !== 'All Time' && selectedTime.toLowerCase()}
                        </p>
                    )}
                </div>
                
                {(searchTerm || selectedCategory !== 'All' || selectedTime !== 'All Time' || selectedPrice !== 'All Prices' || selectedLevel !== 'All Levels') && (
                    <button onClick={clearFilters} className="btn-ghost">
                        <X size={16} className="mr-2" />
                        Clear
                    </button>
                )}
            </div>

            {/* Events Grid/List */}
            <div>
                {renderAllEvents()}
            </div>
        </div>
    );
};

export default DiscoverEventsPage;
