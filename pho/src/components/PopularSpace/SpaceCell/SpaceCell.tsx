import axios from 'axios';
import PropTypes from 'prop-types';

import {
  Box,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import LinesEllipsis from 'react-lines-ellipsis';

import noOnlUsersIcon from '@/asset/noOnlUsersIcon.png';
import SpaceModal from '@/components/WorldMap/SpaceModal';
import { GetSpaceDetailResponse } from '@/lib/apis/space';

const SpaceCell: React.FC<{ space: GetSpaceDetailResponse }> = ({ space }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const URL = process.env.REACT_APP_BACKEND_URL ?? '';
  const [spaceInfo, setSpaceInfo] = useState<GetSpaceDetailResponse>();

  useEffect(() => {
    const fetchSpaceInfo = async () => {
      const spaceInfo = (await axios.get(`${URL}/api/spaces/${space.id}`)).data;
      setSpaceInfo(spaceInfo);
    };

    fetchSpaceInfo().catch((e) => {
      console.log(e);
    });
  }, []);

  return (
    <VStack
      w="100%"
      h="80px"
      backgroundColor="#FFFFFF"
      borderRadius="10px"
      p="10px 20px"
      cursor="pointer"
      _hover={{
        border: '1px solid black',
      }}
      onClick={onOpen}
    >
      <HStack w="100%" h="50%">
        <Heading w="70%" size="md" fontFamily="Inconsolata" float="left">
          {spaceInfo ? spaceInfo.name : ''}
        </Heading>
        <HStack w="30%" justify="right">
          <Image src={noOnlUsersIcon} />
          <Text>{spaceInfo ? spaceInfo.members.length : 0}</Text>
        </HStack>
      </HStack>
      <Box w="100%" h="50%" fontFamily="Inconsolata" fontSize="16px">
        <LinesEllipsis
          text="No description yet!"
          maxLine="1"
          ellipsis="..."
          trimRight
          basedOn="letters"
        />
      </Box>
      <SpaceModal isOpen={isOpen} onClose={onClose} spaceId={space.id} />
    </VStack>
  );
};

SpaceCell.propTypes = {
  space: PropTypes.any.isRequired,
};

export default SpaceCell;
