interface Clock {
  setInterval: (callback: ClockCallback, ms: number) => number;
  clearInterval: (id: number) => void;
}

type ClockCallback = (lastCallTimeMs: number, callTimeMs: number) => void;

interface MockClock extends Clock {
  tick: (ms: number) => void;
}

interface MockClockCallbackState {
  lastCallTimeMs: number;
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
        lastCallTimeMs: currentTimeMs,
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
        const { lastCallTimeMs, interval, callback } = callbackState;
        const callTimeMs = currentTimeMs;
        if (callTimeMs - lastCallTimeMs >= interval) {
          callbackState.lastCallTimeMs = callTimeMs;
          callback(lastCallTimeMs, callTimeMs);
        }
      });
    },
  };
};

interface SystemClockCallbackState {
  lastCallTimeMs: number;
  interval: number;
  systemIntervalId: NodeJS.Timeout;
}

// Use internal clock while providing lastCallTimeMs and callTimeMs
export const createSystemClock = (): Clock => {
  const callbackList: { [id: string]: SystemClockCallbackState } = {};
  let intervalId = 0;
  return {
    setInterval: (callback, ms) => {
      const id = intervalId;
      intervalId += 1;
      callbackList[id] = {
        lastCallTimeMs: 0,
        interval: ms,
        systemIntervalId: setInterval(() => {
          const callbackState = callbackList[id];
          const { lastCallTimeMs } = callbackState;
          const callTimeMs = Date.now();
          callbackState.lastCallTimeMs = callTimeMs;
          callback(lastCallTimeMs, callTimeMs);
        }, ms),
      };

      return id;
    },
    clearInterval: (id) => {
      clearInterval(callbackList[id].systemIntervalId);
      delete callbackList[id];
    },
  };
};
