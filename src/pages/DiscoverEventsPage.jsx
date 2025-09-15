import React, { useState, useEffect } from 'react';
import { getAllEvents, getRecommendedEvents } from '../services/api';
import EventCard from '../components/EventCard';
import { Search, Filter, Sparkles, Loader2, Frown } from 'lucide-react';

// Dummy data jo tab dikhega jab database khaali ho
const dummyEvents = [
    { id: 'd1', name: 'AI & Machine Learning Workshop', description: 'A hands-on workshop on the fundamentals of AI.', date: '2025-10-20T10:00:00Z' },
    { id: 'd2', name: 'Annual Music Fest', description: 'Experience the best musical talent on campus.', date: '2025-10-22T18:00:00Z' },
    { id: 'd3', name: 'Photography Exhibition', description: 'A showcase of stunning visuals captured by our students.', date: '2025-10-25T12:00:00Z' },
];

const DiscoverEventsPage = () => {
    const [allEvents, setAllEvents] = useState([]);
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allEventsPromise = getAllEvents();
                const recommendedEventsPromise = getRecommendedEvents();

                const [allEventsRes, recommendedEventsRes] = await Promise.all([
                    allEventsPromise,
                    recommendedEventsPromise,
                ]);
                
                setAllEvents(allEventsRes.data.length > 0 ? allEventsRes.data : dummyEvents);
                setRecommendedEvents(recommendedEventsRes.data);
            } catch (error) {
                console.error("Failed to fetch events", error);
                setError("Could not load events. Please try again later.");
                setAllEvents(dummyEvents); // Fallback to dummy data on error
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredEvents = allEvents.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderAllEvents = () => {
        if (loading) {
            return (
                <div className="text-center py-10">
                    <Loader2 className="mx-auto animate-spin text-accent" size={32} />
                    <p className="mt-2 text-secondary">Loading Events...</p>
                </div>
            );
        }
        if (error && filteredEvents.length === 0) {
            return (
                <div className="text-center py-10 text-red-500">
                    <Frown className="mx-auto mb-2" size={32} />
                    <p>{error}</p>
                </div>
            );
        }
        if (filteredEvents.length === 0) {
            return (
                <div className="text-center py-10">
                    <Frown className="mx-auto mb-2 text-secondary" size={32} />
                    <p className="text-secondary">No events found.</p>
                </div>
            );
        }
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Hero Section */}
            <div className="rounded-lg bg-card border border-border p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
                    Discover <span className="text-accent">Unforgettable</span> Events
                    </h1>
                    <p className="text-secondary mt-4 max-w-2xl mx-auto">
                        From workshops to festivals, find your next great experience at Sitare University.
                    </p>
                </div>
            </div>

            {/* Recommended Events Section */}
            {recommendedEvents.length > 0 && (
                <div className="bg-card border border-border p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                        <Sparkles size={24} className="mr-3 text-yellow-400"/> Recommended For You
                        <span className="text-xs ml-2 bg-green-500/10 text-green-400 font-semibold px-2 py-0.5 rounded-full">AI Powered</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            )}

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={20} />
                    <input
                        type="text"
                        placeholder="Search all events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-accent text-primary"
                    />
                </div>
                <button className="flex items-center justify-center bg-card border border-border px-4 py-3 rounded-lg font-semibold text-primary hover:border-accent/50">
                    <Filter size={16} className="mr-2 text-secondary" /> All Categories
                </button>
            </div>

            {/* All Events Grid */}
            <div>
                <h2 className="text-xl font-bold text-primary mb-4">All Upcoming Events</h2>
                {renderAllEvents()}
            </div>
        </div>
    );
};

export default DiscoverEventsPage;
