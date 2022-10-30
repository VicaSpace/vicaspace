import config from '@/config';
import { producerCollection, socketCollection } from '@/data/collections';
import { logger } from '@/lib/logger';
import {
  GetSpeakersErrorResponse,
  GetSpeakersPayload,
  GetSpeakersResponse,
  JoinPayload,
  SpeakerDetails,
} from '@/lib/types/handlers/space';
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
  const joinHandler = async (payload: JoinPayload, callback: () => void) => {
    const { spaceSpeakerId, producerId } = payload;
    logger.info(
      `socketId ${socket.id}) has joined a space (spaceId: ${spaceSpeakerId})`
    );

    const spaceIdStr = spaceSpeakerId.toString();
    // Assign socket to a specific space
    await socket.join(spaceIdStr);
    // Add spaceId to room
    socketCollection[socket.id].spaceSpeakerId = spaceSpeakerId;

    // Broadcast recent joined user to all sockets in space
    io.to(spaceIdStr).emit(
      `${handlerNamespace.spaceSpeaker}:recent-user-join`,
      {
        socketId: socket.id,
        producerId,
        msg: `User (socketId: ${socket.id}) has joined the SpaceSpeaker.`,
      }
    );

    callback();
  };
  socket.on(`${handlerNamespace.spaceSpeaker}:join`, joinHandler);

  /**
   * Handles leaving current space
   */
  const leaveHandler = async () => {
    const { spaceSpeakerId } = socketCollection[socket.id];
    if (!spaceSpeakerId) {
      logger.warn(
        `User (socketId: ${socket.id}) cannot leave space as 'spaceId' is empty`
      );
      return;
    }
    // Unassign socket from a specific space
    const curSpaceIdStr = spaceSpeakerId.toString();
    await socket.leave(curSpaceIdStr);

    // Delete spaceId to room
    delete socketCollection[socket.id].spaceSpeakerId;
    // Broadcast recent left user to all sockets in space
    io.to(curSpaceIdStr).emit(
      `${handlerNamespace.spaceSpeaker}:recent-user-leave`,
      {
        socketId: socket.id,
        msg: `User (socketId: ${socket.id}) has left the space.`,
      }
    );

    logger.info(
      `User (socketId: ${socket.id}) has left a space (spaceId: ${spaceSpeakerId})`
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
    const { spaceSpeakerId } = payload;
    const speakerSocketIds = io.sockets.adapter.rooms.get(
      spaceSpeakerId.toString()
    );

    if (!speakerSocketIds) {
      return callback({
        error: 'SpaceSpeaker ID is not valid. Cannot get speakers',
      });
    }

    // Get speakers along with their current producerId
    const response: SpeakerDetails = {};
    // Associate speaker id with producer.
    Object.keys(producerCollection).forEach((producerId) => {
      const { socketId } = producerCollection[producerId];
      if (speakerSocketIds?.has(socketId)) {
        response[socketId] = {
          id: socketId,
          producerId,
        };
      }
    });
    return callback({
      speakers: response,
    });
  };
  socket.on(
    `${handlerNamespace.spaceSpeaker}:get-speakers`,
    getSpeakersHandler
  );
};
