import {
  faCompress,
  faUsers,
  faVolumeHigh,
  faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

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
      <div className="toobar-item">
        {numberOfParticipants}
        <FontAwesomeIcon icon={faUsers} style={{ paddingLeft: '5px' }} />
      </div>
      <div className="toobar-item">
        <FontAwesomeIcon
          icon={isMuted ? faVolumeMute : faVolumeHigh}
          onClick={() => setIsMuted()}
        />
      </div>
      <div className="toobar-item">
        <FontAwesomeIcon
          icon={faCompress}
          onClick={() => {
            if (isFullscreen) {
              document.exitFullscreen().catch(console.log);
            } else {
              const element = document.getElementById('root');

              if (element !== null) {
                element.requestFullscreen().catch(console.log);
              }
            }
            setIsFullscreen(!isFullscreen);
          }}
        />
      </div>
    </div>
  );
};

export default Toolbar;
