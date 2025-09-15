import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, fetchCurrentUser } from '../services/api'; // Import loginUser

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchCurrentUser()
                .then(response => {
                    setUser(response.data);
                })
                .catch(() => {
                    // Token is invalid or expired
                    localStorage.removeItem('accessToken');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // MODIFIED: Login function now handles the entire API flow
    const login = async (credentials) => {
        // The component no longer needs to do this work.
        // The context handles everything.
        const response = await loginUser(credentials);
        const token = response.data.access_token;
        localStorage.setItem('accessToken', token);
        
        // The interceptor will automatically use the new token for this call
        const userResponse = await fetchCurrentUser();
        setUser(userResponse.data);
        // This function can be awaited in the component
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        // It's good practice to reload to clear all state
        window.location.href = '/auth';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
