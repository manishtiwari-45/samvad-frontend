import React, { useState, useEffect } from 'react';
import { getAllEvents, getRecommendedEvents } from '../services/api';
import EventCard from '../components/EventCard';
import { Search, Filter, Sparkles } from 'lucide-react';

const DiscoverEventsPage = () => {
    const [allEvents, setAllEvents] = useState([]);
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Dono API calls ek saath shuru karein
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
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredEvents = allEvents.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="text-center">Loading Events...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Discover Events</h1>
                <p className="text-gray-500 mt-1">Join exciting events and expand your horizons.</p>
            </div>

            {/* Recommended Events Section */}
            {recommendedEvents.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                        <Sparkles size={24} className="mr-3 text-yellow-500"/> Recommended Events
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
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                </div>
                <button className="flex items-center justify-center bg-white border px-4 py-2 rounded-lg text-sm font-semibold">
                    <Filter size={16} className="mr-2" /> All Categories
                </button>
            </div>

            {/* All Events Grid */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">{filteredEvents.length} events found</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DiscoverEventsPage;