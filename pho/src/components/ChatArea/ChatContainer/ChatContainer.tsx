import { Flex } from '@chakra-ui/react';
import React from 'react';

import ChatDisplay from '@/components/ChatArea/ChatContainer/ChatDisplay/ChatDisplay';
import ChatEditor from '@/components/ChatArea/ChatContainer/ChatEditor/ChatEditor';

import './ChatContainer.css';

const ChatContainer: React.FC<{ username: string }> = ({ username }) => {
  return (
    <Flex w="100%" h="68%" mt="5" justify="center" align="center">
      <Flex
        w="96%"
        h="100%"
        flexDir="column"
        justify="center"
        align="center"
        backgroundColor="#D2DAFF"
      >
        <ChatDisplay username={username} />
        <ChatEditor username={username} />
      </Flex>
    </Flex>
  );
};

export default ChatContainer;
