import { css } from "@emotion/react";

export const Footer = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <footer className="bottom-0 z-50 bg-white"
    css={css`
      height: var(--footer-height);
      border-top: var(--border-black);
      a {
        text-decoration: none;
      }
    `}
  >
    <a target="_blank" href="https://zora.co" className="z-10 zora-branding" rel="noreferrer">
      ☼☽
    </a>
    <a target="_blank" href="https://docs.zora.co" className="absolute right-0 left-0 z-0 mx-auto w-1/2 text-xs tracking-widest text-center" rel="noreferrer">
      Powered by Zora
    </a>
    <a target="_blank" href="https://ourz.network" className="z-10 text-xs tracking-widest text-center" rel="noreferrer">
      Built on OURZ
    </a>
  </footer>
);
