import axios from 'axios';
import { store } from '../redux/store'; 
import { logout } from '../redux/slices/authSlice';

//const BASE_URL = 'https://hexawarredating.com/api'; 
const BASE_URL = 'https://vynkdating.com/api'; 

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
      // const credentials = await Keychain.getGenericPassword({ service: 'persist:auth' });
      
      // if (credentials && credentials.password) {
      //   const parsedData = JSON.parse(credentials.password);
      //   const token = parsedData.token; // authSlice ke andar ka actual token
        
      //   if (token) {
      //     config.headers.Authorization = `Bearer ${token}`;
      //   }
      // }

      // Pure try block ke andar bas ye teen lines daal dijiye:

      // temp code start ==================================

      const isPublicRoute = config.url && (
        config.url.includes('/userRegistration/') || 
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
        console.log("API Service Intercepctor Error: ", error);
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
    const isPublicRoute = error.config?.url && error.config.url.includes('/userRegistration/');
    if (error.response && error.response.status === 401 && !isPublicRoute) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default apiService;