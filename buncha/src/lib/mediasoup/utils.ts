import * as mediasoup from 'mediasoup';
import { Router } from 'mediasoup/node/lib/Router';

import config from '@/config';
import { logger } from '@/lib/logger';
import { CreateWebRtcTransportResponse } from '@/lib/types/handlers/rtc';

/**
 * Create a worker using mediasoup on specific port range
 * @returns Mediasoup Worker
 */
export const createWorker = async () => {
  const worker = await mediasoup.createWorker({
    rtcMinPort: config.rtc.minPort,
    rtcMaxPort: config.rtc.maxPort,
  });
  logger.info(`Worker PID: ${worker.pid}`);

  worker.on('died', (error) => {
    logger.error('mediasoup worker has died');
    logger.error(error);
    setTimeout(() => process.exit(1), 2000); // exit in 2 seconds
  });

  return worker;
};

/**
 *
 * @param router Mediasoup's Router
 * @param callback Callback from socket
 * @returns
 */
export const createWebRtcTransport = async (
  router: Router,
  callback: (payload: CreateWebRtcTransportResponse) => void
) => {
  // https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportOptions
  const webRtcTransportOptions = {
    listenIps: [
      {
        // Replace with relevant IP address
        ip: '0.0.0.0',
        announcedIp: config.app.ip,
      },
    ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  };
  try {
    const transport = await router.createWebRtcTransport(
      webRtcTransportOptions
    );
    logger.info(`Transport ID: ${transport.id}`);

    transport.on('dtlsstatechange', (dtlsState) => {
      if (dtlsState == 'closed') transport.close();
    });

    transport.on('@close', () => {
      logger.info('Transport closed');
    });

    // Send back to the client the following parameters
    callback({
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
      params: {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      },
    });
    return transport;
  } catch (err) {
    logger.error(err);
    callback({
      params: {
        error: err,
      },
    });
  }
};
