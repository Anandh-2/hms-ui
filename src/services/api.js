import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Students API
export const studentsAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  getMyProfile: () => api.get('/students/me/profile'),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

// Wardens API
export const wardensAPI = {
  getAll: () => api.get('/wardens'),
  getMyProfile: () => api.get('/wardens/me/profile'),
  create: (data) => api.post('/wardens', data),
  update: (id, data) => api.put(`/wardens/${id}`, data),
  delete: (id) => api.delete(`/wardens/${id}`),
};

// Attendance API
export const attendanceAPI = {
  rfidLog: (data) => api.post('/attendance/rfid-log', data),
  getAll: (params) => api.get('/attendance', { params }),
  getMyLogs: (params) => api.get('/attendance/my-logs', { params }),
  getCurrentStatus: () => api.get('/attendance/current-status'),
  getMyStatus: () => api.get('/attendance/my-status'),
};

// College Leave API
export const collegeLeaveAPI = {
  create: (data) => api.post('/college-leave', data),
  getAll: (params) => api.get('/college-leave', { params }),
  getMyRecords: () => api.get('/college-leave/my-records'),
  delete: (id) => api.delete(`/college-leave/${id}`),
};

// Holiday Leave API
export const holidayLeaveAPI = {
  apply: (data) => api.post('/holiday-leave', data),
  getAll: (params) => api.get('/holiday-leave', { params }),
  getMyApplications: () => api.get('/holiday-leave/my-applications'),
  update: (id, data) => api.put(`/holiday-leave/${id}`, data),
  delete: (id) => api.delete(`/holiday-leave/${id}`),
};

// Reminders API
export const remindersAPI = {
  getSettings: () => api.get('/reminders'),
  updateSettings: (data) => api.put('/reminders', data),
  sendTest: () => api.post('/reminders/test'),
  getLogs: (params) => api.get('/reminders/logs', { params }),
};

export default api;
