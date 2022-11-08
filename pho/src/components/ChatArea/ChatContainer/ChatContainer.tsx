import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { AiOutlineMessage } from 'react-icons/ai';

import ChatDisplay from '@/components/ChatArea/ChatContainer/ChatDisplay/ChatDisplay';
import ChatEditor from '@/components/ChatArea/ChatContainer/ChatEditor/ChatEditor';

import './ChatContainer.css';

interface ChatContainerProps {
  isDrawerOpen: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ isDrawerOpen }) => {
  return (
    <Flex
      w="100%"
      h="50%"
      p="0px 20px 20px 20px"
      justify="center"
      align="center"
      className={`${!isDrawerOpen ? 'chat-container-placeholder' : ''}`}
    >
      <Flex
        w="100%"
        h="100%"
        flexDir="column"
        justify="center"
        align="center"
        backgroundColor="#D2DAFF"
        borderRadius="10px"
      >
        {isDrawerOpen ? (
          <>
            <ChatDisplay />
            <ChatEditor />
          </>
        ) : (
          <Box>
            <AiOutlineMessage size={30} />
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export default ChatContainer;
