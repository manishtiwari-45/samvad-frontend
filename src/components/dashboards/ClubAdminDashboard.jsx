import React, { useState, useEffect, useCallback } from 'react';
import { clubApi, authApi, photoApi, announcementApi } from '../../services/api';
import { Link } from 'react-router-dom';
import { PlusCircleIcon, Users, Calendar, Camera, Loader2, ArrowRight, TentTree, Video, Edit, ChevronDown, Megaphone, UploadCloud } from 'lucide-react';
import Modal from '../Modal';

// --- Helper Components ---

const PhotoUploadForm = ({ eventId, onUploadSuccess }) => {
    // This component remains the same
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const handleFileChange = (e) => { if (e.target.files.length > 0) setFile(e.target.files[0]) };
    const handleUpload = async () => {
        if (!file) { alert("Please select a file first."); return; }
        setIsUploading(true);
        try {
            await photoApi.uploadForEvent(eventId, file);
            alert("Photo uploaded successfully!");
            setFile(null);
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            alert("Failed to upload photo. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };
    return (
        <div className="mt-4 p-4 bg-background rounded-lg border border-border">
            <h4 className="text-sm font-semibold text-primary mb-2">Upload Photo for this Event</h4>
            <div className="flex items-center space-x-2">
                <input type="file" onChange={handleFileChange} className="text-sm text-secondary flex-grow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20"/>
                <button onClick={handleUpload} disabled={isUploading} className="bg-accent text-white px-3 py-2 rounded-md text-sm hover:bg-accent-hover disabled:bg-gray-500 flex items-center">
                    {isUploading && <Loader2 size={16} className="animate-spin mr-2"/>} Upload
                </button>
            </div>
        </div>
    );
};

const EventsManager = ({ clubId }) => {
    // This component remains the same
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadFor, setShowUploadFor] = useState(null);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await clubApi.getById(clubId);
                setEvents(response.data.events);
            } catch (error) { console.error("Failed to fetch events for admin", error); } 
            finally { setLoading(false); }
        };
        fetchEvents();
    }, [clubId]);

    if (loading) return <div className="text-sm text-secondary mt-4 text-center">Loading events...</div>;
    return (
        <div className="mt-4 space-y-2">
            {events.length > 0 ? events.map(event => (
                <div key={event.id} className="p-3 bg-background rounded-lg">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold text-primary">{event.name}</p>
                        <button onClick={() => setShowUploadFor(showUploadFor === event.id ? null : event.id)} className="flex items-center text-sm text-accent hover:text-accent-hover font-semibold">
                            <Camera size={16} className="mr-1"/> Upload Photo
                        </button>
                    </div>
                    {showUploadFor === event.id && <PhotoUploadForm eventId={event.id} onUploadSuccess={() => setShowUploadFor(null)} />}
                </div>
            )) : <p className="text-sm text-secondary text-center py-4">No events found for this club.</p>}
        </div>
    );
};

const ManagedClubCard = ({ club, onManageEventsClick }) => {
    // This component remains the same
    return (
        <div className="bg-card border border-border p-6 rounded-xl shadow-lg flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-accent/50">
            <div className="flex-grow space-y-4">
                <div className="w-full h-40 mb-4 rounded-lg bg-cover bg-center" style={{backgroundImage: `url(${club.cover_image_url || 'https://picsum.photos/seed/default/400/200'})`}}></div>
                <h3 className="text-2xl font-bold text-primary">{club.name}</h3>
                <p className="text-secondary mt-1 line-clamp-2">{club.description}</p>
                <div className="flex space-x-6">
                    <div className="flex items-center text-secondary"><Users size={18} className="mr-2 text-accent" /><span className="font-semibold text-primary">{club.member_count}</span><span className="ml-1.5">Members</span></div>
                    <div className="flex items-center text-secondary"><Calendar size={18} className="mr-2 text-green-500" /><span className="font-semibold text-primary">{club.event_count}</span><span className="ml-1.5">Events</span></div>
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row gap-2">
                <Link to={`/clubs/${club.id}`} className="flex-1 text-center bg-border text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent/20 transition">View Page</Link>
                <Link to={`/clubs/${club.id}/edit`} className="flex-1 text-center bg-accent/10 text-accent px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent/20 transition">Edit Details</Link>
                <button onClick={() => onManageEventsClick(club)} className="flex-1 justify-center items-center bg-purple-500/10 text-purple-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-500/20 transition">Manage Photos</button>
            </div>
        </div>
    );
};

