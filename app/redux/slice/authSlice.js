import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    mobile: null,
    UserData: null,
    isLoading: false,
    error: null
  },
  reducers: {
    setMobile: (state, action) => {
      state.mobile = action.payload;
    },
    clearMobile: (state) => {
      state.mobile = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setUserData: (state, action) => {
      state.profileData = action.payload;
    }
  }
});

export const { setMobile, clearMobile, setLoading, setError, setUserData } = authSlice.actions;
export default authSlice.reducer;