import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userId?: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: undefined,
};

const authSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    signIn(state: AuthState, action?: PayloadAction<string>) {
      state.isAuthenticated = true;
      state.userId = action?.payload;
    },
    signOut(state: AuthState) {
      state.isAuthenticated = false;
      state.userId = undefined;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;

export default authSlice.reducer;
