import React, { useState, useEffect } from 'react';
import { getAllClubs, getAllEvents } from '../services/api';
import Header from '../components/Header';
import ClubCard from '../components/ClubCard';
import EventCard from '../components/EventCard';

const HomePage = () => {
    const [clubs, setClubs] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const clubsRes = await getAllClubs();
            const eventsRes = await getAllEvents();
            setClubs(clubsRes.data);
            setEvents(eventsRes.data);
    } catch (error) {
    console.error("Failed to fetch data", error);
    } finally {
        setLoading(false);
        }
    };
    fetchData();
    }, []);

    if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    }

    return (
    <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-6 py-8">
        {/* Clubs Section */}
        <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Explore Clubs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
                <ClubCard key={club.id} club={club} />
            ))}
            </div>
        </section>

        {/* Events Section */}
        <section className="mt-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Upcoming Events</h2>
            <div className="space-y-4">
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
            </div>
        </section>
        </main>
    </div>
    );
};

export default HomePage;