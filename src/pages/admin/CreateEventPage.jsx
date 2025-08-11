import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createEvent, getMyClubs, getAllClubs } from '../../services/api';
import { Loader2, ArrowLeft, Calendar, MapPin } from 'lucide-react';

const CreateEventPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [clubId, setClubId] = useState('');
    
    const [managedClubs, setManagedClubs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { user } = useAuth();

    const canCreate = user?.role === 'super_admin' || user?.role === 'club_admin';

    useEffect(() => {
        // Redirect if user is not authorized
        if (user && !canCreate) {
            navigate('/dashboard');
            return;
        }

        // Fetch the clubs this user can create events for
        const fetchAdminClubs = async () => {
            try {
                let response;
                if (user.role === 'super_admin') {
                    // Super admin can create events for any club
                    response = await getAllClubs();
                } else {
                    // Club admin can only create events for their clubs
                    response = await getMyClubs();
                }
                setManagedClubs(response.data);
                // Pre-select the first club if available
                if (response.data.length > 0) {
                    setClubId(response.data[0].id);
                }
            } catch (err) {
                setError('Could not fetch your clubs. Please try again.');
            }
        };

        if (canCreate) {
            fetchAdminClubs();
        }
    }, [user, navigate, canCreate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!clubId) {
            setError('You must select a club to host the event.');
            return;
        }
        setError('');
        setLoading(true);

        const eventData = { name, description, date, location };

        try {
            await createEvent(clubId, eventData);
            alert('Event created successfully!');
            navigate('/events'); // Redirect to the events list
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create event.');
        } finally {
            setLoading(false);
        }
    };
    
    if (!canCreate) {
        return null; // Render nothing if the user is not an admin
    }

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="max-w-2xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary hover:text-primary mb-6">
                    <ArrowLeft size={18} />
                    Back to Events
                </button>

                <div className="bg-card border border-border rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Host a New Event</h1>
                    <p className="text-secondary mb-6">Fill in the details below to create a new event.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="club" className="block text-sm font-medium text-secondary">Hosting Club</label>
                            <select
                                id="club"
                                value={clubId}
                                onChange={(e) => setClubId(e.target.value)}
                                className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent"
                                required
                            >
                                <option value="" disabled>Select a club...</option>
                                {managedClubs.map(club => (
                                    <option key={club.id} value={club.id}>{club.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-secondary">Event Name</label>
                            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" required />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-secondary">Event Description</label>
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" required />
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <label htmlFor="date" className="flex items-center text-sm font-medium text-secondary"><Calendar size={14} className="mr-2"/>Date and Time</label>
                                <input id="date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" required />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="location" className="flex items-center text-sm font-medium text-secondary"><MapPin size={14} className="mr-2"/>Location</label>
                                <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" required />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-md text-white bg-accent hover:bg-accent-hover font-semibold disabled:bg-gray-500 transition-colors">
                            {loading ? <Loader2 className="animate-spin" /> : 'Create Event'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEventPage;
