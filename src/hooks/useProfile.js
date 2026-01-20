// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';

const MOCK_MODE = import.meta.env.VITE_USE_MOCK === 'true';

export const useProfile = () => {
    // Get user dari Zustand store
    const storeUser = useAuthStore(state => state.user);
    const accessToken = useAuthStore(state => state.accessToken);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch profile saat component mount
     */
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('🔍 Fetching profile...');
                console.log('Store user:', storeUser);
                console.log('Access token:', accessToken);

                if (MOCK_MODE) {
                    // Simulasi API delay
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // Cek apakah ada user di store dan ada token
                    if (!storeUser || !accessToken) {
                        throw new Error('User not authenticated. Please login.');
                    }

                    // Set profile dari store user
                    setProfile(storeUser);
                    console.log('✅ Profile loaded:', storeUser);
                } else {
                    // TODO: Real API call
                    const response = await fetch('/auth/profile', {
                      headers: { 
                        Authorization: `Bearer ${accessToken}` 
                      }
                    });
                    const data = await response.json();
                    setProfile(data);
                }
            } catch (err) {
                console.error('❌ Error fetching profile:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [storeUser, accessToken]); // Re-run jika user atau token berubah

    /**
     * Update profile
     * @param {Object} updatedData - Data profile yang akan diupdate (name, email)
     */
    const updateProfile = async (updatedData) => {
        try {
            setLoading(true);
            setError(null);

            if (MOCK_MODE) {
                // Simulasi API delay
                await new Promise(resolve => setTimeout(resolve, 800));

                // Update profile lokal
                const updatedProfile = { ...profile, ...updatedData };
                setProfile(updatedProfile);

                // Update user di Zustand store juga
                const setUser = useAuthStore.getState().setUser;
                setUser(updatedProfile);

                console.log('✅ Profile updated:', updatedProfile);

                return { success: true, message: "Profile berhasil diupdate" };
            } else {
                // TODO: Real API call
                const response = await fetch('/auth/profile', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                  },
                  body: JSON.stringify(updatedData)
                });
                const data = await response.json();
                setProfile(data);
                const setUser = useAuthStore.getState().setUser;
                setUser(data);
                return data;
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Change password
     * @param {string} oldPassword - Password lama
     * @param {string} newPassword - Password baru
     */
    const changePassword = async (oldPassword, newPassword) => {
        try {
            setLoading(true);
            setError(null);

            if (MOCK_MODE) {
                // Simulasi API delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock validation: password lama harus minimal 6 karakter
                if (oldPassword.length < 6) {
                    throw new Error('Password lama tidak sesuai');
                }

                console.log('✅ Password changed successfully');

                return { success: true, message: 'Password berhasil diubah' };
            } else {
                // TODO: Real API call
                const response = await fetch('/auth/change-password', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                  },
                  body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword
                  })
                });
                const data = await response.json();
                return data;
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        profile,
        loading,
        error,
        updateProfile,
        changePassword
    };
};