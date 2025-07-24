import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Create separate axios instance for AI requests with longer timeout
const aiApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for AI requests
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor for AI API to add auth token
aiApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Response interceptor for AI API error handling
aiApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Products API calls
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  search: (query) => api.get(`/products/search?q=${query}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
};

// Routines API calls
export const routinesAPI = {
  getAll: () => api.get('/routines'),
  getById: (id) => api.get(`/routines/${id}`),
  create: (routineData) => api.post('/routines', routineData),
  update: (id, routineData) => api.put(`/routines/${id}`, routineData),
  delete: (id) => api.delete(`/routines/${id}`),
  markComplete: (id) => api.post(`/routines/${id}/complete`),
  getProgress: (id) => api.get(`/routines/${id}/progress`),
};

// Reviews API calls
export const reviewsAPI = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  create: (reviewData) => api.post('/reviews', reviewData),
  update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/reviews/${id}`),
  like: (id) => api.post(`/reviews/${id}/like`),
  unlike: (id) => api.delete(`/reviews/${id}/like`),
};

// AI API calls
export const aiAPI = {
  getRecommendations: (skinData) => aiApi.post('/ai/recommendations', skinData),
  analyzeSkin: (imageData) => aiApi.post('/ai/analyze', imageData),
  generateRoutine: (preferences) => aiApi.post('/ai/routine', preferences),
  askQuestion: (question) => aiApi.post('/ai/chat', { question }),
  getDashboardInsights: () => aiApi.get('/ai/dashboard-insights'),
};

// Analytics API calls
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getProgressData: (timeframe) => api.get(`/analytics/progress?timeframe=${timeframe}`),
  getSkinImprovement: () => api.get('/analytics/skin-improvement'),
  getProductUsage: () => api.get('/analytics/product-usage'),
};

// File upload helper
export const uploadFile = async (file, type = 'image') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default api;
