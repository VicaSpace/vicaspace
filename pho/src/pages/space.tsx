import { Heading } from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { isNumeric } from '@/lib/number';
import { WebSocketContext } from '@/modules/ws/WebSocketProvider';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { fetchSpaceDetail } from '@/states/spaceDetail/slice';

const SpacePage: React.FC<{}> = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  // WebSocket
  const { socket } = useContext(WebSocketContext);

  // Space Slice
  const { data, error, status } = useAppSelector(
    (state) => state.spaceDetailSlice
  );
  const { name } = data;

  // SpaceSpeaker Slice

  /**
   * Assume that you'll be assigned the pageId when u first access
   * the parameterized route of space
   */

  useEffect(() => {
    if (!id || !isNumeric(id)) {
      console.error('Space ID is not a valid.');
      return;
    }
    // fetch Space here
    void dispatch(fetchSpaceDetail(Number(id)));
  }, []);

  return (
    <div>
      <Heading>
        Space #{id} - {name}
      </Heading>
      <p>#Bg-Video-Component</p>
      <p>Socket ID: {socket.id}</p>
    </div>
  );
};

export default SpacePage;
