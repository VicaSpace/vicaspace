import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface SpaceDetail {
  spaceId: number;
  name: string;
}

export interface SpaceDetailState {
  data: Partial<SpaceDetail>;
  error: null | string;
}

const initialState: SpaceDetailState = {
  data: {},
  error: null,
};

const spaceDetailSlice = createSlice({
  name: 'spaceDetail',
  initialState,
  reducers: {
    /**
     * Join a Space (specified by ID)
     * @param state State
     * @param action Action
     */
    joinSpace(state, action: PayloadAction<number>) {
      state.data.spaceId = action.payload;
      console.log(`You have joined space (id: ${state.data.spaceId}) ✅`);
    },
  },
});

export const { joinSpace } = spaceDetailSlice.actions;

export default spaceDetailSlice.reducer;
