import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import pomodoroConfig from '@/config/pomodoro.json';

interface PomodoroState {
  sessionId: number;
  startTime: number;
  isBreak: boolean;
}

const initialState: PomodoroState = {
  sessionId: pomodoroConfig.length - 1,
  startTime: 0,
  isBreak: false,
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
  },
});

export const { setSessionId, setStartTime, setBreak } = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
