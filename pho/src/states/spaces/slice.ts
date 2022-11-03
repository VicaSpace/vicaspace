import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

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
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL ?? ''}/api/spaces`
    );
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
