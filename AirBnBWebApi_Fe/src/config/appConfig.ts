const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const port = import.meta.env.VITE_PORT;
const environment = import.meta.env.VITE_NODE_ENV || 'development';
const serverUrl = import.meta.env.VITE_PUBLIC_URL;

export const CONFIG = {
  STORAGE_KEYS: {
    USER_LOGIN: 'user_login',
    AUTH_TOKEN: 'auth_token',
  },
  COOKIE_KEYS: {
    SESSION_ID: 'session_id',
    CSRF_TOKEN: 'csrf_token',
  },
  API: {
    BASE_URL: apiBaseUrl,
    TIMEOUT: 10000,
    HEADERS: {
      "Content-type": "application/json",
    },
  },
  THEME: {
    DARK: 'dark',
    LIGHT: 'light',
  },
  PORT: port,
  ENVIRONMENT: environment,
  SERVER_URL: serverUrl,
};
