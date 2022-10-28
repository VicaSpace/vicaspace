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

import pomodoroConfig from '@/config/pomodoro.json';
import { calculatePomodoroSession } from '@/lib/pomodoro';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { setBreak, setSessionId, setStartTime } from '@/states/pomodoro/slice';

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
  const [currentLocalTime, setCurrentLocalTime] = useState<string>('');

  const { sessionId, startTime, isBreak } = useAppSelector(
    (state) => state.pomodoroSlice
  );
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const dispatch = useAppDispatch();

  const onSessionEnded = () => {
    let interval = 0;
    if (isBreak) {
      const newSessionId =
        sessionId > 0 ? sessionId - 1 : pomodoroConfig.length - 1;
      dispatch(setSessionId(newSessionId));
      interval = pomodoroConfig[newSessionId].sessionInterval;
    } else {
      interval = pomodoroConfig[sessionId].breakInterval;
    }
    dispatch(setBreak(!isBreak));
    setMinutes(Math.floor(interval / 60));
    setSeconds(interval % 60);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/spaces/${spaceId}`)
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

    dispatch(setStartTime(new Date(spaceDetail.startTime).getTime()));
    console.log('startTime', spaceDetail.startTime);
    console.log('serverTime', spaceDetail.serverTime);
    const sessionInfo = calculatePomodoroSession(
      startTime,
      new Date(spaceDetail.serverTime).getTime()
    );
    console.log('sessionInfo:', sessionInfo);
    dispatch(setBreak(sessionInfo.isBreak));
    dispatch(setSessionId(sessionInfo.sessionId));
    setMinutes(sessionInfo.minutes);
    setSeconds(sessionInfo.seconds);
  }, [spaceDetail]);

  useEffect(() => {
    const pomodorpInterval = setInterval(() => {
      if (seconds === 0 && minutes === 0) {
        clearInterval(pomodorpInterval);
        onSessionEnded();
        return;
      }
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        setSeconds(59);
        setMinutes(minutes - 1);
      }
    }, 1000);
    return () => {
      clearInterval(pomodorpInterval);
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
                onClick={onClose}
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
