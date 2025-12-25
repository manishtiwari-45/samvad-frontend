import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { clubApi, adminApi } from '../../services/api';
import { Loader2, ArrowLeft, UploadCloud, Info, Link, Mail, Calendar, User as UserIcon } from 'lucide-react';

const CreateClubPage = () => {
    // Basic Info State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    
    // New Detailed Info State
    const [category, setCategory] = useState('Technology');
    const [contactEmail, setContactEmail] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [foundedDate, setFoundedDate] = useState('');
    const [coordinatorId, setCoordinatorId] = useState('');
    const [subCoordinatorId, setSubCoordinatorId] = useState('');

    // User list for dropdowns
    const [users, setUsers] = useState([]);

    // General State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { user } = useAuth();

    // Fetch all users to populate coordinator dropdowns
    useEffect(() => {
        if (user && user.role === 'super_admin') {
            const fetchUsers = async () => {
                try {
                    const response = await adminApi.getAllUsers();
                    setUsers(response.data);
                } catch (err) {
                    console.error("Failed to fetch users:", err);
                    setError("Could not load user list for coordinators.");
                }
            };
            fetchUsers();
        } else {
            // Redirect if not a super admin
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Gather all data into one object
        const clubData = {
            name,
            description,
            file,
            category,
            contact_email: contactEmail,
            website_url: websiteUrl,
            founded_date: foundedDate,
            coordinator_id: coordinatorId || null, // Send null if empty
            sub_coordinator_id: subCoordinatorId || null,
        };

        try {
            await clubApi.create(clubData);
            alert('Club created successfully!');
            navigate('/clubs'); // Redirect to the clubs list
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create club. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    if (user?.role !== 'super_admin') {
        return null; 
    }

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary hover:text-primary mb-6">
                    <ArrowLeft size={18} />
                    Back to Manage Clubs
                </button>

                <div className="bg-card border border-border rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Create a New Club</h1>
                    <p className="text-secondary mb-8">Fill in the details below to add a new club to the platform.</p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-primary border-b border-border pb-2 flex items-center"><Info size={20} className="mr-3 text-accent"/>Basic Information</h2>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-secondary">Club Name</label>
                                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" required />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-secondary">Description</label>
                                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary">Cover Image</label>
                                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        {preview ? <img src={preview} alt="Cover preview" className="mx-auto h-32 w-auto rounded-md" /> : <UploadCloud className="mx-auto h-12 w-12 text-secondary" />}
                                        <div className="flex text-sm">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-card rounded-md font-medium text-accent hover:text-accent-hover focus-within:outline-none">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" required />
                                            </label>
                                            <p className="pl-1 text-secondary">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Info Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-primary border-b border-border pb-2 flex items-center"><UserIcon size={20} className="mr-3 text-accent"/>Additional Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-secondary">Category</label>
                                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent">
                                        <option>Technology</option>
                                        <option>Arts & Culture</option>
                                        <option>Social & Community</option>
                                        <option>Sports</option>
                                        <option>Academic</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="founded" className="flex items-center text-sm font-medium text-secondary"><Calendar size={14} className="mr-2"/>Founded Date</label>
                                    <input id="founded" type="date" value={foundedDate} onChange={(e) => setFoundedDate(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="flex items-center text-sm font-medium text-secondary"><Mail size={14} className="mr-2"/>Contact Email</label>
                                    <input id="email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" />
                                </div>
                                <div>
                                    <label htmlFor="website" className="flex items-center text-sm font-medium text-secondary"><Link size={14} className="mr-2"/>Website URL</label>
                                    <input id="website" type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" />
                                </div>
                                <div>
                                    <label htmlFor="coordinator" className="block text-sm font-medium text-secondary">Coordinator</label>
                                    <select id="coordinator" value={coordinatorId} onChange={(e) => setCoordinatorId(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent">
                                        <option value="">Select a coordinator...</option>
                                        {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="sub-coordinator" className="block text-sm font-medium text-secondary">Sub-Coordinator</label>
                                    <select id="sub-coordinator" value={subCoordinatorId} onChange={(e) => setSubCoordinatorId(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent">
                                        <option value="">Select a sub-coordinator...</option>
                                        {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-md text-white bg-accent hover:bg-accent-hover font-semibold disabled:bg-gray-500 transition-colors">
                            {loading ? <Loader2 className="animate-spin" /> : 'Create Club'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateClubPage;
