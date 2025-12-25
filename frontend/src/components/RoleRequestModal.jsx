import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCheck, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { roleRequestApi } from '../services/api';
import SecureErrorHandler from '../utils/errorHandler';

const RoleRequestModal = ({ isOpen, onClose, onSuccess }) => {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason.trim()) {
            setError('Please provide a reason for your request');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await roleRequestApi.requestRole({
                requested_role: 'club_admin',
                reason: reason.trim()
            });
            
            setSuccess(true);
            setTimeout(() => {
                onSuccess?.();
                handleClose();
            }, 2000);
        } catch (err) {
            setError(SecureErrorHandler.handleApiError(err, 'validation'));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setReason('');
        setError('');
        setSuccess(false);
        setLoading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                />

                {/* Modal */}
                <motion.div
                    className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl border border-border p-8"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 text-secondary hover:text-primary transition-colors rounded-xl hover:bg-background-secondary"
                    >
                        <X size={20} />
                    </button>

                    {success ? (
                        // Success State
                        <motion.div
                            className="text-center space-y-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-primary mb-2">Request Submitted!</h3>
                                <p className="text-secondary">
                                    Your admin role request has been submitted successfully. 
                                    Super Admins will review it and get back to you soon.
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        // Request Form
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="text-center space-y-3">
                                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                                    <UserCheck className="w-8 h-8 text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-primary">Request Admin Access</h3>
                                    <p className="text-secondary">
                                        Tell us why you need Club Admin privileges
                                    </p>
                                </div>
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

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="block text-base font-semibold text-primary">
                                        Why do you need Admin access?
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Explain why you need Club Admin privileges. For example: managing a specific club, organizing events, etc."
                                        rows={4}
                                        className="w-full p-4 text-base border-2 rounded-2xl bg-background shadow-sm placeholder-secondary/60 focus:outline-none focus:ring-4 focus:ring-accent/20 transition-all duration-300 text-primary font-medium border-border hover:border-accent/50 focus:border-accent resize-none"
                                        required
                                        maxLength={1000}
                                    />
                                    <div className="text-right text-sm text-secondary">
                                        {reason.length}/1000 characters
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4">
                                    <div className="text-sm text-secondary space-y-2">
                                        <p className="font-medium text-primary">What happens next?</p>
                                        <ul className="space-y-1 text-sm">
                                            <li>• Super Admins will review your request</li>
                                            <li>• You'll be notified of the decision</li>
                                            <li>• If approved, you'll get Club Admin privileges</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={loading || !reason.trim()}
                                    className={`w-full flex items-center justify-center px-8 py-4 text-lg rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 transform active:scale-95 ${
                                        loading || !reason.trim()
                                            ? 'opacity-50 cursor-not-allowed bg-accent/50 text-white'
                                            : 'bg-gradient-to-r from-accent via-accent to-accent-hover text-white hover:from-accent-hover hover:to-accent-dark focus:ring-accent/30 shadow-lg hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-1'
                                    }`}
                                    whileHover={{ scale: loading || !reason.trim() ? 1 : 1.02 }}
                                    whileTap={{ scale: loading || !reason.trim() ? 1 : 0.98 }}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-5 w-5" />
                                            <span>Submit Request</span>
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default RoleRequestModal;
