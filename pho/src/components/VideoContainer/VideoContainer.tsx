import { useState } from 'react';

import Toolbar from '@/components/Toolbar/Toolbar';
import Video from '@/components/VideoContainer/Video';

/**
 * Just a dummy component to integrate toolbar and video screen
 * Only for testing purpose
 * Will delete after merging SpaceComponent
 */

const VideoContainer: React.FC<{}> = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Toolbar
        numberOfParticipants={10}
        isMuted={isMuted}
        setIsMuted={() => setIsMuted(!isMuted)}
        visible={visible}
      />
      <Video
        url="https://www.youtube.com/watch?v=cDYzwFEFLvQ"
        isMuted={isMuted}
        enableToolbar={() => setVisible(true)}
      />
    </>
  );
};

export default VideoContainer;
