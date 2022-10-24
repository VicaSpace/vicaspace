import PropTypes from 'prop-types';

import './ChatBubble.css';

const ChatBubble: React.FC<{
  username: string;
  message: string;
}> = ({ username, message }) => {
  return (
    <div className="chat__item">
      <div className="chat__item__content">
        <div className="chat__msg">{message}</div>
        <div className="chat__meta">
          <span className="username">{username}</span>
        </div>
      </div>
    </div>
  );
};

ChatBubble.propTypes = {
  username: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default ChatBubble;
