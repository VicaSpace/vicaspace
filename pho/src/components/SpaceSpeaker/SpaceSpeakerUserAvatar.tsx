import clsx from 'clsx';

import React from 'react';

import { buildUserAvatarURL } from '@/lib/ui-avatars';

import './SpaceSpeakerUserAvatar.css';

interface SpaceSpeakerUserAvatarProps {
  name?: string;
}

/**
 * Component for User Avatar in SpaceSpeaker
 */
const SpaceSpeakerUserAvatar: React.FC<SpaceSpeakerUserAvatarProps> = ({
  name,
}) => {
  return (
    <div className="space-speaker-user-avatar-container">
      <img
        // Dummy key
        className={clsx({
          'space-speaker-participant-img': true,
          active: true,
        })}
        src={buildUserAvatarURL(name)}
        alt="speaker-avatar"
      />
      <div>{name}</div>
    </div>
  );
};

export default SpaceSpeakerUserAvatar;
