
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import quizReducer from './slice/quizSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
  }
});