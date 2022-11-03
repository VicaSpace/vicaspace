import React, { useEffect } from 'react';

import './SpaceSpeakerUserAvatar.css';

interface SpaceSpeakerUserAvatarProps {
  imgUrl?: string;
  name?: string;
}

const SpaceSpeakerUserAvatar: React.FC<SpaceSpeakerUserAvatarProps> = ({
  imgUrl = 'https://i.imgur.com/wcASKbZ.png',
  name,
}) => {
  useEffect(() => {
    console.log('name of participant:', name);
  }, [name]);
  return (
    <div className="space-speaker-user-avatar-container">
      <img
        // Dummy key
        className="space-speaker-participant-img"
        src={imgUrl}
        alt="participant"
      />
      <div>{name}</div>
    </div>
  );
};

export default SpaceSpeakerUserAvatar;
