import React from 'react';
import { Link } from 'react-router-dom';

const ClubCard = ({ club }) => {
    return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
        <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{club.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{club.description}</p>
        <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Admin: {club.admin.full_name}</span>
            <Link
            to={`/clubs/${club.id}`}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
            View Details &rarr;
            </Link>
        </div>
        </div>
    </div>
    );
};

export default ClubCard;