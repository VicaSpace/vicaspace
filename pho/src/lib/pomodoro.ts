import pomodoroConfig from '@/config/pomodoro.json';

export interface PomodoroSessionInfo {
  sessionId: number;
  minutes: number;
  seconds: number;
}

export const calculatePomodoroSession = (
  startTime: number,
  serverTime: number
): PomodoroSessionInfo => {
  const circleTime = pomodoroConfig
    .map((elm) => elm.sessionInterval)
    .reduce((a, b) => a + b);
  let deltaTime = (serverTime - startTime) % (circleTime * 1000);
  let sessionId = 0;

  // get delta time of current session - in milliseconds
  for (let i = pomodoroConfig.length - 1; i >= 0; i--) {
    if (deltaTime < pomodoroConfig[i].sessionInterval * 1000) {
      sessionId = i;
      break;
    } else deltaTime -= pomodoroConfig[i].sessionInterval * 1000;
  }

  // time left to next session - in seconds
  const timeToGo =
    pomodoroConfig[sessionId].sessionInterval - Math.floor(deltaTime / 1000);

  return {
    sessionId,
    minutes: Math.floor(timeToGo / 60),
    seconds: timeToGo % 60,
  };
};
