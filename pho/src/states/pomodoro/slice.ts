import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { KnownThunkError, ThunkStatus } from '../store';

interface PomodoroState {
  sessionId: number;
  startTime: number;
  isBreak: boolean;
  isLongBreak: boolean;
  timeGap: number;
  error: null | string;
  status: ThunkStatus;
}

const initialState: PomodoroState = {
  sessionId: 0,
  startTime: 0,
  isBreak: false,
  isLongBreak: false,
  timeGap: 0,
  error: null,
  status: 'idle',
};

export const calculateTimeGap = createAsyncThunk<
  number,
  any,
  {
    rejectValue: KnownThunkError;
  }
>('pomodoro/calculateTimeGap', async (_, thunkApi) => {
  try {
    const timeBeforeFetch = Date.now();
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL ?? ''}/api/timer`
    );
    return Number(response.data.serverTime - timeBeforeFetch);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue(err.response?.data as KnownThunkError);
    }
    return thunkApi.rejectWithValue({ message: (err as Error).message });
  }
});

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
  extraReducers: (builder) => {
    builder.addCase(calculateTimeGap.fulfilled, (state, action) => {
      state.timeGap = action.payload;
    });
    builder.addCase(calculateTimeGap.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = action.error.message ?? 'Undefined Error';
    });
  },
});

export const { setSessionId, setStartTime, setBreak, setLongBreak } =
  pomodoroSlice.actions;

export default pomodoroSlice.reducer;
