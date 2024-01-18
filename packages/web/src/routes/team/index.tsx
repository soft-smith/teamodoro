import { css } from '@emotion/react';
import { Link } from 'react-router-dom';

export const TeamPage = () => {
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
          <button>링크 복사</button>
        </div>

        <p>123</p>
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
          <li>
            <Link to="timer/123">타이머 이름</Link>
          </li>

          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
          <li>
            <Link to="timer/456">타이머 이름</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
