import PropTypes from 'prop-types';

import ChatContainer from '@/components/ChatArea/ChatContainer/ChatContainer';
import ChatUserList from '@/components/ChatArea/ChatUserList/ChatUserList';

const ChatArea: React.FC<{ username?: string }> = ({ username = '' }) => {
  return (
    <>
      <ChatUserList username={username} />
      <ChatContainer />
    </>
  );
};

ChatArea.propTypes = {
  username: PropTypes.string.isRequired,
};

export default ChatArea;
