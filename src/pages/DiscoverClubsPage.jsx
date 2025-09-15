import React, { useState, useEffect } from 'react';
import { getAllClubs } from '../services/api';
import ClubCard from '../components/ClubCard';
import { Search, Filter, Loader2, Frown } from 'lucide-react';

// Dummy data jo tab dikhega jab database khaali ho
const dummyClubs = [
    { id: 'd1', name: 'Tech Club', description: 'Exploring the latest in technology, programming, and innovation.', cover_image_url: 'https://picsum.photos/seed/tech/400/200' },
    { id: 'd2', name: 'Music Society', description: 'Harmony, rhythm, and melody - join us for musical excellence.', cover_image_url: 'https://picsum.photos/seed/music/400/200' },
    { id: 'd3', name: 'Photography Club', description: 'Capture life through the lens and develop your artistic vision.', cover_image_url: 'https://picsum.photos/seed/photo/400/200' },
    { id: 'd4', name: 'Debate Club', description: 'Engage in intellectual discourse and sharpen your public speaking skills.', cover_image_url: 'https://picsum.photos/seed/debate/400/200' },
    { id: 'd5', name: 'Art Club', description: 'Unleash your creativity with paints, pencils, and clay.', cover_image_url: 'https://picsum.photos/seed/art/400/200' },
    { id: 'd6', name: 'Sports Committee', description: 'Promoting a healthy and active lifestyle through various sports.', cover_image_url: 'https://picsum.photos/seed/sports/400/200' },
];

const DiscoverClubsPage = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clubsRes = await getAllClubs();
                if (clubsRes.data && clubsRes.data.length > 0) {
                    setClubs(clubsRes.data);
                } else {
                    // Agar DB khaali hai, to dummy data use karein
                    setClubs(dummyClubs); 
                }
            } catch (error) {
                console.error("Failed to fetch clubs, showing dummy data", error);
                setError("Could not load clubs. Please try again later.");
                setClubs(dummyClubs); // Agar API call fail ho, to bhi dummy data dikhayein
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredClubs = clubs.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center py-10">
                    <Loader2 className="mx-auto animate-spin text-accent" size={32} />
                    <p className="mt-2 text-secondary">Loading Clubs...</p>
                </div>
            );
        }

        if (error && filteredClubs.length === 0) {
            return (
                <div className="text-center py-10 text-red-500">
                    <Frown className="mx-auto mb-2" size={32} />
                    <p>{error}</p>
                </div>
            );
        }

        if (filteredClubs.length === 0) {
            return (
                <div className="text-center py-10">
                    <Frown className="mx-auto mb-2 text-secondary" size={32} />
                    <p className="text-secondary">No clubs found matching your search.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map((club) => (
                    <ClubCard key={club.id} club={club} />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Hero Section */}
            <div className="rounded-lg bg-card border border-border p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
                        Your <span className="text-accent">Campus</span>, Your <span className="text-accent">Club Community</span>
                    </h1>
                    <p className="text-secondary mt-4 max-w-2xl mx-auto">
                        Discover, join, and thrive in Sitare University's vibrant club ecosystem.
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={20} />
                    <input
                        type="text"
                        placeholder="Search clubs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-accent text-primary"
                    />
                </div>
                <button className="flex items-center justify-center bg-card border border-border px-4 py-3 rounded-lg font-semibold text-primary hover:border-accent/50">
                    <Filter size={16} className="mr-2 text-secondary" /> All Categories
                </button>
            </div>

            {/* Clubs Grid */}
            <div>
                <h2 className="text-xl font-bold text-primary mb-4">{filteredClubs.length} clubs found</h2>
                {renderContent()}
            </div>
        </div>
    );
};

export default DiscoverClubsPage;
