import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import contestReducer from './slices/contestSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    contests: contestReducer,
  },
});

export default store;