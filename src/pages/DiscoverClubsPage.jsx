import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // NEW: Import useNavigate
import { useAuth } from '../context/AuthContext'; // NEW: Import useAuth
import { getAllClubs } from '../services/api';
import ClubCard from '../components/ClubCard';
import { Search, Filter, Loader2, Frown, Plus } from 'lucide-react'; // NEW: Import Plus icon

const DiscoverClubsPage = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // NEW: Get user and navigation hook
    const { user } = useAuth();
    const navigate = useNavigate();

    // Check if the current user is a super admin
    const isSuperAdmin = user?.role === 'super_admin';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clubsRes = await getAllClubs();
                setClubs(clubsRes.data);
            } catch (error) {
                console.error("Failed to fetch clubs:", error);
                setError("Could not load clubs. Please try again later.");
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

        if (error) {
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
                    <p className="text-secondary">No clubs found.</p>
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
        <div className="p-4 sm:p-6 md:p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    {/* CHANGED: Conditional title based on user role */}
                    <h1 className="text-3xl font-bold text-primary">
                        {isSuperAdmin ? 'Manage Clubs' : 'Discover Clubs'}
                    </h1>
                    <p className="text-secondary mt-1">
                        {isSuperAdmin ? 'Create, view, and manage all clubs on the platform.' : 'Find your community and pursue your passions.'}
                    </p>
                </div>
                {/* NEW: Conditional "Create Club" button for Super Admin */}
                {isSuperAdmin && (
                    <button 
                        onClick={() => navigate('/admin/clubs/create')} 
                        className="flex items-center gap-2 bg-accent text-white font-semibold px-4 py-2 rounded-md hover:bg-accent-hover transition-colors"
                    >
                        <Plus size={18} />
                        Create New Club
                    </button>
                )}
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search clubs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border bg-card rounded-lg focus:ring-2 focus:ring-accent"
                    />
                </div>
                <button className="flex items-center justify-center bg-card border border-border px-4 py-2 rounded-lg text-sm font-semibold text-secondary">
                    <Filter size={16} className="mr-2" /> All Categories
                </button>
            </div>
            <div>
                <h2 className="text-xl font-bold text-primary mb-4">{filteredClubs.length} clubs found</h2>
                {renderContent()}
            </div>
        </div>
    );
};

export default DiscoverClubsPage;
