import React, { useState } from 'react';
import { FaCompress, FaUsers, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

import './Toolbar.css';

const Toolbar: React.FC<{
  numberOfParticipants: number;
  setIsMuted: Function;
  isMuted: boolean;
  visible: boolean;
}> = ({ numberOfParticipants, setIsMuted, isMuted, visible }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  return (
    <div
      className="toolbar-container"
      style={visible ? {} : { display: 'none' }}
    >
      <div className="toolbar-item">
        {numberOfParticipants}
        <FaUsers style={{ paddingLeft: '5px' }} />
      </div>
      <div className="toolbar-item">
        {isMuted ? (
          <FaVolumeMute onClick={() => setIsMuted()} />
        ) : (
          <FaVolumeUp onClick={() => setIsMuted()} />
        )}
      </div>
      <div className="toolbar-item">
        <FaCompress
          onClick={() => {
            if (isFullscreen) {
              document.exitFullscreen().catch(console.log);
            } else {
              document.body.requestFullscreen().catch(console.log);
            }
            setIsFullscreen(!isFullscreen);
          }}
        />
      </div>
    </div>
  );
};

export default Toolbar;
