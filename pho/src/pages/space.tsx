import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Pomodoro from '@/components/Pomodoro/Pomodoro';
import Toolbar from '@/components/Toolbar/Toolbar';
import Video from '@/components/VideoContainer/Video';
import { isNumeric } from '@/lib/number';
import { WebSocketContext } from '@/modules/ws/WebSocketProvider';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { fetchSpaceDetail } from '@/states/spaceDetail/slice';

import './Space.css';

const SpacePage: React.FC<{}> = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  // WebSocket
  const { socket } = useContext(WebSocketContext);

  // Space Slice
  const { data, error, status } = useAppSelector(
    (state) => state.spaceDetailSlice
  );

  const { name, members, urlVideo, startTime } = data;

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

  const [isMusicMuted, setIsMusicMuted] = useState(true);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  return (
    <div>
      <div
        className="location-name-box"
        style={isVideoVisible ? {} : { display: 'none' }}
      >
        <div className="location-text">{name}</div>
      </div>

      <div
        style={isVideoVisible ? { position: 'absolute' } : { display: 'none' }}
      >
        <Pomodoro
          timestamp={new Date(startTime ?? '').getTime()}
          serverTime={Date.now()} // TODO: get server time from API
        />
      </div>

      <Toolbar
        numberOfParticipants={(members ?? []).length}
        isMuted={isMusicMuted}
        setIsMuted={() => setIsMusicMuted(!isMusicMuted)}
        visible={isVideoVisible}
      />
      <Video
        url={urlVideo ?? ''}
        isMuted={isMusicMuted}
        enableToolbar={() => setIsVideoVisible(true)}
      />
    </div>
  );
};

export default SpacePage;
