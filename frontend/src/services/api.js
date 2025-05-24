import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
    validateStatus: status => status >= 200 && status < 400,
});

API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default API;
