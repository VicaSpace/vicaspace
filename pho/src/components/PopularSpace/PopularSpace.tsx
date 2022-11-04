/* eslint-disable @typescript-eslint/restrict-template-expressions */
import axios from 'axios';
import PropTypes from 'prop-types';

import {
  Avatar,
  Box,
  Flex,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import logo from '@/asset/vicaspace-logo.png';
import SpaceCell from '@/components/PopularSpace/SpaceCell/SpaceCell';
import { useAppSelector } from '@/states/hooks';

const PopularSpace: React.FC<{}> = () => {
  const username = useAppSelector((state) => state.authSlice.username);

  const URL = process.env.REACT_APP_BACKEND_URL ?? '';

  const [spaces, setSpaces] = useState<any[]>([]);

  useEffect(() => {
    const fetchSpaces = async () => {
      const spaces = (await axios.get(`${URL}/api/spaces/`)).data;
      setSpaces(spaces);
    };

    fetchSpaces().catch((e) => {
      console.log(e);
    });
  }, []);

  return (
    <VStack w="100%" h="100%" spacing="0">
      <Flex
        w="100%"
        h="10%"
        bgColor="red"
        padding="2% 5%"
        backgroundColor="#EEF1FF"
      >
        <HStack w="100%" h="100%">
          <Avatar src={`https://i.pravatar.cc/150?u=${username}`} size="lg" />
          <VStack w="50%" align="left" pl="2">
            <Heading size="md">{username}</Heading>
            <Text>Online</Text>
          </VStack>
        </HStack>
      </Flex>
      <Flex w="100%" h="7%" bgColor="#D2DAFF" pl="5%" align="center">
        <Heading
          w="70%"
          size="lg"
          fontWeight="semibold"
          fontFamily="Inconsolata"
        >
          Popular Spaces
        </Heading>
        <Box
          w="30%"
          h="100%"
          textAlign="center"
          color="white"
          cursor="pointer"
          bgColor="#B1B2FF"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Heading fontFamily="Inconsolata" size="lg" fontWeight="medium">
            NEW
          </Heading>
        </Box>
      </Flex>
      <Flex
        w="100%"
        h="75%"
        bgColor="blue"
        padding="0% 5%"
        pt="10"
        backgroundColor="#AAC4FF"
      >
        <VStack w="100%" h="90%" spacing="8">
          {spaces.map((space) => {
            return <SpaceCell key={space.id} space={space} />;
          })}
        </VStack>
      </Flex>
      <Box
        w="100%"
        h="10%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Image src={logo} alt="Vicaspace logo" boxSize="70px" />
      </Box>
    </VStack>
  );
};

PopularSpace.propTypes = {
  username: PropTypes.string.isRequired,
};

export default PopularSpace;
