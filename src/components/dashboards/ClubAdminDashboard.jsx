import React, { useState, useEffect, useCallback } from 'react';
import { createClub, getMyClubs, createAnnouncement, uploadEventPhoto, getClubById } from '../../services/api';
import { Link } from 'react-router-dom';
import { PlusCircleIcon, Users, Calendar, Megaphone, Edit, ChevronDown, Camera, Loader2, ArrowRight } from 'lucide-react';

// Component: Photo Upload Form
const PhotoUploadForm = ({ eventId, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const handleFileChange = (e) => { if (e.target.files.length > 0) { setFile(e.target.files[0]); } };
    const handleUpload = async () => {
        if (!file) { alert("Please select a file first."); return; }
        setIsUploading(true);
        try {
            await uploadEventPhoto(eventId, file);
            alert("Photo uploaded successfully!");
            setFile(null);
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) { alert("Failed to upload photo. Please try again."); } 
        finally { setIsUploading(false); }
    };
    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Upload Photo for this Event</h4>
            <div className="flex items-center space-x-2">
                <input type="file" onChange={handleFileChange} className="text-sm flex-grow"/>
                <button onClick={handleUpload} disabled={isUploading} className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700 disabled:bg-gray-400 flex items-center">
                    {isUploading && <Loader2 size={16} className="animate-spin mr-2"/>}
                    Upload
                </button>
            </div>
        </div>
    );
};

// Component: Events List for Admins
const EventListForAdmin = ({ clubId }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadFor, setShowUploadFor] = useState(null);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await getClubById(clubId);
                setEvents(response.data.events);
            } catch (error) { console.error("Failed to fetch events for admin", error); } 
            finally { setLoading(false); }
        };
        fetchEvents();
    }, [clubId]);
    if (loading) return <div className="text-sm text-gray-500 mt-4">Loading events...</div>;
    return (
        <div className="mt-4 space-y-2">
            {events.length > 0 ? events.map(event => (
                <div key={event.id} className="p-3 bg-gray-100 rounded-lg">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">{event.name}</p>
                        <button onClick={() => setShowUploadFor(showUploadFor === event.id ? null : event.id)} className="flex items-center text-sm text-purple-600 hover:text-purple-800">
                            <Camera size={16} className="mr-1"/> Upload Photo
                        </button>
                    </div>
                    {showUploadFor === event.id && <PhotoUploadForm eventId={event.id} onUploadSuccess={() => setShowUploadFor(null)} />}
                </div>
            )) : <p className="text-sm text-gray-500">No events found for this club.</p>}
        </div>
    );
};

// Component: Managed Club Card
const ManagedClubCard = ({ club }) => {
    const [showEvents, setShowEvents] = useState(false);
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col">
            <div className="flex-grow space-y-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">{club.name}</h3>
                    <p className="text-gray-500 mt-1 line-clamp-2">{club.description}</p>
                </div>
                <div className="flex space-x-6">
                    <div className="flex items-center text-gray-700"><Users size={18} className="mr-2 text-blue-500" /><span className="font-semibold">{club.member_count}</span><span className="ml-1">Members</span></div>
                    <div className="flex items-center text-gray-700"><Calendar size={18} className="mr-2 text-green-500" /><span className="font-semibold">{club.event_count}</span><span className="ml-1">Events</span></div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    <Link to={`/clubs/${club.id}`} className="text-center bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">View Page</Link>
                    <Link to={`/clubs/${club.id}/edit`} className="text-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200">Edit Details</Link>
                    <button onClick={() => setShowEvents(!showEvents)} className="flex justify-center items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-200">
                        Manage Events <ChevronDown size={16} className={`ml-2 transition-transform ${showEvents ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                {showEvents && <EventListForAdmin clubId={club.id} />}
            </div>
        </div>
    );
};

// Component: Create Club Form
const CreateClubForm = ({ onClubCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const handleCreateClub = async (e) => {
        e.preventDefault();
        try {
            await createClub({ name, description });
            alert('Club created successfully!');
            setName(''); setDescription(''); onClubCreated();
        } catch (error) { alert('Failed to create club. A club with this name may already exist.'); }
    };
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><PlusCircleIcon className="h-7 w-7 mr-2 text-indigo-500" />Create a New Club</h2>
            <form onSubmit={handleCreateClub} className="space-y-4">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Club Name" className="w-full p-2 border rounded-md" required />
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Club Description" className="w-full p-2 border rounded-md" required />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full">Create Club</button>
            </form>
        </div>
    );
};

// Main Component: Club Admin Dashboard
const ClubAdminDashboard = () => {
    const [managedClubs, setManagedClubs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchManagedClubs = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getMyClubs();
            setManagedClubs(response.data);
        } catch (error) {
            console.error("Failed to fetch managed clubs", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchManagedClubs();
    }, [fetchManagedClubs]);

    if (isLoading) return <div>Loading Admin Panel...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-gray-800">Club Admin Dashboard</h1>

            {/* --- AI ATTENDANCE CARD KO UPDATE KIYA GAYA HAI --- */}
            <Link to="/attendance/live" className="block bg-indigo-600 text-white p-6 rounded-xl shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-[1.02]">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center">
                            <Camera size={28} className="mr-3" />
                            Start General Attendance
                        </h2>
                        <p className="mt-1 opacity-90">Start a general-purpose live attendance session.</p>
                    </div>
                    <ArrowRight size={32} />
                </div>
            </Link>

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-700">My Managed Clubs</h2>
                {managedClubs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {managedClubs.map(club => (
                            <ManagedClubCard key={club.id} club={club} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                        <p className="text-gray-600">You do not administer any clubs yet.</p>
                    </div>
                )}
            </div>
            
            <CreateClubForm onClubCreated={fetchManagedClubs} />
        </div>
    );
};

export default ClubAdminDashboard;