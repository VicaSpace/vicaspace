import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ParticipantDetails } from '@/types/spaceSpeaker';

interface SpaceSpeakerData {
  spaceSpeakerId: number;
  participants: ParticipantDetails;
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
    initParticipants(state, action: PayloadAction<ParticipantDetails>) {
      state.data.participants = action.payload;
    },

    /**
     * Add Participant to the current SpaceSpeaker section
     * @param state State
     * @param action Action
     */
    addParticipant(
      state,
      action: PayloadAction<{ id: string; producerId: string }>
    ) {
      console.log('Adding a new participant... ⏰');
      const { id, producerId } = action.payload;
      state.data.participants = {
        ...state.data.participants,
        [id]: {
          id,
          producerId,
        },
      };
    },
  },
});

export const {
  joinSpaceSpeaker,
  initParticipants,
  addParticipant,
  leaveSpaceSpeaker,
} = spaceSpeakerSlice.actions;

export default spaceSpeakerSlice.reducer;
