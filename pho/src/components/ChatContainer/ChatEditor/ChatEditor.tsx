import { Timestamp, addDoc, collection } from 'firebase/firestore';
import PropTypes from 'prop-types';

import { useState } from 'react';

import db from '@/lib/init-firebase';

import './ChatEditor.css';

const ChatEditor: React.FC<{ username: string }> = ({ username }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    if (message.trim().length === 0) return;
    await addDoc(collection(db, '1'), {
      date: Timestamp.fromDate(new Date()),
      message,
      username,
    });

    setMessage(''); // reset
  };

  return (
    <div className="content__footer">
      <div className="sendNewMessage">
        <input
          type="text"
          placeholder="Type a message here"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button
          onClick={() => {
            void handleSendMessage();
          }}
          className="btnSendMsg"
          id="sendMsgBtn"
        >
          <i className="fa fa-paper-plane">Send</i>
        </button>
      </div>
    </div>
  );
};

ChatEditor.propTypes = {
  username: PropTypes.string.isRequired,
};

export default ChatEditor;
