import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => axiosInstance.post('/auth/signup', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
};

// Waste APIs
export const wasteAPI = {
  addWaste: (data) => axiosInstance.post('/waste/add', data),
  getWasteList: (page = 1, limit = 20) =>
    axiosInstance.get(`/waste/list?page=${page}&limit=${limit}`),
  updateWaste: (recordId, data) => axiosInstance.put(`/waste/${recordId}`, data),
  deleteWaste: (recordId) => axiosInstance.delete(`/waste/${recordId}`),
  getWasteTypes: () => axiosInstance.get('/waste/types'),
};

// Dashboard APIs
export const dashboardAPI = {
  getDashboardStats: () => axiosInstance.get('/dashboard/stats'),
  getAdminStats: (limit = 100, offset = 0) =>
    axiosInstance.get(`/dashboard/admin/stats?limit=${limit}&offset=${offset}`),
  exportWasteCsv: () => axiosInstance.get('/dashboard/admin/export-csv'),
  getTips: () => axiosInstance.get('/dashboard/tips'),
};

// Rewards APIs
export const rewardsAPI = {
  getRewards: () => axiosInstance.get('/rewards'),
  checkStreak: () => axiosInstance.get('/rewards/check-streak'),
  getAllRewards: () => axiosInstance.get('/rewards/all'),
};

// Admin APIs
export const adminAPI = {
  getAllUsers: () => axiosInstance.get('/admin/users'),
  getAllWaste: (limit = 100, offset = 0) =>
    axiosInstance.get(`/admin/waste?limit=${limit}&offset=${offset}`),
};

export default axiosInstance;
