import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import keychainStorage from './keychainStorage';

import authReducer from './slices/authSlice';
import callReducer from './slices/callSlice';
import chatReducer from './slices/chatSlice';
import matchReducer from './slices/matchSlice';


const authPersistConfig = {
  key: 'auth',
  storage: keychainStorage,
};

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['chat', 'call', 'match'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  call: callReducer,
  chat: chatReducer,
  match: matchReducer,
});


const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);