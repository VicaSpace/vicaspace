import clsx from 'clsx';

import React from 'react';

import { buildUserAvatarURL } from '@/lib/ui-avatars';

import './SpaceSpeakerUserAvatar.css';

interface SpaceSpeakerUserAvatarProps {
  name?: string;
  isSpeaking: boolean;
}

/**
 * Component for User Avatar in SpaceSpeaker
 */
const SpaceSpeakerUserAvatar: React.FC<SpaceSpeakerUserAvatarProps> = ({
  name,
  isSpeaking,
}) => {
  return (
    <div className="space-speaker-user-avatar-container">
      <img
        // Dummy key
        className={clsx({
          'space-speaker-participant-img': true,
          'audio-active': isSpeaking,
        })}
        src={buildUserAvatarURL(name)}
        alt="speaker-avatar"
      />
      <div>{name}</div>
    </div>
  );
};

export default SpaceSpeakerUserAvatar;
