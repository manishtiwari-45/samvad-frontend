import axios from 'axios';

/**
 * Creates a pre-configured Axios client for making API requests.
 */
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000', // Fallback for local dev
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request Interceptor:
 * Automatically attaches the JWT authorization token to every outgoing request.
 */
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response Interceptor:
 * Handles global API errors, especially for authentication.
 * If a 401 Unauthorized response is received, it automatically logs the user out.
 */
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data?.detail || error.message);

        if (error.response && error.response.status === 401) {
            localStorage.removeItem('accessToken');
            if (window.location.pathname !== '/auth') {
                window.location.href = '/auth';
            }
        }
        
        const standardizedError = new Error(
            error.response?.data?.detail || "An unexpected error occurred."
        );
        return Promise.reject(standardizedError);
    }
);

// ============================================================================
// --- 🔐 User & Authentication API ---
// ============================================================================
export const authApi = {
    signup: (userData) => apiClient.post('/users/signup', userData),
    login: (credentials) => {
        const formData = new URLSearchParams();
        formData.append('username', credentials.email);
        formData.append('password', credentials.password);
        return apiClient.post('/users/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
    },
    loginWithGoogle: (googleToken) => apiClient.post('/users/google-login', { token: googleToken }),
    getCurrentUser: () => apiClient.get('/users/me'),
    getMyClubs: () => apiClient.get('/users/me/administered-clubs'),
    enrollFace: (imageBlob) => {
        const formData = new FormData();
        formData.append('file', imageBlob, 'face.jpg');
        return apiClient.post('/users/me/enroll-face', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};


// ============================================================================
// --- 📱 Verification API ---
// ============================================================================
export const verificationApi = {
    sendOtp: (whatsappNumber) => apiClient.post('/verification/send-otp', { whatsapp_number: whatsappNumber }),
    verifyOtp: (otpString) => apiClient.post('/verification/verify-otp', { otp: otpString }),
};


// ============================================================================
// --- 🏛️ Clubs API ---
// ============================================================================
export const clubApi = {
    getAll: () => apiClient.get('/clubs/'),
    getById: (clubId) => apiClient.get(`/clubs/${clubId}`),
    create: (clubData) => {
        const formData = new FormData();
        for (const key in clubData) {
            if (clubData[key]) {
                formData.append(key, clubData[key]);
            }
        }
        return apiClient.post('/clubs/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    join: (clubId) => apiClient.post(`/clubs/${clubId}/join`),
    update: (clubId, clubData) => apiClient.put(`/clubs/${clubId}`, clubData),
    delete: (clubId) => apiClient.delete(`/clubs/${clubId}`),
};

// ============================================================================
// --- 🗓️ Events API ---
// ============================================================================
export const eventApi = {
    getAll: () => apiClient.get('/events/'),
    create: (clubId, eventData) => apiClient.post(`/events/?club_id=${clubId}`, eventData),
    register: (eventId) => apiClient.post(`/events/${eventId}/register`),
    getRecommendations: () => apiClient.get('/events/recommendations'),
};

// ============================================================================
// --- 📢 Announcements API ---
// ============================================================================
export const announcementApi = {
    create: (clubId, announcementData) => apiClient.post(`/clubs/${clubId}/announcements`, announcementData),
    getForClub: (clubId) => apiClient.get(`/clubs/${clubId}/announcements`),
};

// ============================================================================
// --- 🖼️ Gallery & Photos API ---
// ============================================================================
export const photoApi = {
    getAll: () => apiClient.get('/photos/'),
    getForEvent: (eventId) => apiClient.get(`/events/${eventId}/photos`),
    uploadForEvent: (eventId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post(`/events/${eventId}/photos`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    delete: (photoId) => apiClient.delete(`/photos/${photoId}`),
    deleteForEvent: (photoId) => apiClient.delete(`/events/photos/${photoId}`),
    getGallery: () => apiClient.get('/photos/gallery'),
    uploadToGallery: (file, caption) => {
        const formData = new FormData();
        formData.append('file', file);
        if (caption) {
            formData.append('caption', caption);
        }
        return apiClient.post('/photos/gallery', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    deleteFromGallery: (photoId) => apiClient.delete(`/photos/gallery/${photoId}`),
};

// ============================================================================
// --- ⚙️ Admin API ---
// ============================================================================
export const adminApi = {
    getAllUsers: () => apiClient.get('/admin/users'),
    updateUserRole: (userId, newRole) => apiClient.put(`/admin/users/${userId}/role?new_role=${newRole}`),
    deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`),
    getDashboardStats: () => apiClient.get('/admin/stats'),
};

// ============================================================================
// --- 🤖 AI Services API ---
// ============================================================================
export const aiApi = {
    getChatbotResponse: (query, history) => apiClient.post('/ai/chatbot', { query, history }),
};
