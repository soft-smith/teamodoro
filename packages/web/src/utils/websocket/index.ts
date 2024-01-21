import { useContext } from 'react';
import context from './context';
import { WebSocketProvider } from './provider';

export default {
  provider: WebSocketProvider,

  useWebSocket() {
    const ctx = useContext(context);
    if (!ctx) {
      throw new Error('WebSocketProvider not found');
    }
    return ctx;
  },
} as const;
