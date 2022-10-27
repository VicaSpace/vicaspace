import React from 'react';

import './SpaceSpeakerSection.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SpaceSpeakerSectionProps {}

const SpaceSpeakerSection: React.FC<SpaceSpeakerSectionProps> = () => {
  return (
    <section className="space-speaker-section">
      {/* Inner container */}
      <div className="space-speaker-container">
        {/* Participants list */}
        <div className="space-speaker-participant-list">
          {/* Participant Img */}
          {new Array(6).fill(0).map((_) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <img
                className="space-speaker-participant-img"
                src="https://pickaface.net/gallery/avatar/Garret22785730d3a8d5525.png"
                alt="participant"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpaceSpeakerSection;