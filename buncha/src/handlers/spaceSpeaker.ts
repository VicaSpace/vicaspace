import axios from 'axios';

import config from '@/config';
import {
  consumerCollection,
  producerCollection,
  socketCollection,
  transportCollection,
} from '@/data/collections';
import { getUserBySocketId } from '@/lib/apis/user';
import { logger } from '@/lib/logger';
import {
  GetSpeakersErrorResponse,
  GetSpeakersPayload,
  GetSpeakersResponse,
  JoinPayload,
  LeavePayload,
  SpeakerDetails,
} from '@/lib/types/handlers/spaceSpeaker';
import { IOConnection, SocketConnection } from '@/lib/types/ws';

const { handlerNamespace } = config;

/**
 * Register list of handlers for SpaceSpeaker
 * @param io IO Connection
 * @param socket Socket client
 */
export const registerSpaceSpeakerHandlers = (
  io: IOConnection,
  socket: SocketConnection
) => {
  /**
   * Handles joining a specific space by ID
   * @param payload Payload
   * @param callback Callback
   */
  const joinHandler = async (
    payload: JoinPayload,
    callback: (payload?: any) => void
  ) => {
    const { spaceSpeakerId, producerId, accessToken } = payload;
    if (!accessToken) {
      return callback({
        error: 'Unauthorized called to WebSocket',
      });
    }

    // Query user info from socketId
    const user = await getUserBySocketId(socket.id, accessToken);
    if (!user) {
      return callback({
        status: 'NOK',
        error: 'Cannot retrieve user from socketID',
      });
    }

    logger.info(
      `User (${user.username} w/ sId: ${socket.id}) has joined a space (spaceId: ${spaceSpeakerId})`
    );

    const spaceIdStr = spaceSpeakerId.toString();

    // Assign socket to a specific space
    await socket.join(spaceIdStr);

    // Add spaceSpeakerId to user/socket collection
    socketCollection[socket.id].spaceSpeakerId = spaceSpeakerId;

    // Broadcast recent joined user to all sockets in space
    io.to(spaceIdStr).emit(
      `${handlerNamespace.spaceSpeaker}:recent-user-join`,
      {
        socketId: socket.id,
        userId: user.id,
        username: user.username,
        producerId,
        msg: `User (socketId: ${socket.id}) has joined the SpaceSpeaker.`,
      }
    );

    callback({
      status: 'OK',
    });
  };
  socket.on(`${handlerNamespace.spaceSpeaker}:join`, joinHandler);

  /**
   * Handles leaving current space
   */
  const leaveHandler = async (payload: LeavePayload) => {
    // Parse payload
    const { producerId, spaceSpeakerId } = payload;

    // Check if SpaceSpeaker ID exists or not
    if (!spaceSpeakerId) {
      logger.warn(
        `User (socketId: ${socket.id}) cannot leave space as 'spaceId' is empty`
      );
      return;
    }

    const spaceSpeakerIdStr = spaceSpeakerId.toString();

    // Unassign socket from a specific space
    await socket.leave(spaceSpeakerIdStr);

    // Delete socket's current SpaceSpeaker session
    delete socketCollection[socket.id].spaceSpeakerId;

    // Remove all consumers who has producerId as its ref
    Object.keys(consumerCollection).forEach((k) => {
      if (consumerCollection[k].producerId !== producerId) return;

      // Delete the transport along with its consumer's association
      delete transportCollection[consumerCollection[k].transportId];
      delete consumerCollection[k];
    });
    logger.info(`Deleted consumers and their transports for leaving user ❌`);

    // Delete left user's producer
    delete producerCollection[producerId];
    logger.info(`Deleted producer for leaving user ❌`);

    // Broadcast recent left user to all sockets in space
    io.to(spaceSpeakerIdStr).emit(
      `${handlerNamespace.spaceSpeaker}:recent-user-leave`,
      {
        socketId: socket.id,
      }
    );

    logger.info(
      `User (sId: ${socket.id}) has left a space (spaceSpeakerId: ${spaceSpeakerId})`
    );
  };
  socket.on(`${handlerNamespace.spaceSpeaker}:leave`, leaveHandler);

  /**
   * Get list of participants' socket ids
   * @param payload Payload
   * @param callback Callback
   * @returns List of participants' socket ids
   */
  const getSpeakersHandler = async (
    payload: GetSpeakersPayload,
    callback: (res: GetSpeakersResponse | GetSpeakersErrorResponse) => void
  ) => {
    const { spaceSpeakerId, accessToken } = payload;

    if (!accessToken) {
      return callback({
        error: 'Access Token must be provided!',
      });
    }

    // Extract socket room's IDs
    const speakerSocketIds = io.sockets.adapter.rooms.get(
      spaceSpeakerId.toString()
    );
    // Check if room ID is available
    if (!speakerSocketIds) {
      return callback({
        error: 'SpaceSpeaker ID is not valid. Cannot get speakers',
      });
    }

    // Get speakers along with their current producerId
    const response: SpeakerDetails = {};
    // Associate speaker id with producer, user's info.
    await Promise.all(
      Object.keys(producerCollection).map(async (producerId) => {
        const { socketId } = producerCollection[producerId];
        if (speakerSocketIds?.has(socketId)) {
          try {
            const user = await getUserBySocketId(socketId, accessToken);
            if (user) {
              response[socketId] = {
                id: socketId,
                userId: user.id,
                username: user.username,
                producerId,
              };
            }
          } catch (err) {
            if (axios.isAxiosError(err)) {
              if (err.response?.status !== 401) {
                logger.error(err.message);
              }
            }
          }
        }
      })
    );
    return callback({
      speakers: response,
    });
  };
  socket.on(
    `${handlerNamespace.spaceSpeaker}:get-speakers`,
    getSpeakersHandler
  );
};
