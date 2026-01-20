import axios from 'axios';
import {
    API_BASE_URL,
    TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    USER_DATA_TOKEN_KEY,
    TOKEN_EXPIRES_AT_TOKEN_KEY,
} from '../utils/constants';

/**
 * =========================
 * MOCK MODE (GLOBAL)
 * =========================
 */
export const MOCK_MODE = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * =========================
 * AXIOS INSTANCE
 * =========================
 */
export const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem(TOKEN_KEY) ||
            sessionStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const url = originalRequest?.url || "";

        // ❌ JANGAN logout kalau change password
        const isChangePassword = url.includes("/auth/profil");

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(USER_DATA_TOKEN_KEY);
            localStorage.removeItem(TOKEN_EXPIRES_AT_TOKEN_KEY);

            if (
                !window.location.pathname.includes('/login') &&
                !window.location.pathname.includes('/register')
            ) {
                localStorage.setItem(
                    'redirect_after_login',
                    window.location.pathname
                );
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

/**
 * =========================
 * AUTH API (REAL)
 * =========================
 */
export const authAPI = {
    register: async (data) => {
        const response = await http.post('/auth/register', data);
        if (response.data.success) {
            const { access_token, refresh_token, expires_in, user } = response.data.data;

            localStorage.setItem(TOKEN_KEY, access_token);
            localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
            localStorage.setItem(USER_DATA_TOKEN_KEY, JSON.stringify(user));

            if (expires_in) {
                localStorage.setItem(
                    TOKEN_EXPIRES_AT_TOKEN_KEY,
                    (Date.now() + expires_in * 1000).toString()
                );
            }
        }
        return response.data;
    },

    login: async (data) => {
        const response = await http.post('/auth/login', data);

        if (response.data.success) {
            const { access_token, refresh_token, expires_in, user } = response.data.data;

            const storage = data.rememberMe ? localStorage : sessionStorage;

            storage.setItem(TOKEN_KEY, access_token);
            storage.setItem(REFRESH_TOKEN_KEY, refresh_token);
            storage.setItem(USER_DATA_TOKEN_KEY, JSON.stringify(user));

            if (expires_in) {
                const expiresAt = Date.now() + expires_in * 1000
                storage.setItem(
                    TOKEN_EXPIRES_AT_TOKEN_KEY,
                    expires_in.toString()
                );
            }
        }
        return response.data;
    },

    logout: async () => {
        const response = await http.post('/auth/logout');

        localStorage.clear();
        return response.data;
    },

    getProfile: async () => {
        const response = await http.get('/auth/profile');
        if (response.data.success) {
            localStorage.setItem(
                USER_DATA_TOKEN_KEY,
                JSON.stringify(response.data.data)
            );
        }
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await http.put('/auth/profile', data);
        if (response.data.success) {
            localStorage.setItem(
                USER_DATA_TOKEN_KEY,
                JSON.stringify(response.data.data)
            );
        }
        return response.data;
    },
};

export default http;
