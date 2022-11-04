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
import { calculateTimeGap } from '@/states/pomodoro/slice';
import { fetchSpaceDetail } from '@/states/spaceDetail/slice';

import './space.css';

const SpacePage: React.FC<{}> = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  // Space Slice
  const { data } = useAppSelector((state) => state.spaceDetailSlice);
  const { name, members, urlVideo, startTime, urlSpotify } = data;

  const isAuthenticated = useAppSelector(
    (state) => state.authSlice.isAuthenticated
  );

  const timeGap = useAppSelector((state) => state.pomodoroSlice.timeGap);

  const [updatedSpaceId, setUpdatedSpaceId] = useState<boolean>(false);

  /**
   * Assume that you'll be assigned the pageId when u first access
   * the parameterized route of space
   */

  useEffect(() => {
    // fetch Space every 5 seconds
    setInterval(() => {
      void dispatch(fetchSpaceDetail(Number(id)));
    }, 5000);
  }, []);

  useEffect(() => {
    if (!id || !isNumeric(id)) {
      console.error('Space ID is not a valid.');
      return;
    }
    if (!updatedSpaceId) {
      updateUserSpaceId(parseInt(id))
        .then(() => {
          setUpdatedSpaceId(true);
          void dispatch(calculateTimeGap(0));
          void dispatch(fetchSpaceDetail(Number(id)));
        })
        .catch(console.log);
    }
    return () => {
      if (updatedSpaceId) {
        updateUserSpaceId(null).catch(console.log);
      }
    };
  }, [updatedSpaceId]);

  useBeforeunload(() => {
    if (updatedSpaceId) {
      updateUserSpaceId(null)
        .then(() => {
          setUpdatedSpaceId(false);
        })
        .catch(console.log);
    }
  });

  useEffect(() => {
    if (!id || !isNumeric(id)) {
      console.error('Space ID is not a valid.');
      return;
    }
    if (isAuthenticated) {
      updateUserSpaceId(parseInt(id))
        .then(() => {
          setUpdatedSpaceId(true);
          void dispatch(calculateTimeGap(0));
          void dispatch(fetchSpaceDetail(Number(id)));
        })
        .catch(console.log);
    }
  }, [isAuthenticated]);

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
          {isVideoVisible && (
            <div style={{ position: 'absolute' }}>
              <Pomodoro
                shortBreakDuration={2}
                pomodoroDuration={5}
                longBreakDuration={10}
                timestamp={new Date(startTime ?? '').getTime()}
                serverTime={Date.now() + timeGap}
              />
            </div>
          )}
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
