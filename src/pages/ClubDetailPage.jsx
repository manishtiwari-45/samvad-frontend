import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClubById, joinClub } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Star, Bell, Share2, MapPin, Calendar, Globe, Mail } from 'lucide-react';

const ClubDetailPage = () => {
    const { clubId } = useParams();
    const { user } = useAuth();
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchClubData = useCallback(async () => {
        try {
            const res = await getClubById(clubId);
            setClub(res.data);
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
        discord: 'TechClub#1234'
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Banner Image */}
            <div className="h-48 md:h-64 bg-cover bg-center" style={{ backgroundImage: `url(${dummyData.bannerUrl})` }}></div>

            <div className="p-6 md:p-8">
                {/* Header Section */}
                <div className="md:flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">{club.name}</h1>
                        <div className="flex items-center space-x-4 mt-2 text-gray-500">
                            <span className="flex items-center"><Users size={16} className="mr-1.5" /> {club.members.length} members</span>
                            <span className="flex items-center"><Star size={16} className="mr-1.5 text-yellow-500" /> {dummyData.rating} ({dummyData.reviews} reviews)</span>
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{dummyData.category}</span>
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex space-x-2 mt-4 md:mt-0">
                        {isMember ? (
                            <span className="px-4 py-2 bg-green-100 text-green-800 font-bold rounded-lg text-center">✓ Member</span>
                        ) : (
                            <button onClick={handleJoinClub} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">Join Club</button>
                        )}
                        <button className="p-2 border rounded-lg"><Bell size={20}/></button>
                        <button className="p-2 border rounded-lg"><Share2 size={20}/></button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-4">About {club.name}</h2>
                        <p className="text-gray-700 leading-relaxed">{club.description}</p>
                        
                        <div className="mt-6 flex space-x-8 text-sm text-gray-600">
                            <span className="flex items-center"><MapPin size={16} className="mr-2"/> Tech Building, Room 205</span>
                            <span className="flex items-center"><Calendar size={16} className="mr-2"/> Fridays at 3:00 PM</span>
                        </div>
                    </div>

                    {/* Right Sidebar */}
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
    );
};

export default ClubDetailPage;