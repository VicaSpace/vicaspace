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

import { calculatePomodoroSession } from '@/lib/pomodoro';

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
  const [isLongBreak, setLongBreak] = useState<boolean>(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [sessionId, setSessionId] = useState<number>(0);

  const navigate = useNavigate();

  const onSessionEnded = () => {
    if (!spaceDetail) return;

    let interval = 0;
    let newSessionId = sessionId;

    if (isLongBreak) {
      // end of long break session
      newSessionId = 0;
      setSessionId(newSessionId);
      setLongBreak(false);
      interval = spaceDetail.pomodoroDuration;
    } else {
      if (isBreak) {
        if (sessionId === 3) {
          // next is long break
          setLongBreak(true);
          newSessionId = -1;
          interval = spaceDetail.longBreakDuration;
        } else {
          // turn to next session
          newSessionId = sessionId + 1;
          interval = spaceDetail.pomodoroDuration;
        }
        setSessionId(newSessionId);
      } else {
        // switch to short break
        interval = spaceDetail.shortBreakDuration;
      }
      setBreak(!isBreak);
    }

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
  }, [isOpen]);

  useEffect(() => {
    if (!spaceDetail) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentLocalTime(
        new Date().toLocaleTimeString('en-US', {
          timeZone: spaceDetail.timezone,
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    }, 1000);

    // On Modal close -> clear interval!
    if (!isOpen) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isOpen]);

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

    const { sessionId, isBreak, minutes, seconds, isLongBreak } =
      calculatePomodoroSession(
        new Date(spaceDetail.startTime).getTime(),
        new Date(spaceDetail.serverTime).getTime(),
        spaceDetail.pomodoroDuration,
        spaceDetail.shortBreakDuration,
        spaceDetail.longBreakDuration
      );

    setBreak(isBreak);
    setMinutes(minutes);
    setSeconds(seconds);
    setLongBreak(isLongBreak);
    setSessionId(sessionId);
  }, [spaceDetail]);

  useEffect(() => {
    if (!spaceDetail) return;

    let pomodoroInterval: NodeJS.Timer | null = null;

    if (isOpen) {
      if (seconds === 0) {
        if (minutes === 0) {
          pomodoroInterval = setInterval(() => {
            onSessionEnded();
          }, 1000);
        } else {
          pomodoroInterval = setInterval(() => {
            setMinutes(minutes - 1);
            setSeconds(59);
          }, 1000);
        }
      } else {
        pomodoroInterval = setInterval(() => {
          setSeconds(seconds - 1);
        }, 1000);
      }
    } else {
      if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
      }
    }

    return () => {
      if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
      }
    };
  }, [minutes, seconds, isOpen]);

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
              {isLongBreak
                ? 'Long Break'
                : isBreak
                ? 'Short Break'
                : 'Focus Session'}
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