// --- Naya "Create Club" Form Component ---
const CreateClubForm = ({ onClubCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverPhoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleCreateClub = async (e) => {
        e.preventDefault();
        if (!coverPhoto) {
            alert('Please upload a cover photo for the club.');
            return;
        }
        setLoading(true);
        try {
            await clubApi.create({ name, description, file: coverPhoto });
            alert('Club created successfully!');
            setName(''); 
            setDescription('');
            setCoverPhoto(null);
            setPreview('');
            onClubCreated();
        } catch (error) { 
            alert('Failed to create club. A club with this name may already exist.'); 
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="bg-card border border-border p-8 rounded-xl shadow-md animate-fade-in">
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center">
                <PlusCircleIcon className="h-7 w-7 mr-3 text-accent" />
                Create a New Club
            </h2>
            <form onSubmit={handleCreateClub} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-secondary">Club Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full p-3 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary">Club Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows="4" className="mt-1 w-full p-3 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary">Cover Photo</label>
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {preview ? <img src={preview} alt="Cover preview" className="mx-auto h-24 w-auto rounded-md"/> : <UploadCloud className="mx-auto h-12 w-12 text-secondary"/>}
                            <div className="flex text-sm text-secondary justify-center">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-card rounded-md font-medium text-accent hover:text-accent-hover focus-within:outline-none">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-secondary">PNG, JPG up to 10MB</p>
                        </div>
                    </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-accent text-white px-4 py-3 rounded-md hover:bg-accent-hover font-semibold transition-transform transform hover:scale-105 disabled:bg-gray-500 flex justify-center items-center">
                    {loading && <Loader2 className="animate-spin mr-2"/>}
                    Create Club
                </button>
            </form>
        </div>
    );
};


// --- Main Component ---
const ClubAdminDashboard = ({...props}) => {
    const [managedClubs, setManagedClubs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('myClubs');
    const [selectedClub, setSelectedClub] = useState(null);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);

    const fetchManagedClubs = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await authApi.getMyClubs();
            setManagedClubs(response.data);
        } catch (error) { console.error("Failed to fetch managed clubs", error); } 
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchManagedClubs(); }, [fetchManagedClubs]);

    const openEventModal = (club) => {
        setSelectedClub(club);
        setIsEventModalOpen(true);
    };

    const getTabClass = (tabName) => `px-4 py-2 font-semibold rounded-lg transition flex items-center ${activeTab === tabName ? 'bg-accent text-white shadow' : 'text-secondary hover:bg-border'}`;

    if (isLoading) return <div>Loading Admin Panel...</div>;

    return (
        <>
            <div className="space-y-8">
                <h1 className="text-4xl font-bold text-primary">Club Admin Dashboard</h1>
                <div className="bg-card border border-border p-2 rounded-lg flex space-x-2">
                    <button onClick={() => setActiveTab('myClubs')} className={getTabClass('myClubs')}><TentTree size={16} className="mr-2"/> My Clubs</button>
                    <button onClick={() => setActiveTab('createClub')} className={getTabClass('createClub')}><PlusCircleIcon size={16} className="mr-2"/> Create Club</button>
                    <button onClick={() => setActiveTab('attendance')} className={getTabClass('attendance')}><Video size={16} className="mr-2"/> AI Attendance</button>
                </div>

                <div className="mt-6">
                    {activeTab === 'myClubs' && (
                        <div className="animate-fade-in">
                            {managedClubs.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {managedClubs.map(club => (
                                        <ManagedClubCard key={club.id} club={club} onManageEventsClick={openEventModal} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-card border border-border p-8 rounded-xl shadow-md text-center">
                                    <p className="text-secondary">You do not administer any clubs yet. Start by creating one in the 'Create Club' tab!</p>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'createClub' && <CreateClubForm onClubCreated={() => { fetchManagedClubs(); setActiveTab('myClubs'); }} />}
                    {activeTab === 'attendance' && (
                        <div className="animate-fade-in">
                            <Link to="/attendance/live" className="block bg-accent text-white p-6 rounded-xl shadow-lg hover:bg-accent-hover transition-all transform hover:scale-[1.02]">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold flex items-center"><Camera size={28} className="mr-3" />Start General Attendance</h2>
                                        <p className="mt-1 opacity-90">Start a general-purpose live attendance session.</p>
                                    </div>
                                    <ArrowRight size={32} />
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {selectedClub && (
                <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title={`Manage Photos for ${selectedClub.name}`}>
                    <EventsManager clubId={selectedClub.id} />
                </Modal>
            )}
        </>
    );
};

export default ClubAdminDashboard;