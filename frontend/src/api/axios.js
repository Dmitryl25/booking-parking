import axios from "axios";

// Использование сокращенной записи для API
const api = axios.create({
    baseURL: 'https://localhost:8080/api',
});

// Добавление токена в каждный запрос
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
});

export default api