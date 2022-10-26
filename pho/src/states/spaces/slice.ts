import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { ThunkFetchState } from '@/states/store';

export interface SpaceLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface SpaceState {
  data: null | SpaceLocation[];
  error: null | string;
}

const initialState: SpaceState = {
  data: null,
  error: null,
};

export const fetchAllSpaces = createAsyncThunk('spaces/fetchAll', async (_) => {
  try {
    const response = await axios.get('http://localhost:4000/api/spaces');
    return response.data;
  } catch (err) {
    console.log(err);
  }
});

const spacesSlice = createSlice({
  name: 'spaces',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllSpaces.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export default spacesSlice.reducer;
