import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Context from './context';

const maxRetries = 5; // 최대 재시도 횟수

interface Props {
  readonly onMessage: WebSocket['onmessage'];
}

export const WebSocketProvider = (props: Props) => {
  const params = useParams();

  const connRef = useRef<WebSocket | null>(null);

  const retryCountRef = useRef(0);

  const [isLostConnection, setIsLostConnection] = useState(false);

  const connect = useCallback(
    (teamId: string) => {
      const newConn = new WebSocket(`ws://localhost:3000/${teamId}`);

      newConn.onmessage = props.onMessage;

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
    [props.onMessage],
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
