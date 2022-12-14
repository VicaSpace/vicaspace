import React, { useContext } from 'react';

import SpaceSpeakerActions from '@/components/SpaceSpeaker/SpaceSpeakerActions';
import SpaceSpeakerUserAvatar from '@/components/SpaceSpeaker/SpaceSpeakerUserAvatar';
import useSpaceSpeaker from '@/hooks/useSpaceSpeaker';
import { WebSocketContext } from '@/modules/ws/WebSocketProvider';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { joinSpaceSpeaker } from '@/states/spaceSpeaker/slice';

import './SpaceSpeakerSection.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SpaceSpeakerSectionProps {
  isDrawerOpen: boolean;
}

/**
 * Active section for SpaceSpeaker on current space
 * @returns SpaceSpeakerSection Component
 */
const SpaceSpeakerSection: React.FC<SpaceSpeakerSectionProps> = ({
  isDrawerOpen,
}) => {
  const { socket } = useContext(WebSocketContext);
  const dispatch = useAppDispatch();

  // SpaceDetail Slice
  const { id: spaceId } = useAppSelector(
    (state) => state.spaceDetailSlice.data
  );
  // Auth Slice
  const { username } = useAppSelector((state) => state.authSlice);

  // SpaceSpeaker Slice
  const { data: spaceSpeakerData } = useAppSelector(
    (state) => state.spaceSpeakerSlice
  );
  const { spaceSpeakerId, speakers } = spaceSpeakerData;

  // Use hook for setup SpaceSpeaker
  const {
    localAudioRef,
    peerAudioRefs,
    isLocalSpeaking,
    setMicStatus,
    setPeerAudioStatus,
  } = useSpaceSpeaker(spaceSpeakerId, speakers);

  return (
    <section
      className={`space-speaker-section ${
        !isDrawerOpen ? 'space-speaker-section-close' : ''
      }`}
    >
      {/* Inner container */}
      <div
        className={`space-speaker-container ${
          !isDrawerOpen ? 'space-speaker-container-close' : ''
        }`}
      >
        {/* Participants list */}
        <div
          className={`space-speaker-participant-list ${
            !isDrawerOpen ? 'space-speaker-participant-list-close' : ''
          }`}
        >
          {/* Client Audio */}
          <div>
            {speakers ? (
              <SpaceSpeakerUserAvatar
                name={username}
                isSpeaking={isLocalSpeaking}
                isDrawerOpen={isDrawerOpen}
              />
            ) : (
              <div>Join to see others!</div>
            )}

            {/* Local Audio */}
            <audio ref={localAudioRef} autoPlay muted />
          </div>
          {/* Peer Audios */}
          {speakers &&
            Object.values(speakers).map((spk) => {
              return spk.id !== socket.id ? (
                <div key={spk.id}>
                  <SpaceSpeakerUserAvatar
                    name={spk.username}
                    isSpeaking={spk.isSpeaking}
                    isDrawerOpen={isDrawerOpen}
                  />
                  {/* Local Audio */}
                  <audio ref={peerAudioRefs.current[spk.id].ref} autoPlay />
                </div>
              ) : (
                <div key={spk.id} style={{ display: 'none' }} />
              );
            })}
        </div>
        <div className="space-speaker-action-container">
          {spaceId && (
            <SpaceSpeakerActions
              spaceId={spaceId}
              spaceSpeakerId={spaceSpeakerId}
              setMicStatus={setMicStatus}
              setPeerAudioStatus={setPeerAudioStatus}
              joinSpaceSpeaker={() => dispatch(joinSpaceSpeaker(spaceId))}
              isDrawerOpen={isDrawerOpen}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default SpaceSpeakerSection;
