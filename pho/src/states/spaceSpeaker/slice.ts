import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface SpaceSpeakerState {
  data: {
    space?: number;
  };
  error: null | string;
}

const initialState: SpaceSpeakerState = {
  data: {},
  error: null,
};

const spaceSpeakerSlice = createSlice({
  name: 'spaceSpeaker',
  initialState,
  reducers: {
    joinSpaceSpeaker(state, action: PayloadAction<number>) {
      state.data.space = action.payload;
      console.log(`Successfully joined SpaceSpeaker ${state.data.space} 🔊`);
    },
  },
});

export const { joinSpaceSpeaker } = spaceSpeakerSlice.actions;

export default spaceSpeakerSlice.reducer;
