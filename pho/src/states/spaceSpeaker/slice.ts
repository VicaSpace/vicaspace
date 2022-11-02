import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { SpeakerDetails } from '@/types/spaceSpeaker';

interface SpaceSpeakerData {
  spaceSpeakerId: number;
  speakers: SpeakerDetails;
}

interface SpaceSpeakerState {
  data: Partial<SpaceSpeakerData>;
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
    /**
     * Join Space Speaker section
     * @param state State
     * @param action Action Payload
     */
    joinSpaceSpeaker(state, action: PayloadAction<number>) {
      state.data.spaceSpeakerId = action.payload;
      console.log(
        `Successfully joined SpaceSpeaker ${state.data.spaceSpeakerId} 🔊`
      );
    },

    /**
     * Leave current SpaceSpeaker
     * @param state State
     * @returns void
     */
    leaveSpaceSpeaker(state) {
      if (!state.data.spaceSpeakerId) {
        console.error(
          'Cannot leave specified SpaceSpeaker as its ID is not valid.'
        );
        return;
      }
      console.log(`Leaving SpaceSpeaker ${state.data.spaceSpeakerId} 🔊`);
      delete state.data.spaceSpeakerId;
    },

    /**
     * Initialize Participant list
     * @param state State
     * @param action Action
     */
    setSpeakers(state, action: PayloadAction<SpeakerDetails>) {
      state.data.speakers = action.payload;
    },

    /**
     * Insert a new Speaker to the current SpaceSpeaker section
     * @param state State
     * @param action Action
     */
    insertSpeaker(
      state,
      action: PayloadAction<{ id: string; producerId: string }>
    ) {
      console.log('Adding a new participant... ⏰');
      const { id, producerId } = action.payload;
      state.data.speakers = {
        ...state.data.speakers,
        [id]: {
          id,
          producerId,
        },
      };
    },

    /**
     * Delete a Speaker from session
     * @param state State
     * @param action Action (with payload)
     */
    deleteSpeaker(state, action: PayloadAction<string>) {
      const filteredSpeakers = { ...state.data.speakers };
      delete filteredSpeakers[action.payload];
      state.data.speakers = filteredSpeakers;
    },
  },
});

export const {
  joinSpaceSpeaker,
  setSpeakers,
  insertSpeaker,
  deleteSpeaker,
  leaveSpaceSpeaker,
} = spaceSpeakerSlice.actions;

export default spaceSpeakerSlice.reducer;
