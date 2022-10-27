import axios from 'axios';

import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

interface Member {
  id: number;
  username: string;
}

interface SpaceDetail {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  startTime: string;
  serverTime: string;
  members: Member[];
  timezone: string;
}

const SpaceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  spaceId: number;
}> = ({ isOpen, onClose, spaceId }) => {
  const [spaceDetail, setSpaceDetail] = useState<SpaceDetail | undefined>();

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/spaces/${spaceId}`)
      .then((res) => setSpaceDetail(res.data))
      .catch(console.log);
  }, []);

  if (spaceDetail == null) {
    return <>Error</>;
  }

  const currentLocalTime = new Date().toLocaleTimeString('en-US', {
    timeZone: spaceDetail.timezone,
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent pb="5" pt="5" textAlign="center" fontFamily="Inconsolata">
        <ModalHeader textAlign="center" pb="3">
          {spaceDetail.name}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pt="0" pb="2">
          Local time: {currentLocalTime}
        </ModalBody>
        <ModalBody pt="0">{spaceDetail.members.length} participants</ModalBody>
        <ModalBody display="flex" justifyContent="center" alignItems="center">
          {spaceDetail.members.length < 5 ? (
            spaceDetail.members.map((member: Member) => {
              const imgSrc = `https://ui-avatars.com/api/?background=random&name=${member.username}`;
              return (
                <Image key={member.id} src={imgSrc} borderRadius="100" mr="5" />
              );
            })
          ) : (
            <>
              {spaceDetail.members.slice(0, 4).map((member: Member) => {
                const imgSrc = `https://ui-avatars.com/api/?background=random&name=${member.username}`;
                return (
                  <Image
                    key={member.id}
                    src={imgSrc}
                    borderRadius="100"
                    mr="5"
                  />
                );
              })}
              <Image
                src="https://miro.medium.com/max/512/1*Js0Y20MwjcTnVAe7KjDXNg.png"
                h="5"
              />
            </>
          )}
        </ModalBody>
        <ModalBody fontSize="32" pb="0">
          Focus Session
        </ModalBody>
        <ModalBody fontSize="40" fontWeight="bold" pt="0">
          25:00
        </ModalBody>
        <ModalFooter display="flex" justifyContent="center">
          <Button
            color="black"
            onClick={onClose}
            background="#B1B2FF"
            pl="10"
            pr="10"
          >
            Join
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SpaceModal;
