export interface JoinPayload {
  spaceSpeakerId: number;
  producerId: string;
}

export interface LeavePayload {
  spaceSpeakerId: number;
  producerId: string;
  sendTransportId: string;
}

// type LeavePayload = JoinPayload;

export interface GetSpeakersPayload {
  spaceSpeakerId: number;
}

export interface SpeakerDetails {
  [id: string]: {
    id: string;
    producerId: string;
  };
}

export interface GetSpeakersResponse {
  speakers: SpeakerDetails;
}

export interface GetSpeakersErrorResponse {
  error: string;
}
