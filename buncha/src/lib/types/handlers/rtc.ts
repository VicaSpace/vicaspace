import {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from 'mediasoup/node/lib/RtpParameters';
import {
  DtlsParameters,
  IceCandidate,
  IceParameters,
} from 'mediasoup/node/lib/WebRtcTransport';

export interface GetRtpCapabilitiesPayload {
  spaceSpeakerId: number;
}

export interface GetRtpCapabilitiesResponse {
  rtpCapabilities: object;
}

export interface CreateWebRtcTransportPayload {
  spaceSpeakerId: number;
}

export interface CreateWebRtcTransportResponse {
  params: {
    id?: string;
    iceParameters?: IceParameters;
    iceCandidates?: IceCandidate[];
    dtlsParameters?: DtlsParameters;
    error?: unknown;
  };
}

export interface ConnectWebRtcTransportPayload {
  spaceSpeakerId: number;
  transportId: string;
  dtlsParameters: DtlsParameters;
}

export interface CreateProducerPayload {
  spaceSpeakerId: number;
  transportId: string;
  kind: MediaKind;
  rtpParameters: RtpParameters;
}

export interface CreateProducerResponse {
  id: string;
}

export interface CreateConsumerPayload {
  spaceSpeakerId: number;
  transportId: string;
  producerId: string;
  rtpCapabilities: RtpCapabilities;
}

export interface CreateConsumerResponse {
  params: {
    id?: string;
    producerId?: string;
    kind?: MediaKind;
    rtpParameters?: RtpParameters;
    error?: unknown;
  };
}
