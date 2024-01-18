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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
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
    </QueryClientProvider>
  </React.StrictMode>,
);
