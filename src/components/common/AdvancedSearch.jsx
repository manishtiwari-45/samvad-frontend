import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, MapPin, Users, Tag, SlidersHorizontal } from 'lucide-react';

const AdvancedSearch = ({ 
  onSearch, 
  onFilter, 
  placeholder = "Search...", 
  filters = {},
  showFilters = true,
  type = "general" // "clubs", "events", "general"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    location: '',
    date: '',
    size: '',
    status: ''
  });

  // Filter options based on type
  const getFilterOptions = () => {
    const baseOptions = {
      clubs: {
        categories: ['Technology', 'Arts', 'Sports', 'Academic', 'Cultural', 'Social Service'],
        sizes: ['Small (1-20)', 'Medium (21-50)', 'Large (51-100)', 'Very Large (100+)'],
        status: ['Active', 'Recruiting', 'Full']
      },
      events: {
        categories: ['Workshop', 'Seminar', 'Competition', 'Social', 'Academic', 'Cultural'],
        locations: ['Main Hall', 'Auditorium', 'Library', 'Sports Complex', 'Online'],
        status: ['Upcoming', 'Registration Open', 'Registration Closed']
      },
      general: {
        categories: ['All', 'Clubs', 'Events', 'Announcements'],
        status: ['Active', 'Recent', 'Popular']
      }
    };
    return baseOptions[type] || baseOptions.general;
  };

  const filterOptions = getFilterOptions();

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      onSearch?.(searchTerm);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, onSearch]);

  useEffect(() => {
    onFilter?.(activeFilters);
  }, [activeFilters, onFilter]);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      category: '',
      location: '',
      date: '',
      size: '',
      status: ''
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value !== '').length;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          placeholder={placeholder}
        />
        {showFilters && (
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${
              isFilterOpen || getActiveFilterCount() > 0 
                ? 'text-blue-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="relative">
              <SlidersHorizontal className="h-5 w-5" />
              {getActiveFilterCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {getActiveFilterCount()}
                </span>
              )}
            </div>
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600 font-medium">Active filters:</span>
          {Object.entries(activeFilters).map(([key, value]) => 
            value && (
              <span
                key={key}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
              >
                {value}
                <button
                  onClick={() => handleFilterChange(key, value)}
                  className="ml-2 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )
          )}
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && isFilterOpen && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category Filter */}
            {filterOptions.categories && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline h-4 w-4 mr-1" />
                  Category
                </label>
                <select
                  value={activeFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {filterOptions.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Location Filter (for events) */}
            {filterOptions.locations && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <select
                  value={activeFilters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Locations</option>
                  {filterOptions.locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Size Filter (for clubs) */}
            {filterOptions.sizes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Size
                </label>
                <select
                  value={activeFilters.size}
                  onChange={(e) => handleFilterChange('size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Size</option>
                  {filterOptions.sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Status Filter */}
            {filterOptions.status && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={activeFilters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  {filterOptions.status.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Filter (for events) */}
            {type === 'events' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date Range
                </label>
                <select
                  value={activeFilters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            )}
          </div>

          {/* Quick Filter Buttons */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Filters:</p>
            <div className="flex flex-wrap gap-2">
              {type === 'clubs' && (
                <>
                  <button
                    onClick={() => handleFilterChange('status', 'Recruiting')}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      activeFilters.status === 'Recruiting'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    Recruiting Now
                  </button>
                  <button
                    onClick={() => handleFilterChange('category', 'Technology')}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      activeFilters.category === 'Technology'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    Tech Clubs
                  </button>
                </>
              )}
              {type === 'events' && (
                <>
                  <button
                    onClick={() => handleFilterChange('date', 'week')}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      activeFilters.date === 'week'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => handleFilterChange('status', 'Registration Open')}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      activeFilters.status === 'Registration Open'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    Open Registration
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
