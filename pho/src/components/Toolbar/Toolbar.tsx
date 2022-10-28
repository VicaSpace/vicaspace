import React from 'react';

import './Toolbar.css';

const Toolbar: React.FC<{}> = () => {
  return (
    <div className="toolbar-container">
      <div className="toobar-item">
        <button>1</button>
      </div>
      <div className="toobar-item">
        <button>1</button>
      </div>
      <div className="toobar-item">
        <button>1</button>
      </div>
      <div className="toobar-item">
        <button>1</button>
      </div>
    </div>
  );
};

export default Toolbar;
