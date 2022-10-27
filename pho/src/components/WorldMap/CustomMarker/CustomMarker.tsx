import { Box, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { Marker } from 'react-map-gl';

import SpaceModal from '@/components/WorldMap/SpaceModal/SpaceModal';
import { SpaceLocation } from '@/states/spaces/slice';

import './CustomMarker.css';

const CustomMarker: React.FC<{ space: SpaceLocation }> = ({ space }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Marker
        key={space.name}
        latitude={space.latitude}
        longitude={space.longitude}
        onClick={onOpen}
      >
        <Box as="div" className="pin bounce" />
        <Box as="div" className="pulse" />
      </Marker>
      <SpaceModal isOpen={isOpen} onClose={onClose} spaceId={space.id} />
    </>
  );
};

export default CustomMarker;
