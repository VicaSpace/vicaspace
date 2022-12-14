import { collection, onSnapshot } from 'firebase/firestore';

import { Flex } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import ChatBubble from '@/components/ChatArea/ChatContainer/ChatDisplay/ChatBubble/ChatBubble';
import db from '@/lib/init-firebase';
import { useAppSelector } from '@/states/hooks';

import './ChatDisplay.css';

const ChatDisplay: React.FC<{}> = () => {
  // Space Slice
  const { username } = useAppSelector((state) => state.authSlice);

  const { id } = useParams();
  const spaceId = id?.toString();
  if (!spaceId) return null;

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef<null | HTMLDivElement>(null);
    useEffect(() => elementRef.current?.scrollIntoView());
    return <div ref={elementRef} />;
  };

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
    const unsubscribe = onSnapshot(collection(db, spaceId), (snapshot) => {
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
    <Flex
      w="100%"
      h="85%"
      overflowY="scroll"
      flexDirection="column"
      p="3"
      className="chat-display"
    >
      {username &&
        chatList.map((item) => {
          return (
            <ChatBubble
              key={item.id}
              sender={item.username === username ? 'me' : item.username}
              // username={item.username === username ? 'me' : item.username}
              username={item.username}
              message={item.message}
            />
          );
        })}
      <AlwaysScrollToBottom />
    </Flex>
  );
};

export default ChatDisplay;
