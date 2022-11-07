import React, { useEffect, useState } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { useParams } from 'react-router-dom';

import DrawerComponent from '@/components/DrawerComponent';
import Pomodoro from '@/components/Pomodoro/Pomodoro';
import SpotifyPlayer from '@/components/SpotifyPlayer';
import Toolbar from '@/components/Toolbar/Toolbar';
import Video from '@/components/VideoContainer/Video';
import { updateUserSpaceId } from '@/lib/apis/user';
import { isNumeric } from '@/lib/number';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { fetchSpaceDetail } from '@/states/spaceDetail/slice';

import './space.css';

const SpacePage: React.FC<{}> = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  // Space Slice
  const { data, error, status } = useAppSelector(
    (state) => state.spaceDetailSlice
  );
  const { name, members, urlVideo, startTime, urlSpotify } = data;

  /**
   * Assume that you'll be assigned the pageId when u first access
   * the parameterized route of space
   */

  useEffect(() => {
    if (!id || !isNumeric(id)) {
      console.error('Space ID is not a valid.');
      return;
    }
    updateUserSpaceId(parseInt(id))
      .then(() => {
        void dispatch(fetchSpaceDetail(Number(id)));
      })
      .catch(console.log);
    return () => {
      updateUserSpaceId(null).catch(console.log);
    };
  }, []);

  useBeforeunload(() => {
    updateUserSpaceId(null).catch(console.log);
  });

  const [isMusicMuted, setIsMusicMuted] = useState(true);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  return (
    <div>
      <DrawerComponent />
      {isVideoVisible && (
        <>
          <div className="location-name-box">
            <div className="location-text">{name}</div>
          </div>
          <div style={{ position: 'absolute' }}>
            <Pomodoro
              shortBreakDuration={2}
              pomodoroDuration={5}
              longBreakDuration={10}
              timestamp={new Date(startTime ?? '').getTime()}
              serverTime={Date.now()} // TODO: get server time from API
            />
          </div>
          <div className="music-player-container">
            <SpotifyPlayer url={urlSpotify ?? ''} />
          </div>
        </>
      )}

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
