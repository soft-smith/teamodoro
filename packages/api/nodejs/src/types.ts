export interface PomodoroTimer {
  id: string;
  title: string;
  duration: number;
  timeLeft: number;
  timerId: NodeJS.Timeout | null;
  status: "RUNNING" | "PAUSED" | "STOPPED";
}

export interface Team {
  id: string;
  name: string;
  timerList: PomodoroTimer[];
}
