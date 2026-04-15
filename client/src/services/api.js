import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Optionally add interceptors for auth token here
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchSensorData = () => api.get('/sensor-data');
export const fetchTrafficData = () => api.get('/traffic');
export const fetchEnvironmentStatus = () => api.get('/environment');
export const fetchComplaints = () => api.get('/complaints');
export const submitComplaint = (data) => api.post('/complaints', data);
export const runSimulation = (data) => api.post('/simulate', data);

export default api;
