import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userId?: string;
  username?: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: undefined,
  username: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(
      state: AuthState,
      action?: PayloadAction<{ userId: string; username: string }>
    ) {
      state.isAuthenticated = true;
      state.userId = action?.payload.userId;
      state.username = action?.payload.username;
    },
    signOut(state: AuthState) {
      state.isAuthenticated = false;
      state.userId = undefined;
      state.username = undefined;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;

export default authSlice.reducer;
