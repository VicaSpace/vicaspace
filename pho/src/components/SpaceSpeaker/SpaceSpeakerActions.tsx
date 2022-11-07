import React, { useEffect, useState } from 'react';
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';

import './SpaceSpeakerActions.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SpaceSpeakerActionsProps {
  spaceId: number;
  spaceSpeakerId: number | undefined;
  setMicStatus: (status: 'enabled' | 'disabled') => void;
  setPeerAudioStatus: (status: 'enabled' | 'disabled') => void;
  joinSpaceSpeaker: () => void;
}

const SpaceSpeakerActions: React.FC<SpaceSpeakerActionsProps> = ({
  spaceSpeakerId,
  setMicStatus,
  setPeerAudioStatus,
  joinSpaceSpeaker,
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
            {isAudioMuted ? <HiSpeakerXMark /> : <HiSpeakerWave />}
          </div>
        </div>
      ) : (
        // Join SpaceSpeaker
        <div className="space-speaker-actions-btn" onClick={joinSpaceSpeaker}>
          JOIN SPACESPEAKER 🗣
        </div>
      )}
    </div>
  );
};

export default SpaceSpeakerActions;
