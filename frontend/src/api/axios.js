import axios from "axios";

// Использование сокращенной записи для API
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Добавление токена в каждный запрос
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Проверка на исключение страницы логина
        const isLoginRequest = originalRequest.url.includes('/auth/login');

        if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    // Запрос на рефреш токена
                    const response = await axios.post('http://localhost:8080/api/auth/refresh', {
                        refresh_token: refreshToken
                    });

                    const { accessToken: newAccess, refreshToken: newRefresh } = response.data;

                    // Обновляем токены
                    localStorage.setItem('accessToken', newAccess);
                    localStorage.setItem('refreshToken', newRefresh);

                    // Обновляем заголовок в упавшем запросе и повторяем его
                    originalRequest.headers.Authorization = `Bearer ${newAccess}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Рефреш токен недействителен");
                    localStorage.clear();
                    window.location.href = '/login';
                    
                    return Promise.reject(refreshError);
                }
            } else {
                localStorage.clear();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
)

export default api