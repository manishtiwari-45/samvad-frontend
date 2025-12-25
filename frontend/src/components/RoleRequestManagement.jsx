import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    UserCheck, 
    Clock, 
    CheckCircle, 
    XCircle, 
    User, 
    Calendar,
    MessageSquare,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import { roleRequestApi } from '../services/api';

const RoleRequestManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('pending'); // pending, all
    const [reviewingId, setReviewingId] = useState(null);
    const [reviewNotes, setReviewNotes] = useState('');

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const fetchRequests = async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = filter === 'pending' 
                ? await roleRequestApi.getPendingRequests()
                : await roleRequestApi.getAllRequests();
            setRequests(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch role requests');
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (requestId, status) => {
        try {
            await roleRequestApi.reviewRequest(requestId, {
                status,
                admin_notes: reviewNotes.trim() || null
            });
            
            // Refresh the list
            await fetchRequests();
            
            // Reset review state
            setReviewingId(null);
            setReviewNotes('');
        } catch (err) {
            setError(err.message || 'Failed to review request');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'approved':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-accent" />
                    <span className="text-lg text-secondary">Loading role requests...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-primary">Role Request Management</h2>
                    <p className="text-secondary">Review and manage user role upgrade requests</p>
                </div>
                <button
                    onClick={fetchRequests}
                    className="flex items-center space-x-2 px-4 py-2 bg-accent/10 text-accent rounded-xl hover:bg-accent/20 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-background-secondary rounded-2xl p-1">
                {[
                    { key: 'pending', label: 'Pending', count: requests.filter(r => r.status === 'pending').length },
                    { key: 'all', label: 'All Requests', count: requests.length }
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                            filter === tab.key
                                ? 'bg-accent text-white shadow-lg'
                                : 'text-secondary hover:text-primary hover:bg-background'
                        }`}
                    >
                        <span>{tab.label}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                            filter === tab.key
                                ? 'bg-white/20 text-white'
                                : 'bg-accent/10 text-accent'
                        }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        className="bg-error/5 border border-error/20 rounded-2xl p-4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-error mr-3" />
                            <p className="text-error font-medium">{error}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Requests List */}
            <div className="space-y-4">
                {requests.length === 0 ? (
                    <div className="text-center py-12">
                        <UserCheck className="w-16 h-16 text-secondary/50 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-primary mb-2">No Role Requests</h3>
                        <p className="text-secondary">
                            {filter === 'pending' ? 'No pending requests at the moment' : 'No role requests found'}
                        </p>
                    </div>
                ) : (
                    requests.map((request) => (
                        <motion.div
                            key={request.id}
                            className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            layout
                        >
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                                            <User className="w-5 h-5 text-accent" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-primary">{request.user_name}</h3>
                                            <p className="text-sm text-secondary">{request.user_email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                                            <div className="flex items-center space-x-1">
                                                {getStatusIcon(request.status)}
                                                <span className="capitalize">{request.status}</span>
                                            </div>
                                        </span>
                                    </div>
                                </div>

                                {/* Request Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center space-x-2 text-secondary">
                                        <UserCheck className="w-4 h-4" />
                                        <span>Requesting: <span className="font-medium text-primary">Club Admin</span></span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-secondary">
                                        <Calendar className="w-4 h-4" />
                                        <span>Requested: <span className="font-medium text-primary">{formatDate(request.created_at)}</span></span>
                                    </div>
                                </div>

                                {/* Reason */}
                                <div className="bg-background-secondary rounded-xl p-4">
                                    <div className="flex items-start space-x-2">
                                        <MessageSquare className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-primary mb-1">Reason:</p>
                                            <p className="text-sm text-secondary leading-relaxed">{request.reason}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Section */}
                                {request.status === 'pending' && (
                                    <div className="border-t border-border pt-4">
                                        {reviewingId === request.id ? (
                                            <div className="space-y-4">
                                                <textarea
                                                    value={reviewNotes}
                                                    onChange={(e) => setReviewNotes(e.target.value)}
                                                    placeholder="Add review notes (optional)"
                                                    rows={3}
                                                    className="w-full p-3 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
                                                />
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => handleReview(request.id, 'approved')}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>Approve</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleReview(request.id, 'rejected')}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        <span>Reject</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setReviewingId(null);
                                                            setReviewNotes('');
                                                        }}
                                                        className="px-4 py-2 text-secondary hover:text-primary transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setReviewingId(request.id)}
                                                className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent-hover transition-colors"
                                            >
                                                <UserCheck className="w-4 h-4" />
                                                <span>Review Request</span>
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Review History */}
                                {request.status !== 'pending' && (
                                    <div className="border-t border-border pt-4">
                                        <div className="text-sm text-secondary space-y-1">
                                            <p>
                                                <span className="font-medium">Reviewed by:</span> {request.reviewed_by_name || 'System'}
                                            </p>
                                            {request.reviewed_at && (
                                                <p>
                                                    <span className="font-medium">Reviewed on:</span> {formatDate(request.reviewed_at)}
                                                </p>
                                            )}
                                            {request.admin_notes && (
                                                <div className="mt-2 p-3 bg-background-secondary rounded-xl">
                                                    <p className="font-medium text-primary mb-1">Admin Notes:</p>
                                                    <p className="text-secondary">{request.admin_notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RoleRequestManagement;
