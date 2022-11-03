import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';

import { useContext, useState } from 'react';

import config from '@/config';
import { WebSocketContext } from '@/modules/ws/WebSocketProvider';
import { GetRTPCapabilitiesData } from '@/types/spaceSpeaker';

// Parse config
const { handlerNamespace } = config;

export const useSpaceRtpCapabilities = () => {
  const { socket } = useContext(WebSocketContext);

  const [rtpCapabilities, setRtpCapabilities] =
    useState<RtpCapabilities | null>(null);

  /**
   * Get SpaceSpeaker Id's RTP Capabilities
   * @param spaceSpeakerId SpaceSpeakerID
   */
  const getSpaceRtpCapabilities = async (
    spaceSpeakerId: number
  ): Promise<void> => {
    return new Promise((resolve) => {
      socket.emit(
        `${handlerNamespace.rtc}:get-rtpCapabilities`,
        { spaceSpeakerId },
        ({ rtpCapabilities }: GetRTPCapabilitiesData) => {
          setRtpCapabilities(rtpCapabilities);
          resolve();
        }
      );
    });
  };

  return { rtpCapabilities, getSpaceRtpCapabilities };
};
