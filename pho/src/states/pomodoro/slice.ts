import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import pomodoroConfig from '@/config/pomodoro.json';

interface PomodoroState {
  sessionId: number;
  startTime: number;
}

const initialState: PomodoroState = {
  sessionId: pomodoroConfig.length - 1,
  startTime: 0,
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
  },
});

export const { setSessionId, setStartTime } = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
