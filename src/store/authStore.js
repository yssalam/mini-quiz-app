import { create } from 'zustand';
import { authAPI } from '../services/api';
import {
    TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    USER_DATA_TOKEN_KEY,
    TOKEN_EXPIRES_AT_TOKEN_KEY
} from '../utils/constants';

// Set ini ke false nanti kalau API sudah ready
const MOCK_MODE = import.meta.env.VITE_USE_MOCK === 'true';

// Helper function untuk safe JSON parse
const safeJSONParse = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Failed to parse ${key}:`, error);
        localStorage.removeItem(key);
        return defaultValue;
    }
};

const AuthStore = create((set, get) => ({
    // State
    user: safeJSONParse(USER_DATA_TOKEN_KEY, null),
    accessToken: localStorage.getItem(TOKEN_KEY) || null,
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || null,
    tokenExpiresAt: localStorage.getItem(TOKEN_EXPIRES_AT_TOKEN_KEY) || null,
    isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
    isLoading: false,
    error: null,

    // Actions
    setUser: (user) => {
        localStorage.setItem(USER_DATA_TOKEN_KEY, JSON.stringify(user));
        set({ user, isAuthenticated: true });
    },

    setTokens: (accessToken, refreshToken, expiresIn = 86400) => {
        const expiresAt = Date.now() + (expiresIn * 1000);

        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(TOKEN_EXPIRES_AT_TOKEN_KEY, expiresAt.toString());

        set({
            accessToken,
            refreshToken,
            tokenExpiresAt: expiresAt,
            isAuthenticated: true
        });
    },

    clearAuth: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRES_AT_TOKEN_KEY);
        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            tokenExpiresAt: null,
            isAuthenticated: false
        });
    },

    // Register
    register: async (userData) => {
        set({ isLoading: true, error: null });

        // MOCK MODE
        if (MOCK_MODE) {
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));

                const mockUser = {
                    id: Date.now(),
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    isVerified: true
                };

                // Load existing users
                const existingUsers = safeJSONParse('mockUsers', []);

                // Check if email already exists
                const emailExists = existingUsers.some(u => u.email === userData.email);
                if (emailExists) {
                    throw new Error('Email already registered');
                }

                // Tambahkan user baru
                existingUsers.push(mockUser);

                // Simpan kembali
                localStorage.setItem('mockUsers', JSON.stringify(existingUsers));

                set({ isLoading: false });

                // Return success (no auto-login, user needs to verify email first)
                return {
                    success: true,
                    message: 'Registration successful. Please check your email to verify.'
                };
            } catch (error) {
                set({ isLoading: false, error: error.message });
                throw error;
            }
        }

        // REAL API CALL
        try {
            const response = await authAPI.register(userData);
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            set({ isLoading: false, error: errorMessage });
            throw error;
        }
    },

    // Login
    login: async (credentials) => {
        set({ isLoading: true, error: null });

        // MOCK MODE
        if (MOCK_MODE) {
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));

                if (credentials.password.length < 6) {
                    throw new Error('Password must be at least 6 characters');
                }

                // Load users dari localStorage
                const mockUsers = safeJSONParse('mockUsers', []);

                // Cari user berdasarkan email & password
                const foundUser = mockUsers.find(
                    u => u.email === credentials.email && u.password === credentials.password
                );

                if (!foundUser) {
                    throw new Error('Invalid email or password');
                }

                // Mock tokens sesuai format API
                const mockTokens = {
                    access_token: 'mock-access-token-' + Date.now(),
                    refresh_token: 'mock-refresh-token-' + Date.now(),
                    expires_in: 86400
                };

                // Remove password sebelum set ke state
                const { password, ...userWithoutPassword } = foundUser;

                get().setUser(userWithoutPassword);
                get().setTokens(mockTokens.access_token, mockTokens.refresh_token, mockTokens.expires_in);
                set({ isLoading: false });

                // Return format sesuai API
                return {
                    success: true,
                    data: {
                        ...mockTokens,
                        user: userWithoutPassword
                    }
                };
            } catch (error) {
                set({ isLoading: false, error: error.message });
                throw error;
            }
        }

        // REAL API CALL - ✅ DIPERBAIKI SESUAI BRIEF
        try {
            const response = await authAPI.login(credentials);

            // ✅ Response format sesuai brief (halaman 2-3):
            // {
            //   "success": true,
            //   "data": {
            //     "access_token": "...",
            //     "refresh_token": "...",
            //     "expires_in": 86400
            //   }
            // }
            const { access_token, refresh_token, expires_in } = response.data.data;

            // Set tokens
            get().setTokens(access_token, refresh_token, expires_in);

            // ✅ Get user profile setelah login
            // Karena login response tidak include user data (sesuai brief)
            try {
                const profileResponse = await authAPI.getProfile();
                // Profile response format: { success: true, data: { user data } }
                const userData = profileResponse.data.data;
                get().setUser(userData);
            } catch (profileError) {
                console.error('Failed to fetch profile:', profileError);
                // Set basic user data jika profile fetch gagal
                get().setUser({ email: credentials.email });
            }

            set({ isLoading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            set({ isLoading: false, error: errorMessage });
            throw error;
        }
    },

    // Update Profile
    updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });

        if (MOCK_MODE) {
            // MOCK MODE
            return new Promise((resolve) => {
                setTimeout(() => {
                    const currentUser = get().user;
                    const updatedUser = { ...currentUser, ...profileData };

                    // Update user state
                    get().setUser(updatedUser);

                    set({ isLoading: false });
                    resolve({ success: true, data: updatedUser });
                }, 800);
            });
        }

        // REAL API CALL
        try {
            const response = await authAPI.updateProfile(profileData);
            const updatedUser = response.data.data;

            // Update user state
            get().setUser(updatedUser);

            set({ isLoading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            set({ isLoading: false, error: errorMessage });
            throw error;
        }
    },

    // Change Password
    changePassword: async (passwordData) => {
        set({ isLoading: true, error: null });

        if (MOCK_MODE) {
            // MOCK MODE
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate validation
                    if (passwordData.old_password !== 'password123') {
                        set({ isLoading: false, error: 'Current password is incorrect' });
                        reject(new Error('Current password is incorrect'));
                        return;
                    }

                    set({ isLoading: false });
                    resolve({ success: true, message: 'Password changed successfully' });
                }, 800);
            });
        }

        // REAL API CALL
        try {
            const response = await authAPI.changePassword(passwordData);
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to change password';
            set({ isLoading: false, error: errorMessage });
            throw error;
        }
    },

    // Logout
    logout: async () => {
        set({ isLoading: true });

        if (MOCK_MODE) {
            await new Promise(resolve => setTimeout(resolve, 500));
            get().clearAuth();
            set({ isLoading: false });
            return;
        }

        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            get().clearAuth();
            set({ isLoading: false });
        }
    },

    // Verify Email
    verifyEmail: async (token) => {
        set({ isLoading: true, error: null });

        if (MOCK_MODE) {
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));

                if (!token || token === 'invalid') {
                    throw new Error('Invalid or expired verification token');
                }

                set({ isLoading: false });
                return {
                    success: true,
                    message: 'Email verified successfully! You can now login. (Mock Mode)'
                };
            } catch (error) {
                set({ isLoading: false, error: error.message });
                throw error;
            }
        }

        try {
            // ✅ Sesuai brief: POST /auth/verify-email dengan body { token }
            const response = await authAPI.verifyEmail(token);
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Verification failed';
            set({ isLoading: false, error: errorMessage });
            throw error;
        }
    },

    isTokenExpired: () => {
        const expiresAt = get().tokenExpiresAt;
        if (!expiresAt) return true;
        return Date.now() > expiresAt;
    },

    checkTokenExpiry: () => {
        if (get().isTokenExpired()) {
            alert('Token expired, logging out...');
            get().logout();
        }
    }

}));

export default AuthStore;