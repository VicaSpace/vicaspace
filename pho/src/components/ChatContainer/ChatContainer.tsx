import React from 'react';

import ChatDisplay from '@/components/ChatContainer/ChatDisplay/ChatDisplay';
import ChatEditor from '@/components/ChatContainer/ChatEditor/ChatEditor';

import './ChatContainer.css';

const ChatContainer: React.FC<{ username: string }> = ({ username }) => {
  return (
    <div className="chat-container">
      <div className="main__chatcontent">
        <ChatDisplay username={username} />
      </div>
      <ChatEditor username={username} />
    </div>
  );
};

export default ChatContainer;
