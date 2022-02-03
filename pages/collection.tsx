import { GetServerSideProps } from "next";
import styled from "@emotion/styled";
import Head from "../components/head";
import { PageWrapper } from "../styles/components";
import { NFTList } from "../components/NFTList";
import { FetchStaticData } from "@zoralabs/nft-hooks";
import { useContext, useLayoutEffect } from "react";
import { SubdomainContext } from "../context/SubdomainContext";
import { getAddressFromENS } from "../utils/ethers";
import { Box, Spinner, useTheme } from "degene-sais-quoi";
import { Accent, Mode } from "degene-sais-quoi/dist/types/tokens";
import { findUser } from "../utils/SSR";

export default function Home({
  tokens,
  config,
  noSubdomain,
}: {
  tokens: any;
  config: any;
  noSubdomain: boolean;
}) {
  const { userConfig } = useContext(SubdomainContext);
  const { setMode, setAccent } = useTheme();
  useLayoutEffect(() => {
    if (userConfig?.mode) {
      setMode(userConfig?.mode as Mode);
      setAccent(userConfig?.accent as Accent);
    }
  }, [userConfig]);

  // eslint-disable-next-line react/jsx-filename-extension
  return (
    <IndexWrapper>
      {noSubdomain ? (
        <Box
          display="flex"
          flexDirection="column"
          width="full"
          justifyContent="stretch"
          alignItems="center"
          marginY="auto"
        >
          HomePage still needs work... <Spinner />
        </Box>
      ) : (
        <>
          <Head config={config ?? userConfig} />
          {userConfig?.title?.length > 0 && <h1>{userConfig.title}</h1>}
          {userConfig?.desc?.length > 0 && <h2>{userConfig.desc}</h2>}
          <NFTList tokens={tokens} />
        </>
      )}
    </IndexWrapper>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const hostname = context.req.headers.host;
  const subdomain = hostname.slice(0, hostname.indexOf("."));

  if (subdomain !== "www" && subdomain !== "") {
    try {
      const { config, contractAddresses, fetchAgent } = await findUser({ subdomain });

      const tokens = await FetchStaticData.fetchUserOwnedNFTs(
        fetchAgent,
        {
          userAddress: await getAddressFromENS(subdomain),
          collectionAddresses: [...contractAddresses],
          limit: 100,
          offset: 0,
        },
        true
      );

      return {
        props: {
          tokens,
          config,
          noSubdomain: false,
          revalidate: 10,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        props: {
          config: {},
          noSubdomain: false,
          revalidate: 10,
        },
      };
    }
  }
  return {
    props: {
      noSubdomain: true,
    },
  };
};

const IndexWrapper = styled(PageWrapper)`
  max-width: var(--content-width-xl);
`;
