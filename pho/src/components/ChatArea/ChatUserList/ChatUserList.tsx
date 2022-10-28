import PropTypes from 'prop-types';

import { Button, Flex } from '@chakra-ui/react';

import UserCell from '@/components/ChatArea/ChatUserList/UserCell/UserCell';

const ChatUserList: React.FC<{ username: string }> = ({ username }) => {
  return (
    <Flex w="100%" h="28%" justify="center" align="center">
      <Flex
        w="90%"
        h="100%"
        flexDir="column"
        justify="center"
        align="center"
        backgroundColor="#D2DAFF"
        mt="5"
      >
        <Flex w="95%" h="75%" justify="center" align="center">
          <UserCell />
          <UserCell />
          <UserCell />
          <UserCell />
          <UserCell />
        </Flex>
        <Flex w="95%" h="20%" justifyContent="flex-end" mt="2">
          <Button
            bg="#B1B2FF"
            color="white"
            borderRadius="10px"
            padding="4"
            _hover={{
              bg: 'white',
              color: 'black',
              border: '1px solid black',
            }}
          >
            Mute
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

ChatUserList.propTypes = {
  username: PropTypes.string.isRequired,
};

export default ChatUserList;
