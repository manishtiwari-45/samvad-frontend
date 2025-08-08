import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClubById, updateClub } from '../services/api';
import Header from '../components/Header';

const EditClubPage = () => {
    const { clubId } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClub = async () => {
            try {
                const response = await getClubById(clubId);
                setName(response.data.name);
                setDescription(response.data.description);
                setLoading(false);
            } catch (err) {
                setError('Failed to load club data.');
                setLoading(false);
            }
        };
        fetchClub();
    }, [clubId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateClub(clubId, { name, description });
            alert('Club updated successfully!');
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to update club.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-6 py-8">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Club</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Club Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full p-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="mt-1 w-full p-2 border rounded-md" required />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="flex justify-end space-x-4 pt-4">
                            <button type="button" onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditClubPage;