import { AddIcon } from '@chakra-ui/icons';
import axios from 'axios';
import PropTypes from 'prop-types';

import { Avatar, Button, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import UserCell from '@/components/ChatArea/ChatUserList/UserCell/UserCell';

const ChatUserList: React.FC<{ username: string }> = ({ username }) => {
  const URL = process.env.REACT_APP_BACKEND_URL ?? '';
  const [spaceUserList, setSpaceUserList] = useState<
    Array<{ id: number; username: string }>
  >([]);

  useEffect(() => {
    const fetchSpaceInfo = async (spaceId: number) => {
      const res = await axios.get(`${URL}/api/spaces/${spaceId}`);
      const userList = res.data.members;
      setSpaceUserList(userList);
    };

    fetchSpaceInfo(1).catch((e) => {
      console.log(e);
    });
  }, []);

  return (
    <Flex w="100%" h="30%" justify="center" align="center">
      <Flex
        w="96%"
        h="100%"
        flexDir="column"
        justify="center"
        align="center"
        backgroundColor="#D2DAFF"
        mt="5"
      >
        <SimpleGrid
          w="90%"
          h="80%"
          minChildWidth="70px"
          gap="5"
          alignItems="center"
          justifyItems="center"
        >
          {spaceUserList.slice(0, 9).map((member) => {
            return <UserCell key={member.id} username={member.username} />;
          })}
          {spaceUserList.length > 9 ? (
            <Avatar
              size="lg"
              alignItems="center"
              icon={<AddIcon fontSize="12" />}
              bg="#B1B2FF"
            >
              <Text ml="1" fontSize="22">
                {spaceUserList.length - 9}
              </Text>
            </Avatar>
          ) : null}
        </SimpleGrid>
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
