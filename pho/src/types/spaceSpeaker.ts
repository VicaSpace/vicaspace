import { MediaKind, RtpParameters } from 'mediasoup-client/lib/RtpParameters';
import {
  DtlsParameters,
  IceCandidate,
  IceParameters,
  Transport,
} from 'mediasoup-client/lib/Transport';

import { RefObject } from 'react';

export interface GetRTPCapabilitiesData {
  rtpCapabilities: any;
}

export interface AudioParams {
  track: MediaStreamTrack;
}

export interface CreateTransportResponse {
  params: {
    id: string;
    iceParameters: IceParameters;
    iceCandidates: IceCandidate[];
    dtlsParameters: DtlsParameters;
    error?: unknown;
  };
}

export interface ClientConsumeResponse {
  params: {
    id: string;
    producerId: string;
    kind: MediaKind;
    rtpParameters: RtpParameters;
    error?: unknown;
  };
}

export interface RecentUserJoinPayload {
  userId: number;
  username: string;
  socketId: string;
  producerId: string;
  msg: string;
}

export interface RecentUserLeavePayload {
  socketId: string;
}

export interface RecentUserSpeechPayload {
  socketId: string;
  event: 'speaking' | 'stopped_speaking';
}

export interface ParticipantInfo {
  socketId: string;
  producerId: string;
}

export interface SpeakerDetails {
  [id: string]: {
    id: string;
    userId: number;
    username: string;
    producerId: string;
    isSpeaking: boolean;
  };
}

export interface GetSpeakersResponse {
  speakers?: SpeakerDetails;
  error?: string;
}

export interface RecvTransports {
  [id: string]: {
    id: string;
    transport: Transport;
    peerSocketId: string;
  };
}

export interface RecvTransport {
  transport: Transport;
  socketId: string;
}

export interface PeerAudioRefs {
  [socketId: string]: {
    id: string;
    ref: RefObject<HTMLAudioElement>;
  };
}
