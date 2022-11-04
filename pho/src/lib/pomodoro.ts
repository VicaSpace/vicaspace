export interface PomodoroSessionInfo {
  sessionId: number;
  minutes: number;
  seconds: number;
  isBreak: boolean;
  isLongBreak: boolean;
}

export interface PomodoroSessionConfig {
  sessionInterval: number;
  breakInterval: number;
  sessionName: string;
}

export const calculatePomodoroSession = (
  startTime: number,
  serverTime: number,
  pomodoroDuration: number,
  shortBreakDuration: number,
  longBreakDuration: number
): PomodoroSessionInfo => {
  const circleTime =
    (pomodoroDuration + shortBreakDuration) * 4 + longBreakDuration;
  let deltaTime = (serverTime - startTime) % (circleTime * 1000);
  let sessionId = -1;
  let isLongBreak = false;

  // get delta time of current session - in milliseconds
  const sessionDuration = (pomodoroDuration + shortBreakDuration) * 1000;
  sessionId = Math.floor(deltaTime / sessionDuration);
  deltaTime = deltaTime % sessionDuration;
  if (sessionId >= 4) sessionId = -1;

  if (sessionId === -1) {
    isLongBreak = true;
  }

  // time left to next session - in seconds
  let timeToGo = 0;
  let isBreak = false;
  deltaTime = Math.floor(deltaTime / 1000);
  if (isLongBreak) {
    timeToGo = longBreakDuration - deltaTime;
    isBreak = true;
  } else {
    isBreak = deltaTime >= pomodoroDuration;
    timeToGo = isBreak
      ? shortBreakDuration - (deltaTime - pomodoroDuration)
      : pomodoroDuration - deltaTime;
  }

  return {
    isBreak,
    sessionId,
    minutes: Math.floor(timeToGo / 60),
    seconds: timeToGo % 60,
    isLongBreak,
  };
};
