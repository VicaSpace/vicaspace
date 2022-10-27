import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import counterSlice from '@/states/counter/slice';
import spaceSpeakerSlice from '@/states/spaceSpeaker/slice';
import spacesSlice from '@/states/spaces/slice';

/* Main Redux Global Store configurations */
export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    counterSlice,
    spaceSpeakerSlice,
    spacesSlice,
  },
});

/* Types for Hook and Thunk */
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export enum ThunkFetchState {
  Idle = 'idle',
  Loading = 'loading',
  Fulfilled = 'fulfilled',
  Rejected = 'rejected',
}

/* Error message type */
export interface KnownThunkError {
  message: string;
}
