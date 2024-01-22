import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import axios from '@/api/client';
import { useNavigate } from 'react-router-dom';

export const MainPage = () => {
  const navigate = useNavigate();

  const createTeamMutation = useMutation({
    mutationFn: (name: string) =>
      axios.post<{
        data: {
          readonly id: string;
          readonly name: string;
        };
      }>('/api/team/create', { name }),
    onSuccess: ({ data: { data } }) => {
      navigate(`/team/${data.id}`);
    },
    onError: (error) => {
      // TODO: 에러 처리
      console.log(error);
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

        gap: 1rem;
      `}
    >
      <h1>teamodoro.app</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const name = formData.get('team-name') as string;
          createTeamMutation.mutate(name);
        }}
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        `}
      >
        <label>
          <h2>Enter your team name</h2>
          <input
            required
            name="team-name"
            css={css`
              width: 100%;
            `}
          />
        </label>

        <button disabled={createTeamMutation.isPending} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};
