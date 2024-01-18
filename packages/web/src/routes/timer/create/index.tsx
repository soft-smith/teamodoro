import { css } from '@emotion/react';

export const CreateTimerPage = () => {
  return (
    <form
      css={css`
        width: 100vw;
        height: 100svh;

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
        <h2>타이머 이름</h2>
        <input />
      </label>

      <label>
        <h2>시간</h2>
        <input />
      </label>

      <button type="submit">생성</button>
    </form>
  );
};
