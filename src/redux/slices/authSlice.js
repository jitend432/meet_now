import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  token: null,
  refreshToken: null,
  userId: null,
  profileId: null,
  isLoggedIn: false,
  user: null,
  isProfileCompleted: false,
  hasSeenTutorial: false,
  
 
  profileDraft: {
    fullName: null,
    age: null,
    gender: null,
    height: null,
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
          state.isProfileCompleted = Boolean(decoded.profileId);
        } catch (error) {
          console.error('AuthSlice: Token decoding failed:', error);
          state.userId = null;
          state.profileId = null;
          state.isProfileCompleted = false;
        }
      }
    },

    setProfileCompleted: (state, action) => {
      state.isProfileCompleted = action.payload;
    },
    
    setUserProfile: (state, action) => {
      state.user = action.payload;
      
      if (action.payload) {
        if (!state.userId) {
          state.userId = action.payload.registrationId || action.payload.id || action.payload._id;
        }
        if (!state.profileId) {
          state.profileId = action.payload.profileId || action.payload.id;
        }
        if (action.payload.profileId || action.payload.isProfileCompleted) {
          state.isProfileCompleted = true;
        }
      }
    },

    updateProfileDraft: (state, action) => {
      state.profileDraft = {
        ...state.profileDraft,
        ...action.payload,
      };
    },

    clearProfileDraft: (state) => {
      state.profileDraft = initialState.profileDraft;
    },

    updateDiscoverySettings: (state, action) => {
      state.discoverySettings = {
        ...state.discoverySettings,
        ...action.payload,
      };
    },

    setHasSeenTutorial: (state, action) => {
      state.hasSeenTutorial = action.payload;
    },
    

    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.userId = null;
      state.profileId = null;
      state.isLoggedIn = false;
      state.isProfileCompleted = false;
      state.user = null;
      state.discoverySettings = initialState.discoverySettings;
      state.profileDraft = initialState.profileDraft;
      state.hasSeenTutorial = false;
    },
    
  },
});

export const { 
  setCredentials, 
  setProfileCompleted,
  logout, 
  setUserProfile, 
  updateDiscoverySettings,
  setHasSeenTutorial,
  updateProfileDraft, 
  clearProfileDraft 
} = authSlice.actions;
export default authSlice.reducer;