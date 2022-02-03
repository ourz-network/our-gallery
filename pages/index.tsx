import { FetchStaticData } from "@zoralabs/nft-hooks";
import { useContext, useLayoutEffect } from "react";
import { GetServerSideProps } from "next";
import styled from "@emotion/styled";
import { Box, Spinner, useTheme } from "degene-sais-quoi";
import Head from "../components/head";
import { PageWrapper } from "../styles/components";
import { NFTList } from "../components/NFTList";
import { SubdomainContext } from "../context/SubdomainContext";
import { getAddressFromENS } from "../utils/ethers";
import { findUser } from "../utils/SSR";

export default function Home({
  tokens,
  config,
  noSubdomain,
}: {
  tokens?: any;
  config?: any;
  noSubdomain?: boolean;
}) {
  const { userConfig } = useContext(SubdomainContext);
  const { setMode, setAccent } = useTheme();
  useLayoutEffect(() => {
    if (userConfig?.mode) {
      setMode(userConfig?.mode);
      setAccent(userConfig?.accent);
    }
  }, [userConfig]);

  // eslint-disable-next-line react/jsx-filename-extension
  return (
    <IndexWrapper>
      {noSubdomain ? (
        //TODO make homepage for subdomain-less url
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
          <Head config={userConfig ?? config} />
          <h1>{userConfig?.title ? userConfig.title : config?.title ?? ""}</h1>
          <h2>{userConfig?.desc ? userConfig.desc : config?.desc ?? ""}</h2>
          <NFTList tokens={tokens} />
        </>
      )}
    </IndexWrapper>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const hostname = context.req.headers?.host;
  const subdomain = hostname?.slice(0, hostname.indexOf("."));

  // sorry www.eth
  if (subdomain !== "www" && subdomain !== "") {
    try {
      const { config, contractAddresses, fetchAgent } = await findUser({ subdomain });

      const tokens = await FetchStaticData.fetchZoraIndexerList(fetchAgent, {
        curatorAddress: config?.curator ?? (await getAddressFromENS(subdomain)),
        collectionAddresses: [...contractAddresses],
        limit: 100,
        offset: 0,
      });

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
      revalidate: 60,
    },
  };
};

const IndexWrapper = styled(PageWrapper)`
  max-width: var(--content-width-xl);
`;
