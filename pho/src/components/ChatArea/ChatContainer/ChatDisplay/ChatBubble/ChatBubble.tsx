import PropTypes from 'prop-types';

import { Avatar, Flex, Text } from '@chakra-ui/react';

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
          mt="2"
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
          src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
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
          mt="2"
          fontSize="13"
        >
          <Text>
            <Text fontWeight="bold">{username}:</Text>
            {message}
          </Text>
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
