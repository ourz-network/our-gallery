import { FullComponents, NFTFullPage } from "@zoralabs/nft-components";
import React, { useState } from "react";
import { Signer } from "ethers";
import DetailedPie from "@/components/Charts/DetailedPie";
import Table from "@/components/Charts/Table";
import { SplitRecipient } from "@/utils/OurzSubgraph";
import ShareSection from "@/common/components/Cards/FPShareSection";
import { purchaseEdition } from "@/modules/ethereum/OurPylon";
import { NFTCard } from "@/modules/subgraphs/utils";
import ManageEditionSection from "./FPManageEditionSection";
import Button from "@/components/Button";

const FullPageNFT = ({
  post,
  isOwner,
  chartData,
  recipients,
  saleInfo,
  signer,
}: {
  post: NFTCard;
  isOwner: boolean;
  chartData: {
    name: string;
    shares: number;
  }[];
  recipients: SplitRecipient[];
  saleInfo: {
    maxSupply: number;
    currentSupply: number;
    salePrice: number;
    whitelistOnly: boolean;
  };
  signer: Signer;
}): JSX.Element => {
  const [videoError, setVideoError] = useState(false);
  const purchase = async () => {
    const success = await purchaseEdition({
      signer,
      editionAddress: post.editionAddress as string,
      salePrice: saleInfo.salePrice,
    });
    if (!success) {
      // eslint-disable-next-line no-console
      console.log(`ERROR PURCHASING EDITION`);
      // eslint-disable-next-line no-console
    } else console.log(`SUCCESSFULLY PURCHASED EDITION`);
  };

  const MediaThumb = (): JSX.Element => (
    <div className="flex object-contain justify-center p-2 border-b md:p-8 max-h-75vh border-dark-border bg-dark-accent md:min-h-33vh">
      {!post.mimeType && !videoError && <p>loading...</p>}
      {post?.mimeType?.startsWith("image") && (
        <img
          alt={`${post.name} Thumbnail`}
          src={post.contentURI}
          className="object-contain max-w-full max-h-full"
        />
      )}
      {post?.mimeType?.startsWith("video") && (
        <video muted autoPlay controls={false} loop playsInline>
          <source src={post.contentURI} />
        </video>
      )}
    </div>
  );

  const MediaInfo = (): JSX.Element => (
    <div className="flex flex-col justify-between space-y-2 h-full">
      <p className="text-xl tracking-wider lg:text-4xl font-hero text-dark-primary">
        {!post.name ? `Untitled` : post.name}
      </p>
      <p className="whitespace-pre-wrap break-words text-dark-primary">
        {!post.description ? `No Description` : post.description}
      </p>
    </div>
  );

  const QuickLinks = (): JSX.Element => (
    <div className="flex flex-col my-2 border border-dark-border">
      <p className="p-4 w-full text-xs border-b h-min tracking-2-wide border-dark-border">
        PROOF OF AUTHENTICITY
      </p>
      <a
        className="hover:underline hover:cursor"
        href={`https://rinkeby.etherscan.io/address/${post.editionAddress}#code`}
      >
        <p className="p-4 w-full text-base font-semibold border-b h-min border-dark-border">
          View on Etherscan.io
        </p>
      </a>
      <a className="hover:underline hover:cursor" href={post.contentURI}>
        <p className="p-4 w-full text-base font-semibold border-b h-min border-dark-border">
          View on IPFS
        </p>
      </a>
      <p className="p-4 w-full text-base font-semibold border-b h-min border-dark-border hover:cursor-not-allowed">
        {/* <a
                        className="hover:underline hover:cursor"
                        href={`https://zora.co/?contracts%5B0%5D%5BtokenAddress%5D=/${metadata.id}`}
                      > */}
        <s>View on Zora</s> <i>Coming Soon!</i>
      </p>
      {/* </a> */}
    </div>
  );

  const RoyaltySection = (): JSX.Element => (
    <div className="flex flex-col p-4 my-2 text-center border border-dark-border">
      <p className="mb-4 text-sm tracking-wide">EIP-2981 Creator Royalty:</p>
      <p className="text-2xl font-semibold font-hero">{`${post.royalty}%`}</p>
    </div>
  );

  return (
    <>
      {post?.nftKind === "Edition" && (
        <div className="w-full h-full">
          <div className="flex object-contain justify-center p-2 border-b md:p-8 max-h-75vh text-dark-primary border-dark-border bg-dark-accent md:min-h-33vh">
            {!post.mimeType && !videoError && <p>loading...</p>}
            {post.mimeType.startsWith("video") && !videoError ? (
              <video
                onError={() => setVideoError(true)}
                muted
                autoPlay
                controls={false}
                loop
                playsInline
              >
                <source src={post.contentURI} />
              </video>
            ) : (
              <img
                className="object-contain max-w-full max-h-full cont"
                alt={`${post.name}`}
                src={post.contentURI}
              />
            )}
          </div>
          {post && (
            <div className="p-6 mx-auto mb-16 text-dark-primary max-w-11/12 xl:max-w-5/6">
              <div className="flex flex-col content-center mb-6 w-full lg:space-x-4 lg:flex-row">
                <div className="flex flex-col xl:w-7/12">
                  <div className="flex flex-col justify-between">
                    <div className="flex justify-between mb-2 h-full">
                      <p className="my-auto text-xl tracking-wider lg:text-4xl font-hero text-dark-primary">{`${post.name}`}</p>
                      <p className="my-auto text-lg italic text-dark-primary">{`(${post.symbol})`}</p>
                    </div>
                    <p className="whitespace-pre-wrap break-words text-dark-primary">{`${post.description}`}</p>
                  </div>
                  <div className="flex justify-center mt-4 w-full h-auto border border-dark-border">
                    <div className="p-1 m-2 text-center">
                      <p className="mb-1">
                        {saleInfo.maxSupply > 0
                          ? `${saleInfo.currentSupply}/${saleInfo.maxSupply}`
                          : `${saleInfo.currentSupply}/∞`}
                        <br />
                        Minted
                      </p>

                      {saleInfo.salePrice > 0 && saleInfo.maxSupply !== saleInfo.currentSupply && (
                        <div className="w-min">
                          <Button
                            onClick={() => purchase()}
                            text={`Purchase for ${saleInfo.salePrice}Ξ`}
                            isMain={false}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <QuickLinks />
                  {isOwner && <ManageEditionSection post={post} signer={signer} />}
                </div>
                <div className="flex flex-col xl:mt-0 xl:w-5/12 xl:ml-6">
                  <RoyaltySection />
                  {recipients?.length > 1 && <Table recipients={recipients} />}
                  {chartData?.length > 1 && (
                    <div className="h-96 border border-dark-border">
                      <div className="m-auto w-96 h-96">
                        <DetailedPie chartData={chartData} secondaryBool={false} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {post?.nftKind === "1/1" && (
        <NFTFullPage id={post.tokenId as string}>
          <MediaThumb />
          <div className="p-6 mx-auto mb-6 max-w-11/12 xl:max-w-5/6">
            <div className="flex flex-col content-center mb-6 w-full lg:space-x-4 lg:flex-row">
              <div className="flex flex-col space-y-2 lg:w-7/12">
                <div className="flex flex-col justify-between mb-4 md:flex-row">
                  {post && <MediaInfo />}
                  <div className="hidden my-auto md:block">
                    <FullComponents.PlaceOfferButton />
                  </div>
                </div>
                <FullComponents.AuctionInfo />
                <div className="my-2">
                  <FullComponents.ProofAuthenticity />
                </div>
              </div>
              <div className="flex flex-col space-y-2 xl:mt-0 xl:w-5/12 xl:ml-6">
                <FullComponents.CreatorEquity />
                <FullComponents.BidHistory />
                {recipients?.length > 1 && <Table recipients={recipients} />}
                {chartData?.length > 1 && (
                  <div className="h-96 border border-dark-border">
                    <div className="m-auto w-96 h-96">
                      <DetailedPie chartData={chartData} secondaryBool={false} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {isOwner && <ShareSection post={post} />}
          </div>
        </NFTFullPage>
      )}
    </>
  );
};

export default FullPageNFT;
