import { css } from '@emotion/react';

export const MainPage = () => {
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
      <h1
        css={css`
          margin: 0;
        `}
      >
        teamodoro.app
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
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
            type="text"
            css={css`
              width: 100%;
            `}
          />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
