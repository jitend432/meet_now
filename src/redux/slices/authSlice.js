import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  token: null,
  refreshToken: null,
  userId: null,
  profileId: null,
  isLoggedIn: false,
  user: null,
  
  // 1. Centralized Buffer Draft for simultaneous multi-screen profile submission
  profileDraft: {
    fullName: null,
    age: null,
    gender: null,
    bio: null,
    occupation: null,
    education: null,
    interests: [],
    drinkingHabit: null,
    smokingHabit: null,
    hopingToFind: null,
    lookingFor: null,
  },  

  discoverySettings: {
    distance: 5, // default distance in km
    minAge: 18,   // default min age
    maxAge: 60,   // default max age
  },

};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, refreshToken } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isLoggedIn = true;

      if (token) {
        try {
          const decoded = jwtDecode(token);
          console.log("Decoded JWT Payload:", decoded);
          state.userId = decoded.registrationId || null; 
          state.profileId = decoded.profileId || null;
        } catch (error) {
          console.error('AuthSlice: Token decoding failed:', error);
          state.userId = null;
        }
      }
    },
    
    setUserProfile: (state, action) => {
      state.user = action.payload;
      
      // Fallback: Agar token se ID skip hui ho toh user profile object ke nodes se map ho jaye
      if (action.payload) {
        if (!state.userId) {
          state.userId = action.payload.registrationId || action.payload.id || action.payload._id;
        }
        if (!state.profileId) {
          state.profileId = action.payload.profileId || action.payload.id;
        }
      }
    },

    // 2. Reducer to merge step-by-step form changes on each screen transition
    updateProfileDraft: (state, action) => {
      state.profileDraft = {
        ...state.profileDraft,
        ...action.payload,
      };
    },

    // 3. Reducer to scrub draft states out of storage upon complete transaction hit
    clearProfileDraft: (state) => {
      state.profileDraft = initialState.profileDraft;
    },

    updateDiscoverySettings: (state, action) => {
      state.discoverySettings = {
        ...state.discoverySettings,
        ...action.payload,
      };
    },

    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.userId = null;
      state.profileId = null;
      state.isLoggedIn = false;
      state.user = null;
      state.discoverySettings = initialState.discoverySettings;
      state.profileDraft = initialState.profileDraft;
    },
    
  },
});

export const { 
  setCredentials, 
  logout, 
  setUserProfile, 
  updateDiscoverySettings,
  updateProfileDraft, 
  clearProfileDraft 
} = authSlice.actions;
export default authSlice.reducer;