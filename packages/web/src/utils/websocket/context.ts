import { createContext } from 'react';

interface WebSocketContext {
  readonly getConnection: () => WebSocket | null;
  readonly isLostConnection: boolean;
}

export default createContext<WebSocketContext | null>(null);
