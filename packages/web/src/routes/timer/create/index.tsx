import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import axios from '@/api/client';
import { useNavigate, useParams } from 'react-router-dom';

export const CreateTimerPage = () => {
  const navigate = useNavigate();

  const { teamId } = useParams();

  const createTimerMutation = useMutation({
    mutationFn: (params: {
      readonly title: string;
      readonly duration: string;
    }) => axios.post(`/team/${teamId}/timer/create`, params),
    onSuccess: () => {
      navigate(`/team/${teamId}`);
    },
    onError: () => {
      alert('타이머 생성에 실패했습니다.');
    },
  });

  return (
    <div
      css={css`
        width: 100vw;
        height: 100svh;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;
      `}
    >
      <header>
        <h1>새 타이머 생성</h1>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const title = formData.get('title') as string;
          const hours = formData.get('duration-hours') as string;
          const minutes = formData.get('duration-minutes') as string;
          const seconds = formData.get('duration-seconds') as string;
          const durationInSeconds = (
            Number(hours) * 3600 +
            Number(minutes) * 60 +
            Number(seconds)
          ).toString();
          createTimerMutation.mutate({ title, duration: durationInSeconds });
        }}
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;

          & > label {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        `}
      >
        <label>
          <h2>이름</h2>
          <input required name="title" />
        </label>

        <label>
          <h2>시간</h2>
          <span
            css={css`
              display: flex;
              gap: 0.5rem;
            `}
          >
            <input
              required
              name="duration-hours"
              type="number"
              min={0}
              max={23}
              defaultValue={0}
            />
            시간
            <input
              required
              name="duration-minutes"
              type="number"
              min={0}
              max={59}
              defaultValue={30}
            />
            분
            <input
              required
              name="duration-seconds"
              type="number"
              min={0}
              max={59}
              defaultValue={0}
            />
            초
          </span>
        </label>

        <button type="submit">생성</button>
      </form>
    </div>
  );
};
