import { collection, onSnapshot } from 'firebase/firestore';

import React, { useEffect, useState } from 'react';

import ChatBubble from '@/components/ChatContainer/ChatDisplay/ChatBubble/ChatBubble';
import db from '@/lib/init-firebase';

import './ChatDisplay.css';

const ChatDisplay: React.FC<{ username: string }> = ({ username }) => {
  const [chatList, setChatList] = useState<
    Array<{
      id: string;
      date: Date;
      message: string;
      username: string;
    }>
  >([]);

  // sort Chat List by date ascendingly
  const sortChatListByDate = (chatItems: any) => {
    return chatItems.sort((a: any, b: any) => {
      return new Date(a.date).valueOf() - new Date(b.date).valueOf();
    });
  };

  // Listen to real-time update
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, '1'), (snapshot) => {
      const chatListSnapshot: any[] = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          date: doc.data().date.toDate(),
          message: doc.data().message,
          username: doc.data().username,
        };
      });

      setChatList(sortChatListByDate(chatListSnapshot));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="content__body">
      <div className="chat__items">
        {chatList.map((item, index) => {
          return (
            <ChatBubble
              key={item.id}
              username={item.username === username ? 'me' : item.username}
              message={item.message}
            />
          );
        })}
        <div />
      </div>
    </div>
  );
};

export default ChatDisplay;
