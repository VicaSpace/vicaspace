import { Socket, io } from 'socket.io-client';

import React, { useEffect, useState } from 'react';

import config from '@/config';
import { updateUserSocketId } from '@/lib/apis/user';

// Initialize connection to WebSocket
const socket = io(config.endpoint.bunchaWs, {
  closeOnBeforeunload: false,
});

/**
 * Context for WebSocket connection
 */
export const WebSocketContext = React.createContext<{
  socket: Socket<any, any>;
  isConnected: boolean;
  socketId: string | null;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  socket,
  isConnected: false,
  socketId: null,
  setIsConnected: () => {},
});

interface WebSocketProviderProps {
  children: JSX.Element;
}

/**
 * Provider Component for WebSocket Context
 * @param params Children
 * @returns Provider Component
 */
const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [socketId, setSocketId] = useState<string | null>(null);

  /// Handle connection of Socket
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected!');
      setIsConnected(true);
    });

    socket.on('connect-success', ({ socketId }) => {
      setSocketId(socketId);
    });

    return () => {
      socket.off('connect');
      socket.off('connect-success');
    };
  }, [socket]);

  /// Update user socket ID on connection
  useEffect(() => {
    if (!socketId) return;
    updateUserSocketId(socketId).catch(console.error);
    console.log(`Update user socket id (${socketId}) on connection.`);
  }, [socketId]);

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        isConnected,
        socketId,
        setIsConnected,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
