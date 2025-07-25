import React, { useState, useEffect, useCallback } from 'react';
import { createClub, createAnnouncement, getMyClubs } from '../../services/api';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, MegaphoneIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

// This is a new, separate component for the Create Club form
const CreateClubForm = ({ onClubCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleCreateClub = async (e) => {
        e.preventDefault();
        try {
            await createClub({ name, description });
            alert('Club created successfully!');
            setName('');
            setDescription('');
            onClubCreated(); // This will refresh the list of managed clubs
        } catch (error) {
            alert('Failed to create club. A club with this name may already exist.');
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <PlusCircleIcon className="h-7 w-7 mr-2 text-indigo-500" />
                Create a New Club
            </h2>
            <form onSubmit={handleCreateClub} className="space-y-4">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Club Name" className="w-full p-2 border rounded-md" required />
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Club Description" className="w-full p-2 border rounded-md" required />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full">Create Club</button>
            </form>
        </div>
    );
};


const AnnouncementForm = ({ clubId }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        try {
            await createAnnouncement(clubId, { title, content });
            alert('Announcement posted successfully!');
            setTitle('');
            setContent('');
        } catch (error) {
            alert('Failed to post announcement.');
        }
    };

    return (
        <form onSubmit={handlePostAnnouncement} className="mt-4 space-y-2">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement Title" className="w-full p-2 border rounded-md" required />
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="What's the update?" className="w-full p-2 border rounded-md" required />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-full">Post Announcement</button>
        </form>
    );
};


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
            <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>

            {managedClubs.length > 0 ? (
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-700">My Managed Clubs</h2>
                    {managedClubs.map(club => (
                        <div key={club.id} className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-800">{club.name}</h3>
                            <p className="text-gray-500 mt-1 mb-4">{club.description}</p>
                            <div className="p-4 border rounded-lg">
                                 <h4 className="text-lg font-semibold flex items-center"><MegaphoneIcon className="h-5 w-5 mr-2" />Post an Announcement</h4>
                                <AnnouncementForm clubId={club.id} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <p className="text-gray-600">You do not administer any clubs yet.</p>
                </div>
            )}
            
            {/* The new Create Club form will always be visible to admins */}
            <CreateClubForm onClubCreated={fetchManagedClubs} />
        </div>
    );
};

export default ClubAdminDashboard;