import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Context from './context';
import { useQueryClient } from '@tanstack/react-query';
import { Timer } from '@/api/types';
import { AxiosResponse } from 'axios';

interface WebSocketMessage<T = unknown> {
  readonly type:
    | 'TIMER_CREATED'
    | 'TIMER_DELETED'
    | 'TIMER_TICK'
    | 'TIMER_PAUSED'
    | 'TIMER_STARTED';
  readonly data: T;
}

const maxRetries = 5; // 최대 재시도 횟수

export const WebSocketProvider = () => {
  const params = useParams();

  const connRef = useRef<WebSocket | null>(null);

  const retryCountRef = useRef(0);

  const [isLostConnection, setIsLostConnection] = useState(false);

  const queryClient = useQueryClient();

  const handleMessage = useCallback(
    (msg: WebSocketMessage) => {
      console.log(msg);
      switch (msg.type) {
        case 'TIMER_CREATED': {
          const timer = msg.data as Timer;
          queryClient.setQueryData<AxiosResponse<{ data: Timer }>>(
            [`/team/${params.teamId}/timer/${timer.id}`],
            (prev) => prev && { ...prev, data: { data: timer } },
          );
          queryClient.setQueryData<AxiosResponse<{ data: Timer[] }>>(
            [`/team/${params.teamId}/timer/list`],
            (prev) =>
              prev && { ...prev, data: { data: [...prev.data.data, timer] } },
          );
          break;
        }

        case 'TIMER_DELETED': {
          const timerId = msg.data as string;
          queryClient.setQueryData<AxiosResponse<{ data: Timer }>>(
            [`/team/${params.teamId}/timer/${timerId}`],
            undefined,
          );
          queryClient.setQueryData<AxiosResponse<{ data: Timer[] }>>(
            [`/team/${params.teamId}/timer/list`],
            (prev) =>
              prev && {
                ...prev,
                data: {
                  data: prev.data.data.filter((timer) => timer.id !== timerId),
                },
              },
          );
          break;
        }

        case 'TIMER_TICK': // fallthrough
        case 'TIMER_PAUSED': // fallthrough
        case 'TIMER_STARTED': {
          const timer = msg.data as Timer;
          queryClient.setQueryData<AxiosResponse<{ data: Timer }>>(
            [`/team/${params.teamId}/timer/${timer.id}`],
            (prev) => prev && { ...prev, data: { data: timer } },
          );
          queryClient.setQueryData<AxiosResponse<{ data: Timer[] }>>(
            [`/team/${params.teamId}/timer/list`],
            (prev) =>
              prev && {
                ...prev,
                data: {
                  data: prev.data.data.map((prevTimer) =>
                    prevTimer.id === timer.id ? timer : prevTimer,
                  ),
                },
              },
          );
          break;
        }

        default:
          throw new Error(`Unknown message type: ${msg.type as string}`);
      }
    },
    [params.teamId, queryClient],
  );

  const connect = useCallback(
    (teamId: string) => {
      const newConn = new WebSocket(`ws://localhost:3000/${teamId}`);

      newConn.onmessage = ({ data }) => {
        const msg = JSON.parse(data as string) as WebSocketMessage;
        handleMessage(msg);
      };

      newConn.onopen = () => {
        retryCountRef.current = 0; // 연결 성공 시 재시도 횟수 초기화
      };

      newConn.onclose = (ev) => {
        console.log(ev);
        if (ev.wasClean) {
          return;
        }
        if (retryCountRef.current < maxRetries) {
          // 재연결 시도
          connRef.current = connect(teamId);
          retryCountRef.current++;
        } else {
          // 최대 재시도 횟수 초과 시 연결 끊김으로 간주
          setIsLostConnection(true);
        }
      };

      return newConn;
    },
    [handleMessage],
  );

  useEffect(() => {
    if (typeof params.teamId !== 'string') {
      return;
    }

    connRef.current = connect(params.teamId);

    return () => {
      const { current: conn } = connRef;
      connRef.current = null;
      if (conn) {
        if (conn.readyState === WebSocket.OPEN) {
          conn.close();
        } else {
          conn.onopen = () => conn.close();
        }
      }
    };
  }, [connect, params.teamId]);

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          isLostConnection,
          getConnection: () => connRef.current,
        }),
        [isLostConnection],
      )}
    >
      <Outlet />
    </Context.Provider>
  );
};
