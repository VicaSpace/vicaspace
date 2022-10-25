import { Box, Center } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';

import pomodoroConfig from '@/config/pomodoro.json';

import sessionIcon from '../PomodoroComponent/session.png';
import './PomodoroComponent.css';

const PomodoroComponent: React.FC<{}> = () => {
  const [sessionId, setSessionId] = useState(pomodoroConfig.length - 1);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const onSessionEnded = () => {
    if (sessionId > 0) setSessionId(sessionId - 1);
    else setSessionId(pomodoroConfig.length - 1);
  };

  useEffect(() => {
    const interval = pomodoroConfig[sessionId].sessionInterval;
    setMinutes(Math.floor(interval / 60));
    setSeconds(interval % 60);
  }, [sessionId]);

  useEffect(() => {
    const pomodorpInterval = setInterval(() => {
      if (seconds === 0 && minutes === 0) {
        onSessionEnded();
        return;
      }
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(pomodorpInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(pomodorpInterval);
    };
  });

  return (
    <Draggable
      handle=".handle"
      defaultPosition={{ x: 100, y: 100 }}
      grid={[25, 25]}
      scale={1}
    >
      <Box
        maxW="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        className="handle"
      >
        <Box display="flex" alignItems="baseline">
          <div className="sessionTitle">Timer</div>
          {[...Array(sessionId + 1)].map((e, i) => (
            <img
              key={i}
              src={sessionIcon}
              width="15"
              height="15"
              className="sessionIcon"
            ></img>
          ))}
        </Box>
        <hr className="hr" />
        <Center className="countdownTimer">
          {minutes === 0 && seconds === 0 ? (
            '0:00'
          ) : (
            <h1>
              {' '}
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </h1>
          )}
        </Center>
        <Center className="sessionName">
          {pomodoroConfig[sessionId].sessionName}
        </Center>
      </Box>
    </Draggable>
  );
};

export default PomodoroComponent;
