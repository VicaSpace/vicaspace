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
        className="space-speaker-participant-img"
        src={buildUserAvatarURL(name)}
        alt="participant"
      />
      <div>{name}</div>
    </div>
  );
};

export default SpaceSpeakerUserAvatar;
