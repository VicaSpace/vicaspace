import React, { useEffect, useState } from 'react';
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi';

import './SpaceSpeakerActions.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SpaceSpeakerActionsProps {
  spaceId: number;
  spaceSpeakerId: number | undefined;
  setMicStatus: (status: 'enabled' | 'disabled') => void;
  setPeerAudioStatus: (status: 'enabled' | 'disabled') => void;
  joinSpaceSpeaker: () => void;
  isDrawerOpen: boolean;
}

const SpaceSpeakerActions: React.FC<SpaceSpeakerActionsProps> = ({
  spaceSpeakerId,
  setMicStatus,
  setPeerAudioStatus,
  joinSpaceSpeaker,
  isDrawerOpen,
}) => {
  // Pure states
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean | undefined>();

  // Handle microphone status
  useEffect(() => {
    if (!isMuted) {
      setMicStatus('enabled');
    } else {
      setMicStatus('disabled');
    }
  }, [isMuted]);

  useEffect(() => {
    if (typeof isAudioMuted === 'undefined') return;
    if (!isAudioMuted) {
      setPeerAudioStatus('enabled');
    } else {
      setPeerAudioStatus('disabled');
    }
  });

  return (
    <div className="space-speaker-actions-container">
      {spaceSpeakerId ? (
        // Action buttons
        <div className="space-speaker-actions-btn-container">
          {/* Mic */}
          <div
            className="space-speaker-actions-btn"
            onClick={() => {
              setIsMuted(!isMuted);
            }}
          >
            {isMuted ? <BiMicrophoneOff /> : <BiMicrophone />}
          </div>
          {/* Session Audio */}
          <div
            className="space-speaker-actions-btn"
            onClick={() => {
              if (typeof isAudioMuted === 'undefined') {
                setIsAudioMuted(true);
              } else {
                setIsAudioMuted(!isAudioMuted);
              }
            }}
          >
            {isAudioMuted ? (
              <GiSpeakerOff fontSize={26} />
            ) : (
              <GiSpeaker fontSize={26} />
            )}
          </div>
        </div>
      ) : (
        // Join SpaceSpeaker
        <div
          className={`space-speaker-actions-btn ${
            !isDrawerOpen ? 'space-speaker-actions-btn-close' : ''
          }`}
          onClick={joinSpaceSpeaker}
        >
          {isDrawerOpen ? `JOIN SPACESPEAKER 🗣` : `JOIN`}
        </div>
      )}
    </div>
  );
};

export default SpaceSpeakerActions;
