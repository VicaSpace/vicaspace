import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import pomodoroConfig from '@/config/pomodoro.json';

interface PomodoroState {
  sessionId: number;
  startTime: number;
  isBreak: boolean;
  isLongBreak: boolean;
}

const initialState: PomodoroState = {
  sessionId: 0,
  startTime: 0,
  isBreak: false,
  isLongBreak: false,
};

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState,
  reducers: {
    setSessionId(state, action: PayloadAction<number>) {
      state.sessionId = action.payload;
    },
    setStartTime(state, action: PayloadAction<number>) {
      state.startTime = action.payload;
    },
    setBreak(state, action: PayloadAction<boolean>) {
      state.isBreak = action.payload;
    },
    setLongBreak(state, action: PayloadAction<boolean>) {
      state.isLongBreak = action.payload;
      state.isBreak = action.payload;
    },
  },
});

export const { setSessionId, setStartTime, setBreak, setLongBreak } =
  pomodoroSlice.actions;

export default pomodoroSlice.reducer;
