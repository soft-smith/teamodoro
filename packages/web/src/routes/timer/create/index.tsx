import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export const CreateTimerPage = () => {
  const { teamId } = useParams();

  const navigate = useNavigate();

  const createTimerMutation = useMutation({
    mutationFn: (params: {
      readonly title: string;
      readonly duration: string;
    }) => axios.post(`/api/team/${teamId}/timer/create`, params),
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
          const duration = formData.get('duration') as string;
          createTimerMutation.mutate({ title, duration });
        }}
        css={css`
          display: flex;
          flex-direction: column;
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
          <input name="title" />
        </label>

        <label>
          <h2>시간</h2>
          <span>
            <input name="duration" /> 초
          </span>
        </label>

        <button type="submit">생성</button>
      </form>
    </div>
  );
};
