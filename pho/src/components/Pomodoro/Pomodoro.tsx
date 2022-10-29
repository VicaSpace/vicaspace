import { Box, Center } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';

import pomodoroConfig from '@/config/pomodoro.json';
import { calculatePomodoroSession } from '@/lib/pomodoro';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { setBreak, setSessionId, setStartTime } from '@/states/pomodoro/slice';

import sessionIcon from '../Pomodoro/session.png';
import './Pomodoro.css';

const Pomodoro: React.FC<{
  timestamp: number;
  serverTime: number;
}> = ({ timestamp, serverTime }) => {
  const { sessionId, startTime, isBreak } = useAppSelector(
    (state) => state.pomodoroSlice
  );
  const dispatch = useAppDispatch();
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    dispatch(setStartTime(timestamp));
    const sessionInfo = calculatePomodoroSession(startTime, serverTime);
    dispatch(setBreak(sessionInfo.isBreak));
    dispatch(setSessionId(sessionInfo.sessionId));
    setMinutes(sessionInfo.minutes);
    setSeconds(sessionInfo.seconds);
  }, []);

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
    const pomodorpInterval = setInterval(() => {
      if (seconds === 0 && minutes === 0) {
        clearInterval(pomodorpInterval);
        onSessionEnded();
        return;
      }
      if (seconds > 0) {
        setSeconds(seconds - 1);
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
          {isBreak ? 'Break!!!' : pomodoroConfig[sessionId].sessionName}
        </Center>
      </Box>
    </Draggable>
  );
};

export default Pomodoro;
