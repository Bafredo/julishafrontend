const API_BASE_URL = 'https://0481d3a03376.ngrok-free.app/api'
// const API_BASE_URL = 'http://localhost:5000/api';
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
};



export const apiEndpoints = {
  common : {
    auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    location: '/auth/location',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  },
  // Auth endpoints
  
  // User endpoints
  user: {
    profile: '/user/profile',
    updateProfile: '/user/profile',
    changePassword: '/user/change-password',
    users: '/user/users',
  },
  // Farmer endpoints
  farmer: {
    dashboard: '/farmer/dashboard',
    alerts: '/farmer/alerts',
    markAlertRead: (id: string) => `/farmer/alerts/${id}/read`,
  },
  // Officer endpoints
  officer: {
    dashboard: '/officer/dashboard',
    sendAlert: '/alerts',
  },
  // Admin endpoints
  admin: {
    dashboard: '/admin/dashboard',
    statistics: '/admin/statistics',
  },
  // Weather endpoints
  weather: {
    forecast: '/weather/forecast',
    history: '/weather/history',
    alerts: '/weather/alerts',
  },
  // Advisory endpoints
  advisory: {
    generate: '/advisory/generate',
    history: '/advisory/history',
  },
  // IoT endpoints
  iot: {
    data: '/iot/data',
    batch: '/iot/data/batch',
    latest: '/iot/data/latest',
    sensors: '/iot/sensors',
  },
};

export default apiConfig;