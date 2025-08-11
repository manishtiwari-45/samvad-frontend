import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllEvents, getRecommendedEvents } from '../services/api';
import EventCard from '../components/EventCard';
import { Search, Filter, Sparkles, Plus, Loader2, Frown } from 'lucide-react';

const DiscoverEventsPage = () => {
    const [allEvents, setAllEvents] = useState([]);
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { user } = useAuth();
    const navigate = useNavigate();

    const canCreate = user?.role === 'super_admin' || user?.role === 'club_admin';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allEventsPromise = getAllEvents();
                const recommendedEventsPromise = getRecommendedEvents();

                const [allEventsRes, recommendedEventsRes] = await Promise.all([
                    allEventsPromise,
                    recommendedEventsPromise,
                ]);
                
                setAllEvents(allEventsRes.data);
                setRecommendedEvents(recommendedEventsRes.data);
            } catch (error) {
                console.error("Failed to fetch events", error);
                setError("Could not load events. Please try again later.");
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
                </div>
            );
        }

        if (error) {
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
        <div className="p-4 sm:p-6 md:p-8 space-y-8">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Discover Events</h1>
                    <p className="text-secondary mt-1">Join exciting events and expand your horizons.</p>
                </div>
                {canCreate && (
                    <button 
                        onClick={() => navigate('/events/create')} 
                        className="flex items-center gap-2 bg-accent text-white font-semibold px-4 py-2 rounded-md hover:bg-accent-hover transition-colors"
                    >
                        <Plus size={18} />
                        Host Event
                    </button>
                )}
            </div>

            {/* Recommended Events Section */}
            {recommendedEvents.length > 0 && (
                <div className="bg-card border border-border p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                        <Sparkles size={24} className="mr-3 text-yellow-500"/> Recommended For You
                        <span className="text-xs ml-2 bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">AI Powered</span>
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
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search all events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border bg-card rounded-lg focus:ring-2 focus:ring-accent"
                    />
                </div>
                <button className="flex items-center justify-center bg-card border border-border px-4 py-2 rounded-lg text-sm font-semibold text-secondary">
                    <Filter size={16} className="mr-2" /> All Categories
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
