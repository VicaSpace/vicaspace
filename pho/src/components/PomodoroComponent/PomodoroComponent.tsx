import React from 'react';
import Draggable from 'react-draggable';

import './PomodoroComponent.css';

const PomodoroComponent: React.FC<{}> = () => {
  return (
    <Draggable
      handle=".handle"
      defaultPosition={{ x: 100, y: 100 }}
      grid={[25, 25]}
      scale={1}
    >
      <div>
        <div className="handle">Drag from here</div>
        <div>This readme is really dragging on...</div>
      </div>
    </Draggable>
  );
};

export default PomodoroComponent;
