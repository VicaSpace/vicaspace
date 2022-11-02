import {
  faCompress,
  faUsers,
  faVolumeHigh,
  faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import './Toolbar.css';

const Toolbar: React.FC<{
  numberOfParticipants: number;
  setIsMuted: Function;
  isMuted: boolean;
}> = ({ numberOfParticipants, setIsMuted, isMuted }) => {
  return (
    <div className="toolbar-container">
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
        <FontAwesomeIcon icon={faCompress} />
      </div>
    </div>
  );
};

export default Toolbar;
