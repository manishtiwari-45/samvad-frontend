import React, { useState, useEffect } from 'react';
import { createEvent, getMyClubs, createAnnouncement } from '../../services/api';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, MegaphoneIcon } from '@heroicons/react/24/outline';

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
  
    useEffect(() => {
        const fetchManagedClubs = async () => {
            try {
                const response = await getMyClubs();
                setManagedClubs(response.data);
            } catch (error) {
                console.error("Failed to fetch managed clubs", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchManagedClubs();
    }, []);
  
    if (isLoading) return <div>Loading Admin Panel...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>

            {managedClubs.length > 0 ? (
                <div className="space-y-6">
                    {managedClubs.map(club => (
                        <div key={club.id} className="bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800">{club.name}</h2>
                            <p className="text-gray-500 mt-1 mb-4">{club.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Create Event Section */}
                                <div className="p-4 border rounded-lg">
                                    <h3 className="text-lg font-semibold flex items-center"><PencilSquareIcon className="h-5 w-5 mr-2" />Create New Event</h3>
                                    {/* Event form could be a modal in a real app, but this is fine */}
                                    <p className="text-sm text-gray-500 mt-2">To create an event for this club, please use the main form for now.</p>
                                </div>
                                {/* Post Announcement Section */}
                                <div className="p-4 border rounded-lg">
                                     <h3 className="text-lg font-semibold flex items-center"><MegaphoneIcon className="h-5 w-5 mr-2" />Post an Announcement</h3>
                                    <AnnouncementForm clubId={club.id} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <p className="text-gray-600">You do not administer any clubs yet.</p>
                    <p className="mt-2 text-gray-500">Go to the <Link to="/explore" className="text-indigo-600 font-semibold hover:underline">Explore</Link> page to create one!</p>
                </div>
            )}
        </div>
    );
};

export default ClubAdminDashboard;