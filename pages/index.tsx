import styled from "@emotion/styled";
import Head from "../components/head";
import { PageWrapper } from "../styles/components";
import { AuctionsList } from "../components/AuctionsList";

export default function Home() {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <IndexWrapper>
      <Head />
      <div className="place-self-center mx-auto w-full tracking-wide text-center sm:text-xl lg:text-4xl">and so we blossom gently into the infinite garden <br /> by lani trock</div>
      <AuctionsList />
    </IndexWrapper>
  );
}

const IndexWrapper = styled(PageWrapper)`
  max-width: var(--content-width-xl);
`;
