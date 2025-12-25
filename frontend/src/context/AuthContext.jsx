import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            authApi.getCurrentUser()
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
        const response = await authApi.login(credentials);
        const token = response.data.access_token;
        localStorage.setItem('accessToken', token);
        
        // The interceptor will automatically use the new token for this call
        const userResponse = await authApi.getCurrentUser();
        setUser(userResponse.data);
        
        // Return user data for role-based redirection
        return userResponse.data;
    };

    // Google login function
    const loginWithGoogle = async (googleToken) => {
        const response = await authApi.loginWithGoogle(googleToken);
        const token = response.data.access_token;
        localStorage.setItem('accessToken', token);
        
        const userResponse = await authApi.getCurrentUser();
        setUser(userResponse.data);
        
        return userResponse.data;
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        // It's good practice to reload to clear all state
        window.location.href = '/auth';
    };

    const setUserData = (userData) => {
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, loading, setUser: setUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
