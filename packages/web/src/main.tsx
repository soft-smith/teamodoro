import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import './index.css';
import { CreateTimerPage, TeamPage, TimerDetailPage } from './routes';
import { MainPage } from './routes/main';
import Utils from './utils';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Utils.websocket.provider
        onMessage={({ data }) => {
          console.log(data);
        }}
      >
        <RouterProvider
          router={createBrowserRouter([
            { path: '/', element: <MainPage /> },
            {
              path: '/team/:teamId',
              children: [
                { index: true, element: <TeamPage /> },
                { path: 'create-timer', element: <CreateTimerPage /> },
                { path: 'timer/:timerId', element: <TimerDetailPage /> },
              ],
            },
            { path: '*', element: <Navigate replace to="/" /> },
          ])}
        />
      </Utils.websocket.provider>
    </QueryClientProvider>
  </React.StrictMode>,
);
