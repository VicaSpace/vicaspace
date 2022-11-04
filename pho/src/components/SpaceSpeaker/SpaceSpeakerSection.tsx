import React, { useContext, useState } from 'react';

import SpaceSpeakerUserAvatar from '@/components/SpaceSpeaker/SpaceSpeakerUserAvatar';
import useSpaceSpeaker from '@/hooks/useSpaceSpeaker';
import { WebSocketContext } from '@/modules/ws/WebSocketProvider';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { joinSpaceSpeaker } from '@/states/spaceSpeaker/slice';

import './SpaceSpeakerSection.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SpaceSpeakerSectionProps {}

/**
 * Active section for SpaceSpeaker on current space
 * @returns SpaceSpeakerSection Component
 */
const SpaceSpeakerSection: React.FC<SpaceSpeakerSectionProps> = () => {
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
  const { localAudioRef, peerAudioRefs, isLocalSpeaking } = useSpaceSpeaker(
    spaceSpeakerId,
    speakers
  );

  const [isMuted, setIsMuted] = useState<boolean>(false);

  return (
    <section className="space-speaker-section">
      {/* Inner container */}
      <div className="space-speaker-container">
        {/* Participants list */}
        <div className="space-speaker-participant-list">
          {/* Client Audio */}
          <div>
            {speakers ? (
              <SpaceSpeakerUserAvatar
                name={username}
                isSpeaking={isLocalSpeaking}
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
                    isSpeaking={isLocalSpeaking}
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
          {!spaceSpeakerId ? (
            <div
              className="space-speaker-action-btn"
              onClick={() => {
                // NOTE: Join with the same spaceId
                dispatch(joinSpaceSpeaker(spaceId as number));
              }}
            >
              JOIN SPACESPEAKER 🗣
            </div>
          ) : !isMuted ? (
            <div
              className="space-speaker-action-btn"
              onClick={() => {
                setIsMuted(true);
              }}
            >
              MUTE 🔇
            </div>
          ) : (
            <div
              className="space-speaker-action-btn"
              onClick={() => {
                setIsMuted(false);
              }}
            >
              UNMUTE 🔊
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SpaceSpeakerSection;
