interface Clock {
  setInterval: (callback: ClockCallback, ms: number) => number;
  clearInterval: (id: number) => void;
}

type ClockCallback = (lastCallTimeMs: number, callTimeMs: number) => void;

interface MockClock extends Clock {
  tick: (ms: number) => void;
  clearAll: () => void;
}

interface MockClockCallbackState {
  lastCalledTimeMs: number;
  lastCallbackTimingMs: number;
  interval: number;
  callback: ClockCallback;
}

// call callback functions for every interval for each callback
// for every callback, it has lastCallTimeMs and callTimeMs
export const createMockClock = (): MockClock => {
  const callbackList: { [id: string]: MockClockCallbackState } = {};
  let intervalId = 0;
  let currentTimeMs = 0;
  return {
    setInterval: (callback, ms) => {
      const id = intervalId;
      intervalId += 1;
      callbackList[id] = {
        lastCalledTimeMs: currentTimeMs,
        lastCallbackTimingMs: currentTimeMs,
        interval: ms,
        callback,
      };
      return id;
    },
    clearInterval: (id) => {
      delete callbackList[id];
    },
    tick: (ms) => {
      currentTimeMs += ms;
      Object.keys(callbackList).forEach((id) => {
        const callbackState = callbackList[id];
        const { lastCalledTimeMs, interval, callback } = callbackState;
        const callTimeMs = currentTimeMs;
        while (callTimeMs - callbackState.lastCallbackTimingMs >= interval) {
          callbackState.lastCallbackTimingMs += interval;
          callback(lastCalledTimeMs, callTimeMs);
        }
      });
    },
    clearAll: () => {
      Object.keys(callbackList).forEach((id) => {
        delete callbackList[id];
      });
    },
  };
};

interface MockClockWithSystemClock extends MockClock {
  pause: () => void;
  resume: () => void;
}

// Use internal clock while providing lastCallTimeMs and callTimeMs
export const createMockClockWithSystemClock = ({
  paused,
}: {
  paused: boolean;
}): MockClockWithSystemClock => {
  // Repurpose MockClock using system interval
  const mockClock = createMockClock() as MockClock;
  let lastTickMs = Date.now();
  const tickClock = () => {
    const nowMs = Date.now();
    const deltaMs = nowMs - lastTickMs;
    lastTickMs = nowMs;
    mockClock.tick(deltaMs);
  };
  let interval = paused ? null : setInterval(tickClock, 10);

  return {
    ...mockClock,
    pause: () => {
      if (!interval) {
        return;
      }
      clearInterval(interval);
    },
    resume: () => {
      interval = setInterval(tickClock, 10);
    },
  };
};
