import React, { useState, useEffect } from 'react';
import { getAllClubs } from '../services/api';
import ClubCard from '../components/ClubCard';
import { Search, Filter } from 'lucide-react';

const dummyClubs = [
    { id: 'd1', name: 'Dummy Tech Club', description: 'Explore the latest in technology, programming, and innovation.' },
    { id: 'd2', name: 'Dummy Music Society', description: 'Harmony, rhythm, and melody - join us for musical excellence.' },
    { id: 'd3', name: 'Dummy Photography Club', description: 'Capture life through the lens and develop your artistic vision.' },
];

const DiscoverClubsPage = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clubsRes = await getAllClubs();
                if (clubsRes.data.length === 0) {
                    setClubs(dummyClubs); // Agar DB khaali hai, to dummy data use karein
                } else {
                    setClubs(clubsRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch clubs, showing dummy data", error);
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

    if (loading) return <div className="text-center">Loading Clubs...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Discover Clubs</h1>
                <p className="text-gray-500 mt-1">Find your community and pursue your passions.</p>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Search clubs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                </div>
                <button className="flex items-center justify-center bg-white border px-4 py-2 rounded-lg text-sm font-semibold">
                    <Filter size={16} className="mr-2" /> All Categories
                </button>
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">{filteredClubs.length} clubs found</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClubs.map((club) => (
                        <ClubCard key={club.id} club={club} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DiscoverClubsPage;