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
  visible: boolean;
}> = ({ numberOfParticipants, setIsMuted, isMuted, visible }) => {
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
        <FontAwesomeIcon icon={faCompress} />
      </div>
    </div>
  );
};

export default Toolbar;
