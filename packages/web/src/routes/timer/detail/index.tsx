import { Timer } from '@/api/types';
import utils from '@/utils';
import { css } from '@emotion/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export const TimerDetailPage = () => {
  const navigate = useNavigate();

  const { teamId, timerId } = useParams();

  const updateTimerStateMutation = useMutation({
    mutationFn: (state: 'start' | 'pause') =>
      axios.post<{ data: Timer }>(
        `/api/team/${teamId}/timer/${timerId}/${state}`,
      ),
    onSuccess: ({ data: { data } }) => {
      switch (data.status) {
        case 'PAUSED':
          alert('타이머가 일시정지되었습니다.');
          break;
        case 'RUNNING':
          alert('타이머가 시작되었습니다.');
          break;
        default:
          break;
      }
    },
    onError: () => {
      alert('타이머 시작에 실패했습니다.');
    },
  });

  const deleteTimerMutation = useMutation({
    mutationFn: () => axios.post(`/api/team/${teamId}/timer/${timerId}/delete`),
    onSuccess: () => {
      navigate(`/team/${teamId}`, { replace: true });
      alert('타이머가 삭제되었습니다.');
    },
    onError: () => {
      alert('타이머 삭제에 실패했습니다.');
    },
  });

  const timerQuery = useQuery({
    queryKey: [`/api/team/${teamId}/timer/${timerId}`] as const,
    queryFn: ({ queryKey: [path] }) => axios.get<{ data: Timer }>(path),
    select: ({ data: { data } }) => data,
    refetchInterval: 100,
  });

  if (timerQuery.status === 'error') {
    return <div>에러</div>;
  }

  if (timerQuery.status === 'pending') {
    return <div>로딩중</div>;
  }

  return (
    <div
      css={css`
        width: 100vw;
        height: 100svh;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        gap: 1rem;
      `}
    >
      <h1>{timerQuery.data.title}</h1>

      <h2>{utils.time.format(timerQuery.data.timeLeft)}</h2>

      {timerQuery.data.status === 'PAUSED' && (
        <button
          type="button"
          disabled={
            updateTimerStateMutation.isPending || deleteTimerMutation.isPending
          }
          onClick={() => updateTimerStateMutation.mutate('start')}
        >
          시작
        </button>
      )}

      {timerQuery.data.status === 'RUNNING' && (
        <button
          type="button"
          disabled={
            updateTimerStateMutation.isPending || deleteTimerMutation.isPending
          }
          onClick={() => updateTimerStateMutation.mutate('pause')}
        >
          일시정지
        </button>
      )}

      {timerQuery.data.status === 'STOPPED' && (
        <button
          type="button"
          disabled={
            updateTimerStateMutation.isPending || deleteTimerMutation.isPending
          }
          onClick={() => updateTimerStateMutation.mutate('start')}
        >
          재시작
        </button>
      )}

      <button
        type="button"
        disabled={
          updateTimerStateMutation.isPending || deleteTimerMutation.isPending
        }
        onClick={() => deleteTimerMutation.mutate()}
      >
        삭제
      </button>
    </div>
  );
};
