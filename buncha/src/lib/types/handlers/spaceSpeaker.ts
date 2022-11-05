export interface JoinPayload {
  spaceSpeakerId: number;
  producerId: string;
  accessToken?: string;
}

export interface LeavePayload {
  spaceSpeakerId: number;
  producerId: string;
  sendTransportId: string;
}

// type LeavePayload = JoinPayload;

export interface GetSpeakersPayload {
  accessToken?: string;
  spaceSpeakerId: number;
}

export interface SpeakerDetails {
  [id: string]: {
    id: string;
    userId: number;
    username: string;
    producerId: string;
  };
}

export interface GetSpeakersResponse {
  speakers: SpeakerDetails;
}

export interface GetSpeakersErrorResponse {
  error: string;
}

export interface SpeechEventPayload {
  spaceSpeakerId: string;
  socketId: string;
  event: 'speaking' | 'stopped_speaking';
}
