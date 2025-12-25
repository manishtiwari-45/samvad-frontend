import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

const NotificationItem = ({ notification, onClose }) => {
    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info
    };

    const colors = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    const Icon = icons[notification.type] || Info;

    return (
        <div className={`p-4 rounded-lg border shadow-sm ${colors[notification.type]} animate-slide-in`}>
            <div className="flex items-start space-x-3">
                <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{notification.title}</h4>
                    {notification.message && (
                        <p className="text-sm mt-1 opacity-90">{notification.message}</p>
                    )}
                    {notification.timestamp && (
                        <p className="text-xs mt-2 opacity-70">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => onClose(notification.id)}
                    className="flex-shrink-0 p-1 hover:bg-black/10 rounded"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (notification) => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            timestamp: new Date().toISOString(),
            ...notification
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Auto-remove after 5 seconds for success/info, 8 seconds for warnings/errors
        const timeout = notification.type === 'error' || notification.type === 'warning' ? 8000 : 5000;
        setTimeout(() => {
            removeNotification(id);
        }, timeout);

        return id;
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    // Convenience methods
    const showSuccess = (title, message) => addNotification({ type: 'success', title, message });
    const showError = (title, message) => addNotification({ type: 'error', title, message });
    const showWarning = (title, message) => addNotification({ type: 'warning', title, message });
    const showInfo = (title, message) => addNotification({ type: 'info', title, message });

    const value = {
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            
            {/* Notification Container */}
            <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
                {notifications.slice(0, 5).map(notification => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClose={removeNotification}
                    />
                ))}
                
                {notifications.length > 5 && (
                    <div className="text-center">
                        <button
                            onClick={clearAll}
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Clear all ({notifications.length} notifications)
                        </button>
                    </div>
                )}
            </div>
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
