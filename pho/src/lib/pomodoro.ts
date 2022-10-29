import pomodoroConfig from '@/config/pomodoro.json';

export interface PomodoroSessionInfo {
  sessionId: number;
  minutes: number;
  seconds: number;
  isBreak: boolean;
}

export interface PomodoroSessionConfig {
  sessionInterval: number;
  breakInterval: number;
  sessionName: string;
}

export const calculatePomodoroSession = (
  startTime: number,
  serverTime: number
): PomodoroSessionInfo => {
  const circleTime = (pomodoroConfig as PomodoroSessionConfig[])
    .map((elm) => elm.sessionInterval + elm.breakInterval)
    .reduce((a, b) => a + b);
  let deltaTime = (serverTime - startTime) % (circleTime * 1000);
  let sessionId = 0;

  // get delta time of current session - in milliseconds
  for (let i = pomodoroConfig.length - 1; i >= 0; i--) {
    const phraseTime =
      pomodoroConfig[i].sessionInterval * 1000 +
      pomodoroConfig[i].breakInterval * 1000;
    if (deltaTime < phraseTime) {
      sessionId = i;
      break;
    } else deltaTime -= phraseTime;
  }

  // time left to next session - in seconds
  deltaTime = Math.floor(deltaTime / 1000);
  const isBreak = deltaTime >= pomodoroConfig[sessionId].sessionInterval;
  const timeToGo = isBreak
    ? pomodoroConfig[sessionId].breakInterval -
      (deltaTime - pomodoroConfig[sessionId].sessionInterval)
    : pomodoroConfig[sessionId].sessionInterval - deltaTime;

  return {
    isBreak,
    sessionId,
    minutes: Math.floor(timeToGo / 60),
    seconds: timeToGo % 60,
  };
};
