import { Timer } from '@/api/types';
import utils from '@/utils';
import { css } from '@emotion/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export const TeamPage = () => {
  const { teamId } = useParams();

  const teamQuery = useQuery({
    queryKey: [`/api/team/${teamId}`] as const,
    queryFn: ({ queryKey: [path] }) =>
      axios.get<{ data: { readonly id: string; readonly name: string } }>(path),
    select: ({ data: { data } }) => data,
  });

  const timerListQuery = useQuery({
    queryKey: [`/api/team/${teamId}/timer/list`] as const,
    queryFn: ({ queryKey: [path] }) =>
      axios.get<{ data: readonly Timer[] }>(path),
    select: ({ data: { data } }) => data,
    refetchInterval: 100,
  });

  if (teamQuery.status === 'error' || timerListQuery.status === 'error') {
    return <div>에러</div>;
  }

  if (teamQuery.status === 'pending' || timerListQuery.status === 'pending') {
    return <div>로딩중</div>;
  }

  return (
    <div
      css={css`
        width: 100vw;
        height: 100svh;

        display: flex;
        flex-direction: column;
        gap: 2rem;
      `}
    >
      <header
        css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
        `}
      >
        <h1>{teamQuery.data.name}</h1>

        <button
          onClick={() => {
            navigator.clipboard
              .writeText(window.location.href)
              .then(() => {
                alert('링크를 복사했습니다.');
              })
              .catch(() => {
                alert('링크를 복사하는데 실패했습니다.');
              });
          }}
          css={css`
            width: max-content;
          `}
        >
          링크 복사하기
        </button>
      </header>

      <div
        css={css`
          flex: 1;
          display: flex;
          flex-direction: column;
        `}
      >
        <div
          css={css`
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <h2>타이머 목록</h2>
          <Link to="create-timer">추가하기</Link>
        </div>

        {timerListQuery.data.length === 0 ? (
          <p
            css={css`
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            타이머 없음
          </p>
        ) : (
          <ul
            css={css`
              list-style: none;
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
              gap: 4rem;
            `}
          >
            {timerListQuery.data.map((timer) => (
              <li
                key={timer.id}
                css={css`
                  border: 1px solid black;
                `}
              >
                <Link
                  to={`timer/${timer.id}`}
                  css={css`
                    text-decoration: none;
                    color: black;

                    display: flex;
                    flex-direction: column;
                    padding: 1rem;
                  `}
                >
                  <h3
                    css={css`
                      display: -webkit-box;
                      -webkit-box-orient: vertical;
                      -webkit-line-clamp: 1;

                      word-break: break-all;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    `}
                  >
                    {timer.title}
                  </h3>

                  <p
                    css={css`
                      align-self: flex-end;
                    `}
                  >
                    {utils.time.format(timer.timeLeft)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
