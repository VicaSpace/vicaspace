import { Consumer } from 'mediasoup/node/lib/Consumer';

import config from '@/config';
import {
  consumerCollection,
  producerCollection,
  spaceSpeakerCollection,
  transportCollection,
} from '@/data/collections';
import { logger } from '@/lib/logger';
import { createWebRtcTransport } from '@/lib/mediasoup/utils';
import {
  ConnectWebRtcTransportPayload,
  CreateConsumerPayload,
  CreateConsumerResponse,
  CreateProducerPayload,
  CreateProducerResponse,
  CreateWebRtcTransportPayload,
  CreateWebRtcTransportResponse,
  GetRtpCapabilitiesPayload,
  GetRtpCapabilitiesResponse,
} from '@/lib/types/handlers/rtc';
import { IOConnection, SocketConnection } from '@/lib/types/ws';

const { handlerNamespace } = config;

/**
 * Register RTC Handlers for Space communication
 * @param io IO
 * @param socket Socket
 */
export const registerRtcHandlers = (
  _io: IOConnection,
  socket: SocketConnection
) => {
  /**
   * Get RTPCapabilities for Space
   * @param params Emitted params
   * @param callback Callback
   */
  const getRtpCapabilitiesHandler = (
    payload: GetRtpCapabilitiesPayload,
    callback: (payload: GetRtpCapabilitiesResponse) => void
  ) => {
    const { spaceSpeakerId } = payload;
    logger.info(`User (socketId: ${socket.id}) retrieved RTP Capabilities`);
    const { router } = spaceSpeakerCollection[spaceSpeakerId];
    const { rtpCapabilities } = router;
    callback({ rtpCapabilities });
  };
  socket.on(
    `${handlerNamespace.rtc}:get-rtpCapabilities`,
    getRtpCapabilitiesHandler
  );

  /**
   * Create WebRTC Transport for space
   * @param params Parameters
   * @param callback Callback
   */
  const createWebRtcTransportHandler = async (
    payload: CreateWebRtcTransportPayload,
    callback: (payload: CreateWebRtcTransportResponse) => void
  ) => {
    const { spaceSpeakerId } = payload;
    logger.info(`User (socketId: ${socket.id}) retrieved RTP Capabilities`);
    if (!spaceSpeakerId) {
      return callback({
        params: {
          error: 'Invalid SpaceSpeaker ID',
        },
      });
    }
    const { router } = spaceSpeakerCollection[spaceSpeakerId];
    const transport = await createWebRtcTransport(router, callback);
    if (!transport) throw new Error('WebRTC Transport cannot be created');
    // Add transports association to peer & room
    transportCollection[transport.id] = {
      id: transport.id,
      transport,
      socketId: socket.id,
      spaceSpeakerId,
    };
  };
  socket.on(
    `${handlerNamespace.rtc}:create-webrtcTransport`,
    createWebRtcTransportHandler
  );

  /**
   * Connect the Transport from the client with the server's one
   * @param payload Connect Payload (spaceSpeakerId, transportId, dtlsParameters)
   */
  const connectWebRtcTransportHandler = async (
    payload: ConnectWebRtcTransportPayload
  ) => {
    const { spaceSpeakerId, transportId, dtlsParameters } = payload;
    if (
      !transportCollection[transportId] &&
      transportCollection[transportId].spaceSpeakerId !== spaceSpeakerId
    ) {
      throw new Error(
        'Cannot find the given transport to connect in the specified space. '
      );
    }
    const transport = transportCollection[transportId].transport;
    await transport.connect({ dtlsParameters });
  };
  socket.on(
    `${handlerNamespace.rtc}:connect-transport`,
    connectWebRtcTransportHandler
  );

  /**
   * Create a Producer from transport handler
   * @param payload Handler Payload
   * @param callback Handler Callback
   */
  const createProducerHandler = async (
    payload: CreateProducerPayload,
    callback: (res: CreateProducerResponse) => void
  ) => {
    const { spaceSpeakerId, transportId, kind, rtpParameters } = payload;
    if (
      !transportCollection[transportId] &&
      transportCollection[transportId].spaceSpeakerId !== spaceSpeakerId
    ) {
      throw new Error(
        'Cannot find the given transport to connect in the specified space. '
      );
    }

    const producerTransport = transportCollection[transportId].transport;
    if (!producerTransport) {
      throw new Error('Cannot find any Producer Transport');
    }

    // Call produce based on the params from the client
    const producer = await producerTransport.produce({
      kind,
      rtpParameters,
    });
    // Add producer to collection along with its associations
    producerCollection[producer.id] = {
      id: producer.id,
      producer,
      socketId: socket.id,
      spaceSpeakerId,
      transportId: producerTransport.id,
    };
    // Associate Producer to Transport
    transportCollection[producerTransport.id].producerId = producer.id;

    logger.info('Producer created successfully with the following info.');
    logger.info(`Producer ID: ${producer.id} - Kind: ${producer.kind}`);

    /// Hooks for producer
    producer.on('transportclose', () => {
      logger.info('Transport for this producer closed');
      producer?.close();
    });

    callback({
      id: producer.id,
    });
  };
  socket.on(`${handlerNamespace.rtc}:create-producer`, createProducerHandler);

  /**
   * Handler for creating consumer on specified producer
   * @param payload Payload
   * @param callback Callback to socket
   */
  const createConsumerHandler = async (
    payload: CreateConsumerPayload,
    callback: (res: CreateConsumerResponse) => void
  ) => {
    const { spaceSpeakerId, transportId, producerId, rtpCapabilities } =
      payload;
    // Retrieve space's router
    const { router } = spaceSpeakerCollection[spaceSpeakerId];
    if (!router) {
      throw new Error('Cannot find router for given space.');
    }

    // Retrieve Consumer Transport
    const { transport: consumerTransport } = transportCollection[transportId];
    if (!consumerTransport) {
      throw new Error('Cannot find Consumer Transport.');
    }

    // Retrieve producer
    const { producer } = producerCollection[producerId];
    if (!producer) {
      throw new Error('Cannot find the valid producer to consume.');
    }

    const isConsumable = router.canConsume({
      producerId: producer.id,
      rtpCapabilities,
    });
    logger.info(`Is consumable: ${isConsumable}`);
    if (!isConsumable) {
      callback({
        params: {
          error: 'Cannot consume media from producer',
        },
      });
      return;
    }

    let consumer: Consumer | undefined;
    try {
      consumer = await consumerTransport.consume({
        producerId: producer.id,
        rtpCapabilities,
      });
    } catch (err) {
      logger.error(err);
      return callback({
        params: {
          error: err,
        },
      });
    }

    // Add handlers for consumer
    consumer.on('transportclose', () => {
      logger.info('Transport close from consumer');
    });
    consumer.on('producerclose', () => {
      logger.info('Producer of consumer has been closed');
    });

    // Add consumer to collection along with its associations
    consumerCollection[consumer.id] = {
      id: consumer.id,
      consumer,
      socketId: socket.id,
      spaceSpeakerId,
      producerId,
      transportId: consumerTransport.id,
    };

    // Extract consumer's params & sent back to client
    const params = {
      id: consumer.id,
      producerId: producer.id,
      kind: consumer.kind,
      rtpParameters: consumer?.rtpParameters,
    };

    logger.info(`Consumer (id: ${consumer.id}) created ✅`);

    callback({
      params,
    });
  };
  socket.on(`${handlerNamespace.rtc}:create-consumer`, createConsumerHandler);
};
