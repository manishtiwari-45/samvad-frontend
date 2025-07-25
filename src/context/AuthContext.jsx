import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchCurrentUser } from '../services/api';

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

    const login = (token, userData) => {
    localStorage.setItem('accessToken', token);
    setUser(userData);
    };

    const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    };

    return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
    </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);