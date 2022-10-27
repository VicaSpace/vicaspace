import { createSlice } from '@reduxjs/toolkit';

export interface SpaceDetail {
  spaceId: number;
  name: string;
}

export interface SpaceDetailState {
  data: SpaceDetail | null;
  error: null | string;
}

const initialState: SpaceDetailState = {
  data: null,
  error: null,
};

const spacesSlice = createSlice({
  name: 'spaceDetail',
  initialState,
  reducers: {},
});

export default spacesSlice.reducer;
