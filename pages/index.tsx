import styled from "@emotion/styled";
import Head from "../components/head";
import { PageWrapper } from "../styles/components";
import { AuctionsList } from "../components/AuctionsList";

export default function Home() {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <IndexWrapper>
      <Head />
      <div className="absolute right-0 left-0 mx-auto w-auto text-2xl text-center">{process.env.NEXT_PUBLIC_APP_TITLE}</div>
      <AuctionsList />
    </IndexWrapper>
  );
}

const IndexWrapper = styled(PageWrapper)`
  max-width: var(--content-width-xl);
`;
