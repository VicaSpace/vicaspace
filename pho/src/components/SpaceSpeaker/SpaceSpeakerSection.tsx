import React, { useContext, useState } from 'react';

import SpaceSpeakerUserAvatar from '@/components/SpaceSpeaker/SpaceSpeakerUserAvatar';
import useSpaceSpeaker from '@/hooks/useSpaceSpeaker';
import { WebSocketContext } from '@/modules/ws/WebSocketProvider';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { joinSpaceSpeaker } from '@/states/spaceSpeaker/slice';

import './SpaceSpeakerSection.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SpaceSpeakerSectionProps {}

const SpaceSpeakerSection: React.FC<SpaceSpeakerSectionProps> = () => {
  const { socket } = useContext(WebSocketContext);
  const dispatch = useAppDispatch();
  // SpaceDetail Slice
  const { id } = useAppSelector((state) => state.spaceDetailSlice.data);

  // SpaceSpeaker Slice
  const { data: spaceSpeakerData } = useAppSelector(
    (state) => state.spaceSpeakerSlice
  );
  const { spaceSpeakerId, speakers } = spaceSpeakerData;

  // Use hook for setup SpaceSpeaker
  const { localAudioRef, peerAudioRefs } = useSpaceSpeaker(
    spaceSpeakerId,
    speakers
  );

  const [isMuted, setIsMuted] = useState<boolean>(false);

  return (
    <section className="space-speaker-section">
      {/* Inner container */}
      <div className="space-speaker-container">
        {/* Participants list */}
        {/* Blur participation List before joining! */}
        <div className="space-speaker-participant-list">
          {/* Client Avatar */}
          <div>
            <SpaceSpeakerUserAvatar />
            {/* Local Audio */}
            <audio ref={localAudioRef} autoPlay muted />
          </div>
          {/* Participant/Peer Avatar */}
          {speakers &&
            Object.values(speakers).map((p) => {
              return p.id !== socket.id ? (
                <div key={p.id}>
                  <SpaceSpeakerUserAvatar />
                  {/* Local Audio */}
                  <audio ref={peerAudioRefs.current[p.id].ref} autoPlay />
                </div>
              ) : (
                <div key={p.id} style={{ display: 'none' }} />
              );
            })}
        </div>
        <div className="space-speaker-action-container">
          {!spaceSpeakerId ? (
            <div
              className="space-speaker-action-btn"
              onClick={() => {
                dispatch(joinSpaceSpeaker(id as number));
              }}
            >
              JOIN SPACESPEAKER 🗣
            </div>
          ) : isMuted ? (
            <div
              className="space-speaker-action-btn"
              onClick={() => {
                setIsMuted(!isMuted);
              }}
            >
              MUTE 🔇
            </div>
          ) : (
            <div
              className="space-speaker-action-btn"
              onClick={() => {
                setIsMuted(!isMuted);
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
