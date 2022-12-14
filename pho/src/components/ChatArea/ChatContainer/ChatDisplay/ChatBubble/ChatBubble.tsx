import PropTypes from 'prop-types';

import { Avatar, Flex, Text } from '@chakra-ui/react';

import { buildUserAvatarURL } from '@/lib/ui-avatars';

import './ChatBubble.css';

const ChatBubble: React.FC<{
  username: string;
  sender: string;
  message: string;
}> = ({ username, sender, message }) => {
  if (sender === 'me') {
    return (
      <Flex w="100%" justify="flex-end">
        <Flex
          bg="#B1B2FF"
          color="black"
          minW="100px"
          maxW="350px"
          my="1"
          p="3"
          mt="5"
          borderRadius="10px"
        >
          <Text fontSize="13">{message}</Text>
        </Flex>
      </Flex>
    );
  } else {
    return (
      <Flex w="100%">
        <Avatar
          name="Computer"
          src={buildUserAvatarURL(username)}
          bg="blue.300"
        ></Avatar>
        <Flex
          bg="gray.100"
          color="black"
          minW="100px"
          maxW="350px"
          my="1"
          p="3"
          ml="2"
          mt="5"
          fontSize="13"
          borderRadius="10px"
        >
          <Text fontWeight="bold">{username}:</Text>
          {message}
        </Flex>
      </Flex>
    );
  }
};

ChatBubble.propTypes = {
  username: PropTypes.string.isRequired,
  sender: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default ChatBubble;
