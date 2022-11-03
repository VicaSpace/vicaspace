import { Flex } from '@chakra-ui/react';
import React from 'react';

import ChatDisplay from '@/components/ChatArea/ChatContainer/ChatDisplay/ChatDisplay';
import ChatEditor from '@/components/ChatArea/ChatContainer/ChatEditor/ChatEditor';
import { useAppSelector } from '@/states/hooks';

import './ChatContainer.css';

const ChatContainer: React.FC<{}> = () => {
  return (
    <Flex w="100%" h="54%" mt="40px" p="20px" justify="center" align="center">
      <Flex
        w="100%"
        h="100%"
        flexDir="column"
        justify="center"
        align="center"
        backgroundColor="#D2DAFF"
        borderRadius="10px"
      >
        <ChatDisplay />
        <ChatEditor />
      </Flex>
    </Flex>
  );
};

export default ChatContainer;
