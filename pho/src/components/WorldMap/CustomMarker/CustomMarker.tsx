import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { Marker } from 'react-map-gl';

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
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal {space.id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Hello</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomMarker;
