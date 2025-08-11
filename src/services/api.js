import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- User & Auth ---
export const signupUser = (userData) => apiClient.post('/users/signup', userData);
export const loginUser = (credentials) => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);
  return apiClient.post('/users/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};
export const fetchCurrentUser = () => apiClient.get('/users/me');
export const getMyClubs = () => apiClient.get('/users/me/administered-clubs');
export const enrollFace = (imageBlob) => {
  const formData = new FormData();
  formData.append('file', imageBlob, 'face.jpg');
  return apiClient.post('/users/me/enroll-face', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// --- Verification ---
export const sendOtp = (whatsappNumber) => apiClient.post('/verification/send-otp', { whatsapp_number: whatsappNumber });
export const verifyOtp = (otp) => apiClient.post('/verification/verify-otp', { otp: otp });


// --- Clubs ---
export const getAllClubs = () => apiClient.get('/clubs/');
export const getClubById = (clubId) => apiClient.get(`/clubs/${clubId}`);

// MODIFIED createClub function
export const createClub = (clubData) => {
    const formData = new FormData();

    // Append all required and optional fields to the form data
    formData.append('name', clubData.name);
    formData.append('description', clubData.description);
    formData.append('file', clubData.file);
    formData.append('category', clubData.category);

    if (clubData.contact_email) formData.append('contact_email', clubData.contact_email);
    if (clubData.website_url) formData.append('website_url', clubData.website_url);
    if (clubData.founded_date) formData.append('founded_date', clubData.founded_date);
    if (clubData.coordinator_id) formData.append('coordinator_id', clubData.coordinator_id);
    if (clubData.sub_coordinator_id) formData.append('sub_coordinator_id', clubData.sub_coordinator_id);
    
    return apiClient.post('/clubs/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const joinClub = (clubId) => apiClient.post(`/clubs/${clubId}/join`);
export const updateClub = (clubId, clubData) => apiClient.put(`/clubs/${clubId}`, clubData);
export const deleteClub = (clubId) => apiClient.delete(`/clubs/${clubId}`);

// --- Events ---
export const getAllEvents = () => apiClient.get('/events/');
export const createEvent = (clubId, eventData) => apiClient.post(`/events/?club_id=${clubId}`, eventData);
export const registerForEvent = (eventId) => apiClient.post(`/events/${eventId}/register`);
export const getRecommendedEvents = () => apiClient.get('/events/recommendations');

// --- Announcements ---
export const createAnnouncement = (clubId, announcementData) => apiClient.post(`/clubs/${clubId}/announcements`, announcementData);
export const getAnnouncementsForClub = (clubId) => apiClient.get(`/clubs/${clubId}/announcements`);

// --- Photo Gallery ---
export const getAllPhotos = () => apiClient.get('/photos/');
export const getEventPhotos = (eventId) => apiClient.get(`/events/${eventId}/photos`);
export const uploadEventPhoto = (eventId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post(`/events/${eventId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deletePhoto = (photoId) => apiClient.delete(`/photos/${photoId}`);
export const deleteEventPhoto = (photoId) => apiClient.delete(`/events/photos/${photoId}`);

// --- Common Gallery ---
export const getGalleryPhotos = () => apiClient.get('/photos/gallery');
export const uploadToGallery = (file, caption) => {
  const formData = new FormData();
  formData.append('file', file);
  if (caption) {
    formData.append('caption', caption);
  }
  return apiClient.post('/photos/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deleteGalleryPhoto = (photoId) => apiClient.delete(`/photos/gallery/${photoId}`);

// --- Admin ---
export const getAllUsers = () => apiClient.get('/admin/users');
export const updateUserRole = (userId, newRole) => apiClient.put(`/admin/users/${userId}/role?new_role=${newRole}`);
export const deleteUser = (userId) => apiClient.delete(`/admin/users/${userId}`);
export const getDashboardStats = () => apiClient.get('/admin/stats');
