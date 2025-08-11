import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGalleryPhotos, uploadToGallery, deleteGalleryPhoto } from '../services/api';
import { Plus, Camera, Loader2, X, Trash2 } from 'lucide-react';

// A simple, self-contained Modal component for the upload form
const UploadModal = ({ isOpen, onClose, onUpload, loading }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [caption, setCaption] = useState('');

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) return;
        onUpload(file, caption);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-3 right-3 text-secondary hover:text-primary">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold text-primary mb-4">Upload a New Photo</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">Photo</label>
                            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-hover" required />
                        </div>
                        {preview && <img src={preview} alt="Preview" className="w-full h-auto rounded-md object-cover max-h-60" />}
                        <div>
                            <label className="block text-sm font-medium text-secondary">Caption (Optional)</label>
                            <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} className="mt-1 w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full mt-6 flex justify-center py-3 px-4 rounded-md text-white bg-accent hover:bg-accent-hover font-semibold disabled:bg-gray-500 transition-colors">
                        {loading ? <Loader2 className="animate-spin" /> : 'Upload'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const GalleryPage = () => {
    const { user } = useAuth();
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const canManage = user?.role === 'super_admin' || user?.role === 'club_admin';

    const fetchPhotos = async () => {
        try {
            setError('');
            setLoading(true);
            const response = await getGalleryPhotos();
            setPhotos(response.data);
        } catch (err) {
            setError('Failed to fetch photos. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleUpload = async (file, caption) => {
        try {
            setLoading(true);
            const response = await uploadToGallery(file, caption);
            setPhotos([response.data, ...photos]); // Add new photo to the top of the list
            setIsModalOpen(false);
        } catch (err) {
            alert('Upload failed: ' + (err.response?.data?.detail || 'Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (photoId) => {
        if (!window.confirm('Are you sure you want to delete this photo?')) return;
        
        try {
            await deleteGalleryPhoto(photoId);
            setPhotos(photos.filter(p => p.id !== photoId)); // Remove photo from state
        } catch (err) {
            alert('Delete failed: ' + (err.response?.data?.detail || 'Please try again.'));
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Photo Gallery</h1>
                    <p className="text-secondary mt-1">A collection of moments from our community.</p>
                </div>
                {canManage && (
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-accent text-white font-semibold px-4 py-2 rounded-md hover:bg-accent-hover transition-colors">
                        <Plus size={18} />
                        Upload Photo
                    </button>
                )}
            </div>

            {loading && photos.length === 0 ? (
                <div className="text-center py-10"><Loader2 className="mx-auto animate-spin text-accent" size={32}/></div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
            ) : photos.length === 0 ? (
                <div className="text-center py-20 bg-card border border-border rounded-lg">
                    <Camera size={48} className="mx-auto text-secondary mb-4" />
                    <h2 className="text-xl font-semibold text-primary">No Photos Yet!</h2>
                    <p className="text-secondary mt-2">Be the first to upload a photo to the gallery.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map(photo => (
                        <div key={photo.id} className="group relative overflow-hidden rounded-lg border border-border aspect-square">
                            <img src={photo.image_url} alt={photo.caption || 'Gallery photo'} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 flex flex-col justify-end">
                                {photo.caption && <p className="text-white text-sm font-semibold truncate">{photo.caption}</p>}
                                <p className="text-xs text-gray-300">by {photo.uploader.full_name}</p>
                            </div>
                            {(user?.role === 'super_admin' || user?.id === photo.uploader.id) && (
                                <button onClick={() => handleDelete(photo.id)} className="absolute top-2 right-2 bg-red-600/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUpload={handleUpload} loading={loading} />
        </div>
    );
};

export default GalleryPage;