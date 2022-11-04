import * as mediasoupClient from 'mediasoup-client';

import { useState } from 'react';

/**
 * useDeviceHook for creating MediaSoup device
 * @returns Device
 */
export const useDevice = () => {
  const [device, setDevice] = useState<mediasoupClient.Device | undefined>();

  /**
   * Initialize new device
   */
  const initDevice = () => {
    const createdDevice = new mediasoupClient.Device();
    setDevice(createdDevice);
  };

  return { device, initDevice };
};
