import React, { useState, useEffect } from 'react';
import { clubApi } from '../services/api';
import ClubCard from '../components/ClubCard';
import { Search, Filter, Loader2, Frown, Grid3X3, List, SlidersHorizontal, X, TrendingUp, Users, Star } from 'lucide-react';

// Enhanced dummy data with categories
const dummyClubs = [
    { id: 'd1', name: 'Tech Club', description: 'Exploring the latest in technology, programming, and innovation. Join us for workshops, hackathons, and tech talks.', category: 'Technology', members: 156 },
    { id: 'd2', name: 'Music Society', description: 'Harmony, rhythm, and melody - join us for musical excellence and creative expression.', category: 'Arts', members: 89 },
    { id: 'd3', name: 'Photography Club', description: 'Capture life through the lens and develop your artistic vision with fellow photography enthusiasts.', category: 'Arts', members: 124 },
    { id: 'd4', name: 'Debate Club', description: 'Engage in intellectual discourse and sharpen your public speaking skills through competitive debates.', category: 'Academic', members: 67 },
    { id: 'd5', name: 'Art Club', description: 'Unleash your creativity with paints, pencils, and clay in our supportive artistic community.', category: 'Arts', members: 98 },
    { id: 'd6', name: 'Sports Committee', description: 'Promoting a healthy and active lifestyle through various sports and fitness activities.', category: 'Sports', members: 203 },
    { id: 'd7', name: 'Drama Society', description: 'Express yourself through theater, acting, and dramatic performances on stage.', category: 'Arts', members: 76 },
    { id: 'd8', name: 'Robotics Club', description: 'Build, program, and compete with robots while learning cutting-edge engineering skills.', category: 'Technology', members: 134 },
    { id: 'd9', name: 'Environmental Club', description: 'Work together to create a sustainable future and protect our planet through action.', category: 'Social', members: 112 },
];

const categories = ['All', 'Technology', 'Arts', 'Sports', 'Academic', 'Social'];
const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'members', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
];

const DiscoverClubsPage = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clubsRes = await clubApi.getAll();
                if (clubsRes.data && clubsRes.data.length > 0) {
                    setClubs(clubsRes.data);
                } else {
                    setClubs(dummyClubs); 
                }
            } catch (error) {
                console.error("Failed to fetch clubs, showing dummy data", error);
                setError("Could not load clubs. Please try again later.");
                setClubs(dummyClubs);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredAndSortedClubs = clubs
        .filter(club => {
            const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                club.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'members':
                    return (b.members || 0) - (a.members || 0);
                case 'newest':
                    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All');
        setSortBy('name');
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-secondary">Discovering amazing clubs...</p>
                </div>
            );
        }

        if (error && filteredAndSortedClubs.length === 0) {
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

        if (filteredAndSortedClubs.length === 0) {
            return (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-secondary" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-2">No clubs found</h3>
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
                {filteredAndSortedClubs.map((club, index) => (
                    <div key={club.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                        <ClubCard club={club} viewMode={viewMode} />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Enhanced Hero Section */}
            <div className="card-elevated p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-success/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
                        Discover Your <span className="text-gradient">Community</span>
                    </h1>
                    <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto mb-6">
                        Join vibrant clubs, meet like-minded people, and unlock your potential at Sitare University.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <div className="flex items-center bg-background-tertiary px-3 py-2 rounded-full">
                            <Users size={16} className="mr-2 text-accent" />
                            <span className="text-secondary">1000+ Active Members</span>
                        </div>
                        <div className="flex items-center bg-background-tertiary px-3 py-2 rounded-full">
                            <TrendingUp size={16} className="mr-2 text-success" />
                            <span className="text-secondary">50+ Active Clubs</span>
                        </div>
                        <div className="flex items-center bg-background-tertiary px-3 py-2 rounded-full">
                            <Star size={16} className="mr-2 text-warning" />
                            <span className="text-secondary">4.8 Average Rating</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Search and Filters */}
            <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={20} />
                        <input
                            type="text"
                            placeholder="Search clubs by name or description..."
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-primary mb-3">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(category => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`badge transition-all ${
                                                selectedCategory === category 
                                                    ? 'bg-accent text-white' 
                                                    : 'bg-card-hover text-secondary hover:bg-accent/10 hover:text-accent border border-border'
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort Options */}
                            <div>
                                <label className="block text-sm font-medium text-primary mb-3">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="input w-full"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Clear Filters */}
                            <div className="flex items-end">
                                <button
                                    onClick={clearFilters}
                                    className="btn-ghost w-full"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-primary">
                        {filteredAndSortedClubs.length} club{filteredAndSortedClubs.length !== 1 ? 's' : ''} found
                    </h2>
                    {(searchTerm || selectedCategory !== 'All') && (
                        <p className="text-secondary mt-1">
                            {searchTerm && `Searching for "${searchTerm}"`}
                            {searchTerm && selectedCategory !== 'All' && ' in '}
                            {selectedCategory !== 'All' && `${selectedCategory} category`}
                        </p>
                    )}
                </div>
                
                {(searchTerm || selectedCategory !== 'All') && (
                    <button onClick={clearFilters} className="btn-ghost">
                        <X size={16} className="mr-2" />
                        Clear
                    </button>
                )}
            </div>

            {/* Clubs Grid/List */}
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default DiscoverClubsPage;
