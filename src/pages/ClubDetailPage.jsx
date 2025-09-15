import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getClubById, joinClub, getAnnouncementsForClub } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Bell, Share2, Globe, Mail, Calendar, User as UserIcon, Building, Tag, Edit } from 'lucide-react';
import { format } from 'date-fns';

// Helper component for the sidebar info
const InfoItem = ({ icon, label, value, href }) => {
    const content = href ? <a href={href} className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">{value}</a> : <span>{value}</span>;
    return (
        <li className="flex justify-between items-center text-secondary">
            <span className="flex items-center gap-2">
                {icon} {label}
            </span>
            <span className="font-semibold text-primary text-right">{content || 'N/A'}</span>
        </li>
    );
};

const ClubDetailPage = () => {
    const { clubId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [club, setClub] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchClubData = useCallback(async () => {
        try {
            setLoading(true);
            const clubRes = await getClubById(clubId);
            setClub(clubRes.data);
            
            const announcementsRes = await getAnnouncementsForClub(clubId);
            setAnnouncements(announcementsRes.data);
        } catch (error) {
            console.error("Failed to fetch club data", error);
            navigate('/clubs'); // Agar club na mile to waapas bhej dein
        } finally {
            setLoading(false);
        }
    }, [clubId, navigate]);

    useEffect(() => {
        fetchClubData();
    }, [fetchClubData]);

    const handleJoinClub = async () => {
        try {
            await joinClub(clubId);
            alert('Successfully joined the club!');
            fetchClubData(); // Member status update karne ke liye data refresh karein
        } catch (error) {
            alert(error.response?.data?.detail || 'Could not join club.');
        }
    };

    if (loading) {
        return <div className="text-center p-10 text-secondary">Loading Club Details...</div>;
    }

    if (!club) {
        return <div className="text-center p-10 text-secondary">Club not found.</div>;
    }

    const isMember = club.members.some(member => member.id === user.id);
    const isAdmin = club.admin.id === user.id;
    const isSuperAdmin = user.role === 'super_admin';

    const fallbackCover = `https://placehold.co/1200x400/0D1117/E6EDF3?text=${club.name.replace(/\s+/g, '+')}`;

    return (
        <div className="font-sans animate-fade-in">
            {/* --- Banner Image --- */}
            <div className="h-48 md:h-64 bg-cover bg-center relative" style={{ backgroundImage: `url(${club.cover_image_url || fallbackCover})` }}>
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* --- Header Section --- */}
            <div className="p-4 sm:p-6 md:p-8 bg-card border-b border-border">
                <div className="max-w-7xl mx-auto md:flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold text-primary">{club.name}</h1>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-2 text-secondary">
                            <span className="flex items-center"><Users size={16} className="mr-1.5" /> {club.members.length} members</span>
                            <span className="bg-background text-primary text-xs px-2 py-1 rounded-full flex items-center"><Tag size={12} className="mr-1.5" /> {club.category || 'General'}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        {isMember && <span className="px-4 py-2 bg-green-500/10 text-green-400 font-bold rounded-lg text-sm text-center">✓ Member</span>}
                        {(isAdmin || isSuperAdmin) && (
                            <span className="px-4 py-2 bg-blue-500/10 text-blue-400 font-bold rounded-lg text-sm text-center">Management Role</span>
                        )}
                        {!isMember && !isAdmin && !isSuperAdmin && (
                            <button onClick={handleJoinClub} className="px-4 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accent-hover transition">Join Club</button>
                        )}
                        <button className="p-2 border border-border rounded-lg text-secondary hover:bg-background" title="Get Notifications"><Bell size={20}/></button>
                        <button className="p-2 border border-border rounded-lg text-secondary hover:bg-background" title="Share"><Share2 size={20}/></button>
                        {(isAdmin || isSuperAdmin) && (
                            <Link to={`/clubs/${club.id}/edit`} className="p-2 border border-border rounded-lg text-secondary bg-accent hover:bg-accent-hover hover:text-white" title="Edit Club"><Edit size={20}/></Link>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">About {club.name}</h2>
                        <p className="text-secondary leading-relaxed whitespace-pre-line">{club.description}</p>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">Upcoming Events</h2>
                        <div className="space-y-4">
                            {club.events.length > 0 ? (
                                club.events.map(event => (
                                    <div key={event.id} className="bg-card border border-border p-4 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-primary">{event.name}</p>
                                            <p className="text-sm text-secondary">{format(new Date(event.date), 'MMMM d, yyyy \'at\' h:mm a')}</p>
                                        </div>
                                        <Link to={`/events/${event.id}`} className="text-sm font-semibold text-accent hover:underline">View Details</Link>
                                    </div>
                                ))
                            ) : (
                                <p className="text-secondary">No upcoming events from this club.</p>
                            )}
                        </div>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">Announcements</h2>
                        <div className="space-y-4">
                            {announcements.length > 0 ? announcements.map(announce => (
                                <div key={announce.id} className="bg-card border border-border p-4 rounded-lg">
                                    <p className="font-bold text-primary">{announce.title}</p>
                                    <p className="text-secondary mt-1">{announce.content}</p>
                                    <p className="text-xs text-gray-500 mt-3">{format(new Date(announce.timestamp), 'PPpp')}</p>
                                </div>
                            )) : (
                                <p className="text-secondary">No announcements from this club yet.</p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border border-border rounded-lg p-4">
                        <h3 className="text-lg font-bold text-primary border-b border-border pb-2 mb-3">Club Information</h3>
                        <ul className="text-sm space-y-3">
                            <InfoItem icon={<Building size={14}/>} label="Founded" value={club.founded_date ? format(new Date(club.founded_date), 'yyyy') : '2023'} />
                            <InfoItem icon={<Tag size={14}/>} label="Category" value={club.category || 'General'} />
                            <InfoItem icon={<UserIcon size={14}/>} label="Admin" value={club.admin.full_name} />
                        </ul>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                        <h3 className="text-lg font-bold text-primary border-b border-border pb-2 mb-3">Get in Touch</h3>
                        <ul className="text-sm space-y-3">
                            <InfoItem icon={<Mail size={14}/>} label="Email" value={club.contact_email || `${club.name.toLowerCase().replace(/\s+/g, '')}@sitare.org`} href={`mailto:${club.contact_email || 'default@sitare.org'}`} />
                            <InfoItem icon={<Globe size={14}/>} label="Website" value={club.website_url || 'Not Available'} href={club.website_url} />
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubDetailPage;