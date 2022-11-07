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
      <button className="toolbar-item" onClick={() => setIsMuted()}>
        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
      </button>
      <button
        className="toolbar-item"
        onClick={() => {
          if (isFullscreen) {
            document.exitFullscreen().catch(console.log);
          } else {
            document.body.requestFullscreen().catch(console.log);
          }
          setIsFullscreen(!isFullscreen);
        }}
      >
        <FaCompress />
      </button>
    </div>
  );
};

export default Toolbar;
