import { css } from "@emotion/react";
import { NavLink } from './NavLink';

export const Footer = () => (
    // eslint-disable-next-line react/jsx-filename-extension
  <>
    <div className="flex bottom-0 z-50 flex-col justify-between items-center px-2 w-full h-20 text-center md:sticky md:justify-evenly lg:justify-between lg:px-12 md:flex-row"
      css={css`
        border-top: var(--border-black);
        background-color: var(--white);
      `}
    >
      <NavLink passHref href="/">
        <a className="hover:underline">The Collection</a>
      </NavLink>
      {/* <NavLink passHref href="/list">
        <a>List</a>
      </NavLink> */}
      <div className="my-auto w-auto text-sm tracking-widest text-center h-min">
      #### #####
      </div>
      <NavLink passHref href="/about">
        <a className="hover:underline">About the Artist</a>
      </NavLink>
    </div>
  <footer className="flex z-30 items-center w-full tracking-widest align-text-bottom bg-white"
    css={css`
    border-top: var(--border-black);
    a {
      text-decoration: none;
    }
    `}
    ><p className="p-1 m-auto">
    <a target="_blank" href="https://zora.co" rel="noreferrer">
      ☼☽
    </a>
    <a target="_blank" href="https://ourz.network"  rel="noreferrer">
    ☯
    </a></p>
  </footer>
    </>
);
