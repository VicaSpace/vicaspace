import axios from 'axios';

import config from '@/config';
import { socketCollection } from '@/data/collections';
import { logger } from '@/lib/logger';
import { IOConnection, SocketConnection } from '@/lib/types/ws';

export const registerConnHandlers = (
  _io: IOConnection,
  socket: SocketConnection
) => {
  /// Handles disconnection of socket from server
  const disconnectHandler = async () => {
    logger.info(`User (socketId: ${socket.id}) has disconnected from socket`);
    // Remove peers from collection
    await axios.patch(`${config.endpoint.banhmiApi}/users/spaceId`, {
      spaceId: null,
      socketId: socket.id,
    });
    delete socketCollection[socket.id];
  };
  socket.on('disconnect', disconnectHandler);

  /// Handles ping event of socket to server
  const pingHandler = () => {
    logger.info('Server has been ping!');
    socket.emit('pong');
  };
  socket.on('ping', pingHandler);
};
