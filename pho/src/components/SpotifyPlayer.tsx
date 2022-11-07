import React from 'react';

const SpotifyPlayer: React.FC<{
  url: string;
}> = ({ url }) => {
  return (
    <iframe
      style={{ borderRadius: '12px' }}
      src={url}
      width="100%"
      height="80"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    ></iframe>
  );
};

export default SpotifyPlayer;
