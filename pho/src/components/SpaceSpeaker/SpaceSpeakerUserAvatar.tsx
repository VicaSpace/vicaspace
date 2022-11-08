import clsx from 'clsx';

import React from 'react';

import { buildUserAvatarURL } from '@/lib/ui-avatars';

import './SpaceSpeakerUserAvatar.css';

interface SpaceSpeakerUserAvatarProps {
  name?: string;
  isSpeaking: boolean;
  isDrawerOpen: boolean;
}

/**
 * Component for User Avatar in SpaceSpeaker
 */
const SpaceSpeakerUserAvatar: React.FC<SpaceSpeakerUserAvatarProps> = ({
  name,
  isSpeaking,
  isDrawerOpen,
}) => {
  return (
    <div
      className={`space-speaker-user-avatar-container ${
        !isDrawerOpen ? 'space-speaker-user-avatar-container-close' : ''
      }`}
    >
      <img
        // Dummy key
        className={clsx({
          'space-speaker-participant-img': true,
          'audio-active': isSpeaking,
          'space-speaker-participant-img-close': !isDrawerOpen,
        })}
        src={buildUserAvatarURL(name)}
        alt="speaker-avatar"
      />
      <div
        className={`space-speaker-participant-username ${
          !isDrawerOpen ? 'space-speaker-participant-username-close' : ''
        }`}
      >
        {name}
      </div>
    </div>
  );
};

export default SpaceSpeakerUserAvatar;
