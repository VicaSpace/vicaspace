import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface TimeState {
  serverTime: number;
  clientTime: number;
}

const initialState: TimeState = {
  serverTime: Date.now(),
  clientTime: Date.now(),
};

const timeSlice = createSlice({
  name: 'time',
  initialState,
  reducers: {
    setServerTime(state, action: PayloadAction<number>) {
      state.serverTime = action.payload;
    },
    setClientTime(state, action: PayloadAction<number>) {
      state.clientTime = action.payload;
    },
  },
});

export const { setServerTime, setClientTime } = timeSlice.actions;

export default timeSlice.reducer;
