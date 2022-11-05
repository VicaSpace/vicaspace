import React, { useState } from 'react';
import ReactPlayer from 'react-player';

import './Video.css';

const Video: React.FC<{
  url: string;
  isMuted: boolean;
  enableToolbar: Function;
}> = ({ url, isMuted, enableToolbar }) => {
  const [loadScreenClass, setLoadScreenClass] = useState('loading-screen');

  return (
    <div className="video-container">
      <div className={loadScreenClass} />
      <ReactPlayer
        id="video"
        url={url}
        playing={true}
        muted={isMuted}
        loop={true}
        config={{
          youtube: {
            playerVars: {
              showinfo: 0,
              controls: 0,
              autoplay: 1,
              disablekb: 1,
              modestbranding: 1,
            },
          },
        }}
        onPlay={() => {
          setTimeout(() => {
            setLoadScreenClass((prev) => prev + ' hide'); // hide loading screen
            enableToolbar();
          }, 3000);
        }}
      />
    </div>
  );
};

export default Video;
