import { Socket, io } from 'socket.io-client';

import React, { useEffect, useState } from 'react';

import config from '@/config';
import { updateUserSocketId } from '@/lib/apis/user';
import { useAppSelector } from '@/states/hooks';

// Initialize connection to WebSocket
const socket = io(config.endpoint.buncha, {
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

  // Auth Slice
  const { isAuthenticated } = useAppSelector((state) => state.authSlice);

  /// Handle connection of Socket
  useEffect(() => {
    socket.on('connect', () => {
      console.log('WebSocket connected!');
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

  /// Update user socket ID on connection for authorized user
  useEffect(() => {
    if (!socketId || !isAuthenticated) return;
    updateUserSocketId(socketId).catch(console.error);
  }, [socketId, isAuthenticated]);

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
