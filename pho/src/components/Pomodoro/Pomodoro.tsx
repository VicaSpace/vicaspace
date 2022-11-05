import { Box, Center } from '@chakra-ui/react';
import React, { useState } from 'react';
import Draggable from 'react-draggable';

import { usePomodoro } from '@/hooks/usePomodoro';

import sessionIcon from '../Pomodoro/session.png';
import './Pomodoro.css';

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

const pomodoroWidthPixels = 250;
const toolbarRightPosition = 62;

const Pomodoro: React.FC<{
  timestamp: number;
  serverTime: number;
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}> = ({
  timestamp,
  serverTime,
  pomodoroDuration,
  shortBreakDuration,
  longBreakDuration,
}) => {
  const { sessionId, minutes, seconds, isBreak, isLongBreak } = usePomodoro({
    startTime: timestamp,
    serverTime,
    shortBreakDuration,
    pomodoroDuration,
    longBreakDuration,
  });
  const [windowDimensions] = useState(getWindowDimensions());

  return (
    <Draggable
      handle=".handle"
      defaultPosition={{
        x: windowDimensions.width - pomodoroWidthPixels - toolbarRightPosition,
        y: 100,
      }}
      grid={[25, 25]}
      scale={1}
    >
      <Box
        maxW="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        className="handle"
        style={{
          background: isLongBreak
            ? 'rgb(250, 247, 210)'
            : isBreak
            ? 'rgb(181, 245, 225)'
            : 'rgb(210, 218, 255)',
        }}
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
          {isLongBreak ? 'Long Break!!!' : isBreak ? 'Break!!!' : 'In Pomodoro'}
        </Center>
      </Box>
    </Draggable>
  );
};

export default Pomodoro;
