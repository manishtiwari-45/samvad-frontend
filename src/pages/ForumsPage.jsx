import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Heart, Reply, Calendar, User, Tag, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const ForumsPage = () => {
    const { user } = useAuth();
    const { showSuccess, showError } = useNotifications();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [newPost, setNewPost] = useState({
        title: '',
        content: '',
        category: 'general'
    });

    // Sample forum data
    const samplePosts = [
        {
            id: 1,
            title: 'Welcome to SAMVAD Forums!',
            content: 'This is our new discussion platform where you can connect with fellow students, ask questions, and share ideas.',
            author_name: 'Admin Team',
            author_id: 1,
            category: 'announcement',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            replies_count: 5,
            likes_count: 12
        },
        {
            id: 2,
            title: 'Looking for study partners for Data Structures',
            content: 'Hey everyone! I\'m looking for study partners for the upcoming Data Structures exam. Anyone interested in forming a study group?',
            author_name: 'Sarah Johnson',
            author_id: 2,
            category: 'question',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
            replies_count: 8,
            likes_count: 6
        },
        {
            id: 3,
            title: 'Tech Club Hackathon - Team Formation',
            content: 'The annual hackathon is coming up! Drop your skills and interests below if you\'re looking for teammates.',
            author_name: 'Tech Club Admin',
            author_id: 3,
            category: 'events',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
            replies_count: 15,
            likes_count: 23
        }
    ];

    const categories = [
        { id: 'all', name: 'All Posts', icon: MessageSquare },
        { id: 'general', name: 'General', icon: MessageSquare },
        { id: 'question', name: 'Questions', icon: MessageSquare },
        { id: 'announcement', name: 'Announcements', icon: MessageSquare },
        { id: 'events', name: 'Events', icon: Calendar },
        { id: 'discussion', name: 'Discussions', icon: MessageSquare }
    ];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setPosts(samplePosts);
            setLoading(false);
        }, 1000);
    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        
        if (!newPost.title.trim() || !newPost.content.trim()) {
            showError('Error', 'Please fill in all fields');
            return;
        }

        // Simulate API call
        const createdPost = {
            id: posts.length + 1,
            ...newPost,
            author_name: user.full_name,
            author_id: user.id,
            created_at: new Date().toISOString(),
            replies_count: 0,
            likes_count: 0
        };

        setPosts([createdPost, ...posts]);
        setNewPost({ title: '', content: '', category: 'general' });
        setShowCreatePost(false);
        showSuccess('Success', 'Post created successfully!');
    };

    const getCategoryColor = (category) => {
        const colors = {
            announcement: 'bg-blue-100 text-blue-800',
            question: 'bg-green-100 text-green-800',
            events: 'bg-purple-100 text-purple-800',
            discussion: 'bg-orange-100 text-orange-800',
            general: 'bg-gray-100 text-gray-800'
        };
        return colors[category] || colors.general;
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${Math.floor(diffInHours / 24)}d ago`;
    };

    const filteredPosts = selectedCategory === 'all' 
        ? posts 
        : posts.filter(post => post.category === selectedCategory);

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                        <p className="text-secondary">Loading forums...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background mobile-container">
            <div className="max-w-6xl mx-auto py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Community Forums</h1>
                    <p className="text-secondary">Connect, discuss, and share with the SAMVAD community</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-6">
                            <div className="mb-6">
                                <button
                                    onClick={() => setShowCreatePost(true)}
                                    className="w-full btn-primary flex items-center justify-center mobile-button"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Post
                                </button>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map(category => {
                                        const Icon = category.icon;
                                        const isActive = selectedCategory === category.id;
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center touch-target ${
                                                    isActive 
                                                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <Icon className="h-4 w-4 mr-3" />
                                                {category.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Posts List */}
                        <div className="space-y-4">
                            {filteredPosts.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                                    <p className="text-gray-500 mb-4">Be the first to start a discussion!</p>
                                    <button
                                        onClick={() => setShowCreatePost(true)}
                                        className="btn-primary mobile-button"
                                    >
                                        Create First Post
                                    </button>
                                </div>
                            ) : (
                                filteredPosts.map(post => (
                                    <div key={post.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow mobile-card">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mobile-text">{post.author_name}</h4>
                                                    <p className="text-sm text-gray-500">{getTimeAgo(post.created_at)}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                                                {post.category}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-semibold text-gray-900 mb-3 mobile-heading">{post.title}</h2>
                                        <p className="text-gray-600 mb-4 mobile-text">{post.content}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center space-x-6">
                                                <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors touch-target">
                                                    <Heart className="h-4 w-4" />
                                                    <span className="text-sm">{post.likes_count}</span>
                                                </button>
                                                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors touch-target">
                                                    <Reply className="h-4 w-4" />
                                                    <span className="text-sm">{post.replies_count} replies</span>
                                                </button>
                                            </div>
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mobile-text">
                                                View Discussion
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Create Post Modal */}
                {showCreatePost && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto mobile-scroll">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h2>
                            
                            <form onSubmit={handleCreatePost} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={newPost.category}
                                        onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="general">General</option>
                                        <option value="question">Question</option>
                                        <option value="discussion">Discussion</option>
                                        <option value="events">Events</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={newPost.title}
                                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter post title..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                                    <textarea
                                        value={newPost.content}
                                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Write your post content..."
                                        required
                                    />
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreatePost(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 mobile-button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary mobile-button"
                                    >
                                        Create Post
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumsPage;
