import { Box, Center } from '@chakra-ui/react';
import React from 'react';
import Draggable from 'react-draggable';

import { usePomodoro } from '@/hooks/usePomodoro';

import sessionIcon from '../Pomodoro/session.png';
import './Pomodoro.css';

const Pomodoro: React.FC<{
  timestamp: number;
  serverTime: number;
}> = ({ timestamp, serverTime }) => {
  const { sessionId, minutes, seconds, isBreak, isLongBreak } = usePomodoro({
    startTime: timestamp,
    serverTime,
    shortBreakDuration: 2,
    pomodoroDuration: 5,
    longBreakDuration: 10,
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
          {isLongBreak ? 'Long Break!!!' : isBreak ? 'Break!!!' : 'In Pomodoro'}
        </Center>
      </Box>
    </Draggable>
  );
};

export default Pomodoro;
