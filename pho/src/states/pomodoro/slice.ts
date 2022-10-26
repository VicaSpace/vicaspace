import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import pomodoroConfig from '@/config/pomodoro.json';

interface PomodoroState {
  sessionId: number;
}

const initialState: PomodoroState = {
  sessionId: pomodoroConfig.length - 1,
};

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState,
  reducers: {
    setSessionId(state, action: PayloadAction<number>) {
      state.sessionId = action.payload;
    },
  },
});

export const { setSessionId } = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
