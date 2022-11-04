import { Box, Center } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';

import pomodoroConfig from '@/config/pomodoro.json';
import { calculatePomodoroSession } from '@/lib/pomodoro';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import {
  setBreak,
  setLongBreak,
  setSessionId,
  setStartTime,
} from '@/states/pomodoro/slice';

import sessionIcon from '../Pomodoro/session.png';
import './Pomodoro.css';

const Pomodoro: React.FC<{
  timestamp: number;
  serverTime: number;
}> = ({ timestamp, serverTime }) => {
  const { sessionId, startTime, isBreak, isLongBreak } = useAppSelector(
    (state) => state.pomodoroSlice
  );
  const dispatch = useAppDispatch();
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    dispatch(setStartTime(timestamp));
    const sessionInfo = calculatePomodoroSession(
      startTime,
      serverTime,
      10,
      5,
      10
    );
    dispatch(setLongBreak(sessionInfo.isLongBreak));
    dispatch(setBreak(sessionInfo.isBreak));
    dispatch(setSessionId(sessionInfo.sessionId));
    setMinutes(sessionInfo.minutes);
    setSeconds(sessionInfo.seconds);
  }, []);

  const onSessionEnded = () => {
    let interval = 0;
    let newSessionId = sessionId;

    if (isLongBreak) {
      // end of long break session
      newSessionId = 0;
      dispatch(setSessionId(newSessionId));
      dispatch(setLongBreak(false));
      interval = pomodoroConfig.pomodoroes[newSessionId].sessionInterval;
    } else {
      if (isBreak) {
        if (sessionId === 3) {
          // next is long break
          dispatch(setLongBreak(true));
          newSessionId = -1;
          interval = pomodoroConfig.longBreak;
        } else {
          // turn to next session
          newSessionId = sessionId + 1;
          interval = pomodoroConfig.pomodoroes[newSessionId].sessionInterval;
        }
        dispatch(setSessionId(newSessionId));
      } else {
        // switch to short break
        interval = pomodoroConfig.pomodoroes[sessionId].breakInterval;
      }
      dispatch(setBreak(!isBreak));
    }

    setMinutes(Math.floor(interval / 60));
    setSeconds(interval % 60);
  };

  useEffect(() => {
    const pomodorpInterval = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(pomodorpInterval);
          onSessionEnded();
          return;
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
          return;
        }
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
        style={{ background: 'red' }}
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
          {isLongBreak
            ? 'Long Break!!!'
            : isBreak
            ? 'Break!!!'
            : pomodoroConfig.pomodoroes[sessionId].sessionName}
        </Center>
      </Box>
    </Draggable>
  );
};

export default Pomodoro;
