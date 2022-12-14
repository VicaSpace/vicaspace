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

import './SpaceCell.css';

interface SpaceCellProps {
  isDrawerOpen: boolean;
  space: GetSpaceDetailResponse;
}

const SpaceCell: React.FC<SpaceCellProps> = ({ isDrawerOpen, space }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const URL = process.env.REACT_APP_BACKEND_URL ?? '';
  const [spaceInfo, setSpaceInfo] = useState<GetSpaceDetailResponse>();

  useEffect(() => {
    const fetchSpaceInfo = async () => {
      const spaceInfo = (await axios.get(`${URL}/api/spaces/${space.id}`)).data;
      console.log(spaceInfo);

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
      className={`${!isDrawerOpen ? 'space-cell-container-close' : ''}`}
    >
      <HStack
        w="100%"
        h="50%"
        className={`${!isDrawerOpen ? 'space-cell-upper-close' : ''}`}
      >
        <Heading
          w="70%"
          size="md"
          fontFamily="Inconsolata"
          float="left"
          className={`${!isDrawerOpen ? 'space-cell-upper-heading-close' : ''}`}
        >
          {spaceInfo ? spaceInfo.name : ''}
        </Heading>
        <HStack
          w="30%"
          justify="right"
          className={`${!isDrawerOpen ? 'space-cell-members-icon-close' : ''}`}
        >
          <Image src={noOnlUsersIcon} />
          <Text>{spaceInfo ? spaceInfo.members.length : 0}</Text>
        </HStack>
      </HStack>
      <Box
        w="100%"
        h="50%"
        fontFamily="Inconsolata"
        fontSize="16px"
        className={`${!isDrawerOpen ? 'space-cell-discription-close' : ''}`}
      >
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
  isDrawerOpen: PropTypes.bool.isRequired,
  space: PropTypes.any.isRequired,
};

export default SpaceCell;
