import { css } from "@emotion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { ClickIcon } from "./icons/click-icon";
import { SelectIcon } from "./icons/select-icon";

type TimerHistory = { timerType: "rest" | "focus"; startAt: Date };

function App() {
  const [timerHistory, setTimerHistory] = useState<TimerHistory[]>([]);
  const [activeTimerType, setActiveTimerType] = useState<"rest" | "focus">(
    "focus"
  );
  const [_, setActiveTimerNow] = useState<Date>(new Date());

  const addTimerToHistory = useCallback(() => {
    const startAt = new Date();
    setTimerHistory((prevState) => [
      ...prevState,
      { startAt, timerType: activeTimerType },
    ]);
  }, [activeTimerType]);

  useEffect(() => {
    addTimerToHistory();

    const updater = setInterval(() => {
      updateCurrentDate();
    }, 1000);

    return () => clearInterval(updater);
  }, [addTimerToHistory]);

  const updateCurrentDate = () => {
    setActiveTimerNow(new Date());
  };

  const stackedTimeMs = useMemo(() => {
    if (timerHistory.length === 1) return { restTimeMs: 0, focusTimeMs: 0 };

    const sumIntervalForType = (timerType: TimerHistory["timerType"]) => {
      return timerHistory
        .slice(0, timerHistory.length - 1)
        .map((history, index) => ({
          ...history,
          interval:
            timerHistory[index + 1].startAt.getTime() -
            history.startAt.getTime(),
        }))
        .filter((history) => history.timerType === timerType)
        .reduce((s, x) => s + x.interval, 0);
    };

    const restTimeMs = sumIntervalForType("rest");
    const focusTimeMs = sumIntervalForType("focus");

    return { restTimeMs, focusTimeMs };
  }, [timerHistory]);

  const parseTimeUtil = (msTime: number) => {
    const restWithoutHours = msTime % (60 * 60 * 1000);
    const hours = (msTime - restWithoutHours) / (60 * 60 * 1000);
    const restWithoutMinutes = restWithoutHours % (60 * 1000);
    const minutes = (restWithoutHours - restWithoutMinutes) / (60 * 1000);
    const restWithoutSeconds = restWithoutMinutes % 1000;
    const seconds = (restWithoutMinutes - restWithoutSeconds) / 1000;

    if (hours > 0) {
      return hours + "h " + minutes + "m " + seconds + "s";
    } else if (minutes > 0) {
      return minutes + "m " + seconds + "s";
    } else {
      return seconds + "s";
    }
  };

  if (timerHistory.length === 0) {
    return <div></div>;
  }

  const currentTimer = timerHistory[timerHistory.length - 1];
  const activeTimerElapsedMs =
    new Date().getTime() - currentTimer.startAt.getTime();

  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100dvh;

        @media (max-width: 720px) {
          flex-direction: column;
        }
      `}
    >
      <div
        css={css`
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #1b1e23;
          color: #ffffff;
        `}
      >
        <h1
          css={css`
            font-size: 64px;
            font-weight: 300;
            user-select: none;
          `}
        >
          {activeTimerType === "rest"
            ? parseTimeUtil(activeTimerElapsedMs + stackedTimeMs.restTimeMs)
            : parseTimeUtil(stackedTimeMs.restTimeMs)}
        </h1>
        <h3
          css={css`
            font-size: 24px;
            font-weight: 700;
            user-select: none;
          `}
        >
          REST
        </h3>
        <div
          css={css`
            height: 32px;
            margin-top: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          `}
        >
          {activeTimerType === "focus" ? (
            <button
              css={css`
                border: none;
                background: none;
                color: #ffffff;
                font-size: 16px;
                font-family: Montserrat;
                padding: 4px 16px;
                border-radius: 32px;
                border: 1px solid #ffffff;
                opacity: 50%;
                transition: 200ms;
                cursor: pointer;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                gap: 4px;
                :hover {
                  opacity: 100%;
                }
              `}
              onClick={() => {
                setActiveTimerType((prev) =>
                  prev === "focus" ? "rest" : "focus"
                );
                addTimerToHistory();
              }}
            >
              <ClickIcon fill={"#ffffff"} />
              tab to switch
            </button>
          ) : (
            <SelectIcon fill={"#ffffff"} />
          )}
        </div>
      </div>
      <div
        css={css`
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #ffffff;
          color: #1b1e23;
        `}
      >
        <h1
          css={css`
            font-size: 64px;
            font-weight: 300;
            user-select: none;
          `}
        >
          {activeTimerType === "focus"
            ? parseTimeUtil(activeTimerElapsedMs + stackedTimeMs.focusTimeMs)
            : parseTimeUtil(stackedTimeMs.focusTimeMs)}
        </h1>
        <h3
          css={css`
            font-size: 24px;
            font-weight: 700;
            user-select: none;
          `}
        >
          FOCUS
        </h3>
        <div
          css={css`
            height: 32px;
            margin-top: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          `}
        >
          {activeTimerType === "rest" ? (
            <button
              css={css`
                border: none;
                background: none;
                color: #1b1e23;
                font-size: 16px;
                font-family: Montserrat;
                padding: 4px 16px;
                border-radius: 32px;
                border: 1px solid #3d444f;
                opacity: 50%;
                transition: 200ms;
                cursor: pointer;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                gap: 4px;
                :hover {
                  opacity: 100%;
                }
              `}
              onClick={() => {
                setActiveTimerType((prev) =>
                  prev === "focus" ? "rest" : "focus"
                );
                addTimerToHistory();
              }}
            >
              <ClickIcon fill={"#AFB0B2"} />
              tab to switch
            </button>
          ) : (
            <SelectIcon fill={"#1b1e23"} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
