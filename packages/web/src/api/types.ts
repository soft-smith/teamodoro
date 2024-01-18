export interface Timer {
  readonly id: string;
  readonly title: string;
  readonly duration: number;
  readonly timeLeft: number;
  readonly status: 'RUNNING' | 'PAUSED' | 'STOPPED';
}
