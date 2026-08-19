import axios from 'axios';
import { store } from '../redux/store'; 
import { logout } from '../redux/slices/authSlice';

const BASE_URL = 'https://vynkdating.com/api'; 
//const BASE_URL = 'http://192.168.29.108:8082/api'; 

const apiService = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiService.interceptors.request.use(
  async (config) => {
    try {
      
      const isPublicRoute = config.url && (
       (config.url.includes('/userRegistration/') &&
        !config.url.includes('/userRegistration/delete') &&
        !config.url.includes('/userRegistration/report-user') &&
        !config.url.includes('/userRegistration/block-user') &&
        !config.url.includes('/userRegistration/unblock-user') 
      ) ||    
       config.url.includes('/auth/login')
       );

      if (isPublicRoute) {
        return config;
      }
      
      const state = store.getState();
      const token = state.auth?.token; 
      console.log("This is request token ==> ",token)
      
      if (token && token.trim() !== '' && token !== 'null' && token !== null) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
       // console.log("API Service Intercepctor Error: ", error);
       console.log("⚠️ API Service Warning: Token is missing for protected route:", config.url);
      }
    
      // temp code end ===========================================
      console.log("👉 REAL REQUEST URL:", config.url);

    } catch (error) {
      console.error('API Service Interceptor Error:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isPublicRoute = error.config?.url &&
     error.config.url.includes('/userRegistration/') &&
    !error.config.url.includes('/userRegistration/delete') &&
    !error.config.url.includes('/userRegistration/report-user') &&
    !error.config.url.includes('/userRegistration/block-user') &&
    !error.config.url.includes('/userRegistration/unblock-user') 
    if (error.response && error.response.status === 401 && !isPublicRoute) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default apiService;