import React, { useState, useEffect } from 'react';
import { getAllPhotos } from '../services/api';
import { Camera } from 'lucide-react';

const GalleryPage = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await getAllPhotos();
                setPhotos(response.data);
            } catch (error) {
                console.error("Failed to fetch photos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPhotos();
    }, []);

    if (loading) {
        return <div className="text-center">Loading Gallery...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Camera size={32} className="mr-3 text-indigo-600"/>
                    Photo Gallery
                </h1>
                <p className="text-gray-500 mt-1">A collection of moments from all our club events.</p>
            </div>

            {photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map(photo => (
                        <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg shadow-md">
                            <img 
                                src={photo.image_url} 
                                alt={`Photo from ${photo.event.name}`} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-3 text-white">
                                <p className="font-bold text-sm line-clamp-1">{photo.event.name}</p>
                                <p className="text-xs opacity-80">{new Date(photo.timestamp).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold">No Photos Yet!</h3>
                    <p className="text-gray-500 mt-2">Club admins can upload photos after an event concludes.</p>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;