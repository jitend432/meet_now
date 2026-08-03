import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { store } from '../redux/store'; // Path apne hisab se sahi kar lein
import { logout } from '../redux/slices/authSlice';

const BASE_URL = 'https://hexawarredating.com/api/auth/login'; 

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 2. REQUEST INTERCEPTOR: Har API call hone se pehle yeh chalega aur Token lagayega
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Keychain se auth token nikalenge jo humne 'auth' service key se save kiya tha
      const credentials = await Keychain.getGenericPassword({ service: 'auth' });
      
      if (credentials && credentials.password) {
        // Agar token milta hai toh use headers me attach kar do
        const parsedData = JSON.parse(credentials.password);
        const token = parsedData.token; // Jo token authSlice se persist hua hai
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Interceptor me token nikalne me dikkat aayi:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. RESPONSE INTERCEPTOR: API se data aane ke baad handle karne ke liye (Jaise 401 Unauthorized Error)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar server 401 Error deta hai (Token expire ho gaya hai)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Yahan aap Refresh Token ka logic likh sakte hain baad me.
        // Abhi ke liye agar token invalid hai, toh user ko direct log out kar do:
        store.dispatch(logout());
        return Promise.reject(error);
      } catch (proccessError) {
        return Promise.reject(proccessError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;