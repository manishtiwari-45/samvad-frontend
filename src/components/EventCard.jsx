import React from 'react';
import { registerForEvent } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventCard = ({ event, onRegister }) => {
    const { user } = useAuth();

    const handleRegister = async () => {
    try {
        await registerForEvent(event.id);
        alert('Successfully registered for the event!');
        if(onRegister) onRegister();
    } catch (error) {
        alert(error.response?.data?.detail || 'Could not register for the event.');
    }
    };

    return (
    <div className="bg-white p-4 rounded-lg shadow-md">
        <h4 className="font-bold text-lg">{event.name}</h4>
        <p className="text-sm text-gray-500 mb-2">
        {new Date(event.date).toLocaleString()} @ {event.location}
        </p>
        <p className="text-gray-700">{event.description}</p>
        {user && (
        <button
            onClick={handleRegister}
            className="mt-4 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
            Register
        </button>
        )}
    </div>
    );
};

export default EventCard;