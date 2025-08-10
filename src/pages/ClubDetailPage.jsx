import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClubById, joinClub, getAnnouncementsForClub, getEventPhotos } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Star, Bell, Share2, MapPin, Calendar, Globe, Mail, Camera } from 'lucide-react';
import Modal from '../components/Modal'; // Modal component ko import karein

const ClubDetailPage = () => {
    const { clubId } = useParams();
    const { user } = useAuth();
    const [club, setClub] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Photo Gallery ke liye naya state
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [galleryPhotos, setGalleryPhotos] = useState([]);
    const [galleryTitle, setGalleryTitle] = useState('');

    const fetchClubData = useCallback(async () => {
        try {
            setLoading(true);
            const clubRes = await getClubById(clubId);
            let clubData = clubRes.data; // Use let instead of const

            // --- DUMMY DATA ADD KARNE KA CODE YAHAN HAI ---
            if (clubData.events.length === 0) {
                console.log("No real events found. Adding dummy events for UI testing.");
                clubData.events = [
                    { id: 998, name: "Dummy Event 1: Tech Workshop", date: "2025-09-15T14:00:00Z" },
                    { id: 999, name: "Dummy Event 2: Music Night", date: "2025-09-20T19:00:00Z" },
                ];
            }
            // ---------------------------------------------
            
            setClub(clubData); // Updated club data ko set karein
            
            const announcementsRes = await getAnnouncementsForClub(clubId);
            setAnnouncements(announcementsRes.data);
        } catch (error) {
            console.error("Failed to fetch club data", error);
        } finally {
            setLoading(false);
        }
    }, [clubId]);

    useEffect(() => {
        fetchClubData();
    }, [fetchClubData]);

    const handleJoinClub = async () => {
        try {
            await joinClub(clubId);
            alert('Successfully joined the club!');
            fetchClubData();
        } catch (error) {
            alert(error.response?.data?.detail || 'Could not join club.');
        }
    };
    
    // Gallery open karne ke liye naya function
    const handleViewGallery = async (event) => {
        try {
            setGalleryTitle(`Gallery: ${event.name}`);
            setIsGalleryOpen(true); // Modal turant kholein
            const response = await getEventPhotos(event.id);
            setGalleryPhotos(response.data);
        } catch (error) {
            alert('Could not load photos for this event.');
            setIsGalleryOpen(false); // Error aane par modal band karein
        }
    };

    if (loading) return <div className="text-center">Loading Club Details...</div>;
    if (!club) return <div className="text-center">Club not found.</div>;

    const isMember = club.members.some(member => member.id === user.id);
    const dummyData = {
        bannerUrl: `https://picsum.photos/seed/${club.id}/1200/300`,
        rating: 4.8,
        reviews: 99,
        category: 'Technology',
        founded: 2019,
        website: 'techclub.edu',
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 md:h-64 bg-cover bg-center" style={{ backgroundImage: `url(${dummyData.bannerUrl})` }}></div>
                <div className="p-6 md:p-8">
                    <div className="md:flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900">{club.name}</h1>
                            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-2 text-gray-500">
                                <span className="flex items-center"><Users size={16} className="mr-1.5" /> {club.members.length} members</span>
                                <span className="flex items-center"><Star size={16} className="mr-1.5 text-yellow-500" /> {dummyData.rating} ({dummyData.reviews} reviews)</span>
                                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{dummyData.category}</span>
                            </div>
                        </div>
                        <div className="flex space-x-2 mt-4 md:mt-0">
                            {user.role === 'student' && !isMember && (
                                <button onClick={handleJoinClub} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">Join Club</button>
                            )}
                            {isMember && ( <span className="px-4 py-2 bg-green-100 text-green-800 font-bold rounded-lg text-center">✓ Member</span> )}
                            {user.role !== 'student' && ( <span className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg text-center">Management Role</span> )}
                            <button className="p-2 border rounded-lg" title="Get Notifications"><Bell size={20}/></button>
                            <button className="p-2 border rounded-lg" title="Share"><Share2 size={20}/></button>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-4">About {club.name}</h2>
                                <p className="text-gray-700 leading-relaxed">{club.description}</p>
                            </div>

                            <div className="pt-8 border-t">
                                <h3 className="text-2xl font-bold mb-4">Events</h3>
                                <div className="space-y-4">
                                {club.events.length > 0 ? (
                                    club.events.map(event => (
                                        <div key={event.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-gray-800">{event.name}</p>
                                                <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                                            </div>
                                            <button onClick={() => handleViewGallery(event)} className="flex items-center text-sm bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-200">
                                                <Camera size={16} className="mr-2"/> View Gallery
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No upcoming events from this club.</p>
                                )}
                                </div>
                            </div>

                            <div className="pt-8 border-t">
                                <h3 className="text-2xl font-bold mb-4">Announcements</h3>
                                <div className="space-y-4">
                                    {announcements.length > 0 ? announcements.map(announce => (
                                        <div key={announce.id} className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                                            <p className="font-bold text-indigo-800">{announce.title}</p>
                                            <p className="text-gray-700 mt-1">{announce.content}</p>
                                            <p className="text-xs text-gray-500 mt-2">{new Date(announce.timestamp).toLocaleString()}</p>
                                        </div>
                                    )) : (
                                        <p className="text-gray-500">No announcements from this club yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold border-b pb-2 mb-3">Club Information</h3>
                                <ul className="text-sm space-y-2">
                                    <li className="flex justify-between"><span>Founded:</span> <span className="font-semibold">{dummyData.founded}</span></li>
                                    <li className="flex justify-between"><span>Category:</span> <span className="font-semibold">{dummyData.category}</span></li>
                                    <li className="flex justify-between"><span>Members:</span> <span className="font-semibold">{club.members.length}</span></li>
                                    <li className="flex justify-between"><span>Rating:</span> <span className="font-semibold flex items-center"><Star size={14} className="mr-1 text-yellow-500"/>{dummyData.rating}</span></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold border-b pb-2 mb-3">Get in Touch</h3>
                                <ul className="text-sm space-y-2">
                                    <li className="flex items-center"><Mail size={14} className="mr-2"/> <a href={`mailto:contact@${dummyData.website}`} className="text-indigo-600 hover:underline">contact@{dummyData.website}</a></li>
                                    <li className="flex items-center"><Globe size={14} className="mr-2"/> <a href="#" className="text-indigo-600 hover:underline">Visit Website</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} title={galleryTitle}>
                {galleryPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {galleryPhotos.map(photo => (
                            <div key={photo.id} className="overflow-hidden rounded-lg">
                                <img src={photo.image_url} alt="Event" className="w-full h-full object-cover aspect-square"/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No photos have been uploaded for this event yet.</p>
                )}
            </Modal>
        </>
    );
};

export default ClubDetailPage;