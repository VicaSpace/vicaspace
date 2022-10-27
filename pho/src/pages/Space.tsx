import { Heading } from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { isNumeric } from '@/lib/number';
import { WebSocketContext } from '@/modules/ws/WebSocketProvider';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { joinSpace } from '@/states/spaceDetail/slice';

const SpacePage: React.FC<{}> = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  // WebSocket
  const { socket, isConnected } = useContext(WebSocketContext);

  const { data, error } = useAppSelector((state) => state.spaceDetailSlice);
  const { name, spaceId } = data;

  /**
   * Assume that you'll be assigned the pageId when u first access
   * the parameterized route of space
   */

  useEffect(() => {
    if (!id || !isNumeric(id)) {
      console.error('Space ID is not a valid.');
      return;
    }
    dispatch(joinSpace(Number(id)));
  }, []);

  return (
    <div>
      <Heading>Space #{id}</Heading>
      <p>#Bg-Video-Component</p>
      <p>Socket ID: {socket.id}</p>
      <p>Socket Connection: {isConnected ? 'OK' : 'NO'}</p>
    </div>
  );
};

export default SpacePage;
