import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getClubById, joinClub } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import EventCard from '../components/EventCard';

const ClubDetailPage = () => {
    const { clubId } = useParams();
    const { user } = useAuth();
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchClub = useCallback(async () => {
    try {
        setLoading(true);
        const res = await getClubById(clubId);
        setClub(res.data);
    } catch (error) {
        console.error("Failed to fetch club details", error);
    } finally {
        setLoading(false);
    }
    }, [clubId]);

    useEffect(() => {
    fetchClub();
    }, [fetchClub]);

    const handleJoinClub = async () => {
    try {
        await joinClub(clubId);
        alert('Successfully joined the club!');
      fetchClub(); // Refresh club data to show new member status
    } catch (error) {
        alert(error.response?.data?.detail || 'Could not join club.');
    }
    };

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading Club Details...</div>;
    if (!club) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Club not found.</div>;

    const isMember = club.members.some(member => member.id === user.id);

return (
    <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-6 py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900">{club.name}</h1>
                <p className="mt-2 text-lg text-gray-600">{club.description}</p>
        </div>
            {!isMember && (
                <button
                onClick={handleJoinClub}
                className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                >
                Join Club
                </button>
            )}
                {isMember && (
                <span className="bg-green-100 text-green-800 font-bold py-2 px-4 rounded-lg">
                You are a member!
                </span>
            )}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Events */}
            <div className="md:col-span-2">
                <h3 className="text-2xl font-bold mb-4">Events</h3>
                <div className="space-y-4">
                    {club.events.length > 0 ? (
                    club.events.map(event => <EventCard key={event.id} event={event} />)
                ) : (
                    <p>No upcoming events.</p>
                )}
                </div>
            </div>

            {/* Members */}
            <div>
                <h3 className="text-2xl font-bold mb-4">Members ({club.members.length})</h3>
                <ul className="space-y-2">
                {club.members.map(member => (
                    <li key={member.id} className="bg-gray-100 p-2 rounded">
                    {member.full_name}
                    </li>
                ))}
                </ul>
            </div>
            </div>
        </div>
        </main>
    </div>
    );
};

export default ClubDetailPage;