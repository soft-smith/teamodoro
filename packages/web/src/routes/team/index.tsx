import { type Timer } from '@/api/types';
import { css } from '@emotion/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export const TeamPage = () => {
  const { teamId } = useParams();

  const teamQuery = useQuery({
    queryKey: [`/api/team/${teamId}`] as const,
    queryFn: ({ queryKey: [path] }) =>
      axios.get<{
        data: {
          readonly name: string;
          readonly id: string;
          readonly timerList: readonly Timer[];
        };
      }>(path),
    select: ({ data: { data } }) => data,
  });

  if (teamQuery.status === 'error') {
    return <div>에러</div>;
  }

  if (teamQuery.status === 'pending') {
    return <div>로딩중</div>;
  }

  return (
    <div
      css={css`
        width: 100vw;
        height: 100svh;

        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
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
          <h1>팀 이름</h1>
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
          >
            링크 복사
          </button>
        </div>

        <p>{teamQuery.data.name}</p>
      </div>

      <div
        css={css`
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
          <h1>타이머 목록</h1>
          <Link to="create-timer">추가하기</Link>
        </div>

        {teamQuery.data.timerList.length === 0 ? (
          <p>타이머 없음</p>
        ) : (
          <ul
            css={css`
              list-style: none;
              display: flex;
              flex-wrap: wrap;
              gap: 4rem;

              & > li {
              }
            `}
          >
            {teamQuery.data.timerList.map((timer) => (
              <li
                key={timer.id}
                css={css`
                  width: 20rem;
                  height: 20rem;
                  border: 1px solid black;
                `}
              >
                <Link to={`timer/${timer.id}`}>{timer.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
