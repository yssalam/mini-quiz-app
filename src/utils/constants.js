export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://apiquiz.ambisiusacademy.com/api/v1';
export const TOKEN_KEY = 'quiz_access_token';
export const REFRESH_TOKEN_KEY = 'quiz_refresh_token';
export const USER_DATA_TOKEN_KEY = 'quiz_user_data';
export const TOKEN_EXPIRES_AT_TOKEN_KEY = 'quiz_token_expiresAt';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
  QUIZ: '/quiz/:sessionId',
  QUIZ_HISTORY: '/history',
  QUIZ_RESULT: '/result/:sessionId',
};

export const QUIZ_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};