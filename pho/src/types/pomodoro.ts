export interface PomodoroSessionInfo {
  sessionId: number;
  minutes: number;
  seconds: number;
  isBreak: boolean;
  isLongBreak: boolean;
}

export interface PomodoroConfig {
  startTime: number;
  serverTime: number;
  shortBreakDuration: number;
  pomodoroDuration: number;
  longBreakDuration: number;
}
