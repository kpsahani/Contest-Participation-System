import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  profile: () => api.get('/auth/profile'),
};

export const contestsApi = {
  getAll: (isAdmin = false) => api.get(`/contests${isAdmin ? '/admin' : ''}`),
  getById: (id) => api.get(`/contests/${id}`),
  create: (data) => api.post('/contests', data),
  join: (id) => api.post(`/contests/${id}/join`),
  submit: (id, answers) => api.post(`/contests/${id}/submit`, { answers }),
};

export const leaderboard = {
  getGlobal: () => api.get('/leaderboard'),
  getByContest: (id) => api.get(`/contests/${id}/leaderboard`),
};

export default api;