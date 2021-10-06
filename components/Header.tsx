/* eslint-disable jsx-a11y/anchor-is-valid */
import { css } from "@emotion/react";
import { NavLink } from "./NavLink";

export const Header = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <>
    <header className="px-12 w-full"
      css={css`
        height: var(--header-height);
        position: sticky;
        top: 0;
        z-index: var(--header-z);
        border-bottom: var(--border-black);
        background-color: var(--white);
      `}
    >
      <NavLink passHref href="/">
        <a>The Collection</a>
      </NavLink>
      {/* <NavLink passHref href="/list">
        <a>List</a>
      </NavLink> */}
      <div className="absolute right-0 left-0 mx-auto w-1/2 text-sm tracking-widest text-center h-min">
        LANI TROCK
      </div>
      <NavLink passHref href="/about">
        <a>About the Artist</a>
      </NavLink>
    </header>
  </>
);
