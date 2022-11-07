import React, { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SpaceSpeakerActionsProps {
  spaceId: number;
  spaceSpeakerId: number | undefined;
  setMicStatus: (status: 'enabled' | 'disabled') => void;
  joinSpaceSpeaker: () => void;
}

const SpaceSpeakerActions: React.FC<SpaceSpeakerActionsProps> = ({
  spaceSpeakerId,
  setMicStatus,
  joinSpaceSpeaker,
}) => {
  // Pure states
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Handle microphone status
  useEffect(() => {
    if (!isMuted) {
      setMicStatus('enabled');
    } else {
      setMicStatus('disabled');
    }
  }, [isMuted]);

  /**
   * Render mute/unmute component
   * @param isMuted Is Muted
   * @returns Mute Button Actions
   */
  const renderMuteActionComponent = (isMuted: boolean) => {
    if (!isMuted) {
      return (
        <div
          className="space-speaker-action-btn"
          onClick={() => {
            setIsMuted(true);
          }}
        >
          MUTE 🔇
        </div>
      );
    }
    return (
      <div
        className="space-speaker-action-btn"
        onClick={() => {
          setIsMuted(false);
        }}
      >
        UNMUTE 🔊
      </div>
    );
  };

  return (
    <div className="space-speaker-action-container">
      {!spaceSpeakerId && (
        <div className="space-speaker-action-btn" onClick={joinSpaceSpeaker}>
          JOIN SPACESPEAKER 🗣
        </div>
      )}
      {spaceSpeakerId && renderMuteActionComponent(isMuted)}
    </div>
  );
};

export default SpaceSpeakerActions;
