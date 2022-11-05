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

interface SetSpeakerSpeechStatusPayload {
  id: string;
  active: boolean;
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
     * Unset list of speakers
     * @param state State
     */
    unsetSpeakers(state) {
      delete state.data.speakers;
    },

    /**
     * Insert a new Speaker to the current SpaceSpeaker section
     * @param state State
     * @param action Action
     */
    insertSpeaker(
      state,
      action: PayloadAction<{
        id: string;
        producerId: string;
        userId: number;
        username: string;
      }>
    ) {
      if (!state.data.speakers) return;
      const { id, producerId, userId, username } = action.payload;
      state.data.speakers[id] = {
        id,
        producerId,
        userId,
        username,
        isSpeaking: false,
      };
    },

    /**
     * Delete a Speaker from session
     * @param state State
     * @param action Action (with payload)
     */
    deleteSpeaker(state, action: PayloadAction<string>) {
      if (!state.data.speakers) return;
      delete state.data.speakers[action.payload];
    },

    /**
     * Set Speaker's speech status
     * @param state State
     * @param action Action Payload
     * @returns
     */
    setSpeakerSpeechStatus(
      state,
      action: PayloadAction<SetSpeakerSpeechStatusPayload>
    ) {
      if (!state.data.speakers) return;
      const { active, id } = action.payload;
      state.data.speakers[id].isSpeaking = active;
    },
  },
});

export const {
  joinSpaceSpeaker,
  setSpeakers,
  unsetSpeakers,
  insertSpeaker,
  deleteSpeaker,
  leaveSpaceSpeaker,
  setSpeakerSpeechStatus,
} = spaceSpeakerSlice.actions;

export default spaceSpeakerSlice.reducer;
