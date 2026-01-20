import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login: loginAction,
    register: registerAction,
    logout: logoutAction,
    verifyEmail
  } = useAuthStore();

  // Wrapper dengan logging
  const login = async (credentials) => {
    console.log('🔑 Login attempt with:', { email: credentials.email });
    try {
      const result = await loginAction(credentials);
      console.log('✅ Login successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    console.log('📝 Register attempt with:', {
      name: userData.name,
      email: userData.email
    });
    try {
      const result = await registerAction(userData);
      console.log('✅ Register successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Register failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('🚪 Logout attempt');
    try {
      await logoutAction();
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  };

  // Debug log setiap kali state berubah
  useEffect(() => {
    console.group('🔐 Auth State Changed');
    console.log('User Data:', user);
    console.log('Name:', user?.name);
    console.log('Email:', user?.email);
    console.log('Access Token:', accessToken);
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Is Loading:', isLoading);
    console.log('Error:', error);
    console.log('---');
    console.log('LocalStorage Tokens:');
    console.log('- Access Token:', localStorage.getItem('accessToken'));
    console.log('- Refresh Token:', localStorage.getItem('refreshToken'));
    console.log('- User Data:', localStorage.getItem('userData'));
    console.groupEnd();
  }, [user, accessToken, isAuthenticated, isLoading, error]);

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    verifyEmail,
  };
};

// Hook untuk protected routes
export const useRequireAuth = (redirectTo = '/login') => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, accessToken, tokenExpiresAt } = useAuthStore();

  useEffect(() => {
    console.group('🔐 Protected Route Check');
    console.log('User Data:', user);
    console.log('Access Token:', accessToken);
    console.log('Token Expires At:', tokenExpiresAt ? new Date(tokenExpiresAt).toLocaleString() : 'N/A');
    console.log('Is Token Expired:', useAuthStore.getState().isTokenExpired());
    console.log('Is Authenticated:', isAuthenticated);
    console.groupEnd();

    if (!isLoading && !isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to:', redirectTo);
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, accessToken, navigate, redirectTo]);

  return { isAuthenticated, isLoading };
};

// Hook untuk redirect jika sudah login
export const useGuestOnly = (redirectTo = '/dashboard') => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, accessToken, tokenExpiresAt } = useAuthStore();

  useEffect(() => {
    console.group('🔐 Guest Only Check');
    console.log('User Data:', user);
    console.log('Access Token:', accessToken);
    console.log('Token Expires At:', tokenExpiresAt ? new Date(tokenExpiresAt).toLocaleString() : 'N/A');
    console.log('Is Token Expired:', useAuthStore.getState().isTokenExpired());
    console.log('Is Authenticated:', isAuthenticated);
    console.groupEnd();

    if (!isLoading && isAuthenticated) {
      console.log('✅ Already authenticated, redirecting to:', redirectTo);
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, accessToken, navigate, redirectTo]);

  return { isAuthenticated, isLoading };
};