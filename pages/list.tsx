import styled from "@emotion/styled";
import { AuctionManager, useManageAuction } from "@zoralabs/manage-auction-hooks";
import { NFTDataContext, NFTPreview, PreviewComponents } from "@zoralabs/nft-components";
import { FetchStaticData, MediaFetchAgent } from "@zoralabs/nft-hooks";
import { useWalletButton, useWeb3Wallet } from "@zoralabs/simple-wallet-provider";
import { useContext, useEffect, useState } from "react";

import Head from "../components/head";
import { PageWrapper } from "../styles/components";

const ListItemComponent = () => {
  const {
    nft: { data },
  } = useContext(NFTDataContext);

  const { openManageAuction, openListAuction } = useManageAuction();

  if (!data || !data.nft) {
    // eslint-disable-next-line react/jsx-filename-extension
    return <></>;
  }

  if (data.pricing.reserve?.status === "Active" || data.pricing.reserve?.status === "Pending") {
    return (
      <button
        className="button"
        type="button"
        onClick={() => {
          const reserveId = data.pricing.reserve?.id;
          if (reserveId) {
            openManageAuction(parseInt(reserveId, 10));
          }
        }}
      >
        Manage
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        openListAuction(data.nft.contract.address, data.nft.tokenId);
      }}
      className="button"
    >
      List
    </button>
  );
};

const ConnectWallet = () => {
  const { buttonAction, actionText, connectedInfo } = useWalletButton();

  return (
    <div>
      <h1>{`${
        connectedInfo === undefined ? "To List your NFT Connect your wallet!" : connectedInfo
      }`}</h1>
      <button type="button" className="button" onClick={() => buttonAction()}>
        {actionText}
      </button>
    </div>
  );
};

const fetchUserNFTs = async (owner) => {
  try {
    const fetchAgent = new MediaFetchAgent(process.env.NEXT_PUBLIC_NETWORK_ID as any);

    const tokens = await FetchStaticData.fetchUserOwnedNFTs(
      fetchAgent,
      {
        collectionAddress: process.env.NEXT_PUBLIC_TARGET_CONTRACT_ADDRESS || "",
        userAddress: owner,
        limit: 200,
        offset: 0,
      },
      true
    );

    if (tokens) {
      return { data: { tokens } };
    }
  } catch (error) {
    return { error: "Error" };
  }
};

const RenderOwnedList = ({ account }: { account: string }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState(true);

  useEffect(() => {
    async function getNFTs() {
      try {
        const { data, error } = await fetchUserNFTs(account);
        if (error) {
          console.log(error);
          setLoading(false);
          // @ts-ignore
          setError(error);
        }
        if (data) {
          // @ts-ignore
          setData(data);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(error);
      }
    }

    getNFTs();
  }, [account]);

  if (!data) {
    // loading
    return <></>;
  }
  if (error) {
    // error
    return <></>;
  }

  if (!loading) {
    // @ts-ignore
    if (data.tokens.length === 0) {
      return (
        <div className="owned-list-no-tokens">
          <h2>
            We couldn’t find any NFTs you own
            <span role="img" aria-label="Sad Emoji">
              😢
            </span>
          </h2>
          <p>Make sure you’ve connected the correct wallet</p>
        </div>
      );
    }
    // @ts-ignore
    return data.tokens.map((token: any) => {
      const tokenInfo = FetchStaticData.getIndexerServerTokenInfo(token);
      return (
        <NFTPreview
          id={tokenInfo.tokenId}
          contract={tokenInfo.tokenContract}
          initialData={token}
          useBetaIndexer
          key={`${tokenInfo.tokenContract}-${tokenInfo.tokenId}`}
        >
          <div className="owned-list-item">
            <PreviewComponents.MediaThumbnail />
            <div className="list-component-wrapper">
              <ListItemComponent />
            </div>
          </div>
        </NFTPreview>
      );
    });
  }
};

const MediaThumbnailPreview = ({
  tokenContract,
  tokenId,
}: {
  tokenContract: string;
  tokenId: string;
}) => (
  // TODO(iain): Fix indexer in this use case
  <NFTPreview id={tokenId} contract={tokenContract} useBetaIndexer>
    <div className="owned-list-item">
      <PreviewComponents.MediaThumbnail />
      <div className="list-component-wrapper">
        <ListItemComponent />
      </div>
    </div>
  </NFTPreview>
);

export default function List() {
  const { account } = useWeb3Wallet();
  return (
    <>
      <Head title="List" />
      <AuctionManager
        renderMedia={MediaThumbnailPreview}
        strings={{
          LIST_MEDIA_HEADER: "List your NFT",
          LIST_MEDIA_DESCRIPTION: `Set the reserve price to list your NFT on ${process.env.NEXT_PUBLIC_APP_TITLE}`,
        }}
      >
        <ListWrapper>
          <ConnectWallet />
          {account && (
            <div className="owned-list">
              <RenderOwnedList account={account} />
            </div>
          )}
        </ListWrapper>
      </AuctionManager>
    </>
  );
}

const ListWrapper = styled(PageWrapper)`
  max-width: var(--content-width-lg);
  .owned-list {
    padding-top: var(--space-md);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .owned-list-no-tokens {
    text-align: center;
    padding-top: var(--space-sm);
  }
  .list-component-wrapper {
    padding: var(--base-unit) 0;
    border-top: var(--border-light);
  }
  .thumbnail-manage-button {
    margin: 0 auto var(--space-sm) !important;
  }
`;
