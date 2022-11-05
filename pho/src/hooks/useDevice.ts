import * as mediasoupClient from 'mediasoup-client';

import { useState } from 'react';

/**
 * useDeviceHook for creating MediaSoup device
 * @returns Device
 */
export const useDevice = (
  rtpCapabilities: mediasoupClient.types.RtpCapabilities | null
) => {
  const [device, setDevice] = useState<mediasoupClient.Device | undefined>();

  /**
   * Initialize new device
   */
  const initDevice = () => {
    const createdDevice = new mediasoupClient.Device();
    setDevice(createdDevice);
  };

  /**
   * Load a new device for user's (to create transport)
   */
  const loadDevice = async () => {
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
    // Loads the device with RTP capabilities of the Router (server side)
    if (!rtpCapabilities) {
      throw new Error(
        'Cannot create device. RTP Capabilities is currently null.'
      );
    }
    // Load device
    try {
      await device?.load({
        routerRtpCapabilities: rtpCapabilities,
      });
      if (device?.loaded) {
        console.log('Loaded device successfully.');
      } else {
        console.log('Device loaded failed');
      }
    } catch (err) {
      console.error(err);
      if ((err as any).name === 'UnsupportedError') {
        console.warn('Browser not supported');
      }
    }
  };

  return { device, initDevice, loadDevice };
};
