import storageKeys from '@/constants/storageKeys';
import { User } from '@/types';
import { storage } from '@/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';

// Định nghĩa interface cho state auth
interface AuthState {
  user: User | null;
}

// Khởi tạo state ban đầu cho slice
const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      storage.remove(storageKeys.USER_INFO);
      storage.remove(storageKeys.ACCESS_TOKEN);
      storage.remove(storageKeys.REFRESH_TOKEN);
    },
  },
});

export const { setUser, logout } = authSlice.actions;

// Selector để lấy thông tin người dùng từ state
export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
