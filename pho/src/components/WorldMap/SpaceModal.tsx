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
import { useNavigate } from 'react-router-dom';

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
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

const SpaceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  spaceId: number;
}> = ({ isOpen, onClose, spaceId }) => {
  const [spaceDetail, setSpaceDetail] = useState<SpaceDetail | undefined>();
  const [currentLocalTime, setCurrentLocalTime] = useState<string>('');

  const [isBreak, setBreak] = useState<boolean>(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const navigate = useNavigate();

  const onSessionEnded = () => {
    if (!spaceDetail) return;
    let interval = 0;
    if (isBreak) {
      interval = spaceDetail.pomodoroDuration;
    } else {
      interval = spaceDetail.shortBreakDuration;
    }
    setBreak(!isBreak);
    setMinutes(Math.floor(interval / 60));
    setSeconds(interval % 60);
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL as string}/api/spaces/${spaceId}`
      )
      .then((res) => setSpaceDetail(res.data))
      .catch(console.log);
  }, []);

  useEffect(() => {
    if (typeof spaceDetail === 'undefined') return;

    setCurrentLocalTime(
      new Date().toLocaleTimeString('en-US', {
        timeZone: spaceDetail.timezone,
        hour: '2-digit',
        minute: '2-digit',
      })
    );

    const interval = spaceDetail.pomodoroDuration;
    setBreak(false);
    setMinutes(Math.floor(interval / 60));
    setSeconds(interval % 60);
  }, [spaceDetail]);

  useEffect(() => {
    if (!spaceDetail) return;
    const pomodoroInterval = setInterval(() => {
      if (seconds === 0 && minutes === 0) {
        clearInterval(pomodoroInterval);
        onSessionEnded();
        return;
      }
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        setSeconds(59);
        setMinutes(minutes - 1);
      }
      setCurrentLocalTime(
        new Date().toLocaleTimeString('en-US', {
          timeZone: spaceDetail.timezone,
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    }, 1000);
    return () => {
      clearInterval(pomodoroInterval);
    };
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent pb="5" pt="5" textAlign="center" fontFamily="Inconsolata">
        {typeof spaceDetail === 'undefined' ? (
          <>Error</>
        ) : (
          <>
            {' '}
            <ModalHeader textAlign="center" pb="3">
              {spaceDetail.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pt="0" pb="2">
              Local time: {currentLocalTime}
            </ModalBody>
            <ModalBody pt="0">
              {spaceDetail.members.length} participants
            </ModalBody>
            <ModalBody
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {spaceDetail.members.length < 5 ? (
                spaceDetail.members.map((member: Member) => {
                  const imgSrc = `https://ui-avatars.com/api/?background=random&name=${member.username}`;
                  return (
                    <Image
                      key={member.id}
                      src={imgSrc}
                      borderRadius="100"
                      mr="5"
                    />
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
              {isBreak ? <>Short Break</> : <>Focus Session</>}
            </ModalBody>
            <ModalBody fontSize="40" fontWeight="bold" pt="0">
              {minutes === 0 && seconds === 0 ? (
                '0:00'
              ) : (
                <h1>
                  {' '}
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </h1>
              )}
            </ModalBody>
            <ModalFooter display="flex" justifyContent="center">
              <Button
                color="black"
                onClick={() => navigate(`/spaces/${spaceId}`)}
                background="#B1B2FF"
                pl="10"
                pr="10"
              >
                Join
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SpaceModal;
