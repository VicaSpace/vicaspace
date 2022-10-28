import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { getSpaceDetail } from '@/lib/apis/space';
import { KnownThunkError, ThunkStatus } from '@/states/store';

export interface SpaceDetail {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  startTime: string;
  serverTime: string;
}

export interface SpaceDetailState {
  data: Partial<SpaceDetail>;
  status: ThunkStatus;
  error: null | string;
}

const initialState: SpaceDetailState = {
  data: {},
  status: 'idle',
  error: null,
};

/**
 * Fetch Space Detail Thunk Action
 */
export const fetchSpaceDetail = createAsyncThunk<
  SpaceDetail | null,
  number,
  {
    rejectValue: KnownThunkError;
  }
>('spaceDetail/fetchSpaceDetail', async (id: number, thunkApi) => {
  let spaceDetail: SpaceDetail | null = null;
  try {
    spaceDetail = await getSpaceDetail(id);
    console.log('fetched space detail api:', spaceDetail);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue(err.response?.data as KnownThunkError);
    }
    return thunkApi.rejectWithValue({ message: (err as Error).message });
  }
  return spaceDetail;
});

const spaceDetailSlice = createSlice({
  name: 'spaceDetail',
  initialState,
  reducers: {},
  extraReducers(builder) {
    /// Fetch Space Detail async actions
    builder.addCase(fetchSpaceDetail.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(fetchSpaceDetail.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      state.data = action.payload ?? {};
      console.log('state.data:', state.data);
    });
    builder.addCase(fetchSpaceDetail.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = action.error.message ?? 'Undefined Error';
    });
  },
});

export default spaceDetailSlice.reducer;
