import { useEffect, useState } from 'react';

import { calculatePomodoroSession } from '@/lib/pomodoro';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import {
  setBreak,
  setLongBreak,
  setSessionId,
  setStartTime,
} from '@/states/pomodoro/slice';

import { PomodoroConfig, PomodoroSessionInfo } from './../types/pomodoro';

export const usePomodoro = (
  pomodoroConfig: PomodoroConfig
): PomodoroSessionInfo => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const { sessionId, startTime, isBreak, isLongBreak } = useAppSelector(
    (state) => state.pomodoroSlice
  );
  const dispatch = useAppDispatch();
  const [sessionInfo, setSessionInfo] = useState<PomodoroSessionInfo | null>(
    null
  );

  useEffect(() => {
    dispatch(setStartTime(pomodoroConfig.startTime));
  }, []);

  useEffect(() => {
    setSessionInfo(
      calculatePomodoroSession(
        startTime,
        pomodoroConfig.serverTime,
        pomodoroConfig.pomodoroDuration,
        pomodoroConfig.shortBreakDuration,
        pomodoroConfig.longBreakDuration
      )
    );
  }, [startTime]);

  useEffect(() => {
    if (!sessionInfo) {
      return;
    }
    dispatch(setLongBreak(sessionInfo.isLongBreak));
    dispatch(setBreak(sessionInfo.isBreak));
    dispatch(setSessionId(sessionInfo.sessionId));
    setMinutes(sessionInfo.minutes);
    setSeconds(sessionInfo.seconds);
  }, [sessionInfo]);

  const onSessionEnded = () => {
    let interval = 0;
    let newSessionId = sessionId;

    if (isLongBreak) {
      // end of long break session
      newSessionId = 0;
      dispatch(setSessionId(newSessionId));
      dispatch(setLongBreak(false));
      interval = pomodoroConfig.pomodoroDuration;
    } else {
      if (isBreak) {
        if (sessionId === 3) {
          // next is long break
          dispatch(setLongBreak(true));
          newSessionId = -1;
          interval = pomodoroConfig.longBreakDuration;
        } else {
          // turn to next session
          newSessionId = sessionId + 1;
          interval = pomodoroConfig.pomodoroDuration;
        }
        dispatch(setSessionId(newSessionId));
      } else {
        // switch to short break
        interval = pomodoroConfig.shortBreakDuration;
      }
      dispatch(setBreak(!isBreak));
    }

    setMinutes(Math.floor(interval / 60));
    setSeconds(interval % 60);
  };

  useEffect(() => {
    let pomodoroInterval: NodeJS.Timer;
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
    return () => {
      clearInterval(pomodoroInterval);
    };
  }, [minutes, seconds]);

  return {
    sessionId,
    minutes,
    seconds,
    isBreak,
    isLongBreak,
  };
};
