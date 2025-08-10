import React, { useState, useEffect, useCallback } from 'react';
import { getAllClubs, deleteClub } from '../services/api';
import { Link } from 'react-router-dom';
import { Trash, Edit } from 'lucide-react';

const ClubOversightPage = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchClubs = useCallback(async () => {
        try {
            const response = await getAllClubs();
            setClubs(response.data);
        } catch (err) {
            console.error("Failed to fetch clubs", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClubs();
    }, [fetchClubs]);
    
    const handleDeleteClub = async (clubId) => {
        if (window.confirm('Are you sure you want to delete this club? This is irreversible.')) {
            try {
                await deleteClub(clubId);
                alert('Club deleted successfully.');
                fetchClubs();
            } catch (error) {
                alert('Failed to delete club.');
            }
        }
    };

    if (loading) return <div>Loading clubs...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Club Oversight</h1>
                <p className="text-gray-500 mt-1">View, edit, and manage all clubs on the platform.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Club Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Admin</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clubs.map((club) => (
                            <tr key={club.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 font-semibold">{club.name}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-600">{club.admin.full_name}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex space-x-4">
                                    <Link to={`/clubs/${club.id}/edit`} className="text-blue-600 hover:text-blue-900" title="Edit Club">
                                        <Edit size={18}/>
                                    </Link>
                                    <button onClick={() => handleDeleteClub(club.id)} className="text-red-600 hover:text-red-900" title="Delete Club">
                                        <Trash size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClubOversightPage;