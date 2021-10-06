/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react"; // React state management
import { ReserveAuctionPartialFragment } from "@zoralabs/nft-hooks/dist/graph-queries/zora-graph-types";
import { TokenWithAuctionFragment } from "@zoralabs/nft-hooks/dist/graph-queries/zora-indexer-types";
import { useZNFT } from "@zoralabs/nft-hooks";
import {ethers} from "ethers"

declare let window: any;

interface Token {
  nft: {
    tokenData: TokenWithAuctionFragment;
    auctionData: ReserveAuctionPartialFragment;
  };
}

interface TokenInfo {
  tokenId: string;
  tokenContract: string;
  metadata: any;
  image: any;
}

const NFTMasonry = ({
  token,
  tokenInfo,
  onClick,
}: {
  token: Token;
  tokenInfo: TokenInfo;
  onClick: () => void;
}) => {
  const { media, metadata } = token.nft.tokenData;
  const [contentURI, setContentURI] = useState<string | undefined>();
  const [json, setJSON] = useState<any | undefined>();
  const [prettyAddress, setPrettyAddress] = useState<string | null>()

  const [isHover, setIsHover] = useState<boolean | boolean>(true);

  useEffect(() => {
    function setState() {
      if (contentURI !== media?.contentURI) {
        setContentURI(media.contentURI);
      }
      if (json !== metadata?.json) {
        setJSON(metadata.json);
      }
    }
    setState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media, metadata]);

  const zNFTData = useZNFT(`${tokenInfo.tokenId}`);

  /**       ---  Dual-axis Masonry Layout  ---
   * For Landing Page: hide posts until they are loaded
   * and then set classname of "`orientation`-`ratio`"
   */

  const [aspectRatio, setAspectRatio] = useState<string | string>("");

  const calcAspectRatio = (loadedMedia) => {
    let ratio;
    let width;
    let height;

    if (loadedMedia.target.naturalWidth) {
      // Photo
      width = loadedMedia.target.naturalWidth;
      height = loadedMedia.target.naturalHeight;
      ratio = width / height;
    } else if (loadedMedia.target.videoWidth) {
      // Video
      width = Number(loadedMedia.target.videoWidth);
      height = Number(loadedMedia.target.videoHeight);
      ratio = width / height;
    } else {
      setAspectRatio("hidden");
    }

    if (ratio > 0.8 && ratio < 1.24) {
      // Mostly Square
      setAspectRatio("square");
    }

    if (ratio > 1.21) {
      // landscape
      if (ratio < 1.3) {
        setAspectRatio("landscape-4x5");
      } else if (ratio < 1.385) {
        setAspectRatio("landscape-3x4");
      } else if (ratio < 1.5) {
        setAspectRatio("landscape-5x7");
      } else if (ratio < 1.68) {
        setAspectRatio("landscape-2x3");
      } else if (ratio < 1.9) {
        setAspectRatio("landscape-9x16");
      } else if (ratio < 2.5) {
        setAspectRatio("landscape-2x1");
      } else {
        setAspectRatio("landscape-widest");
      }
    }

    if (ratio <= 0.83) {
      // portrait
      if (ratio >= 0.765) {
        setAspectRatio("portrait-4x5");
      } else if (ratio >= 0.735) {
        setAspectRatio("portrait-3x4");
      } else if (ratio >= 0.685) {
        setAspectRatio("portrait-5x7");
      } else if (ratio >= 0.605) {
        setAspectRatio("portrait-2x3");
      } else if (ratio >= 0.53) {
        setAspectRatio("portrait-9x16");
      } else if (ratio > 0.41) {
        setAspectRatio("portrait-2x1");
      } else {
        setAspectRatio("portrait-tallest");
      }
    }
  };

  const container = (child) => (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={`m-auto transition-shadow ${aspectRatio} landingPage-item shadow-deep cursor-hover`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => onClick()}
    >
      {child}
    </div>
  );

  function toTrimmedAddress(address: string): string {
    if (!address) return "";
    return `${address.substr(0, 5)}…${address.substr(address.length - 3, address.length)}`;
  }

  async function lookupENS(address: string): Promise<string | null> {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        return provider.lookupAddress(address)
      }
      return null
    } catch (error) {
      console.log(error);
      return null
    }
  }

  useEffect(() => {
    async function getPrettyAddress(address: string) {
      const ens = await lookupENS(address)
      if (ens) {
        setPrettyAddress(ens)
      } else {
        setPrettyAddress(toTrimmedAddress(address))
      }
    }
    if (!prettyAddress && zNFTData?.data?.nft?.owner) {
      getPrettyAddress(zNFTData.data.nft.owner)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zNFTData?.data?.nft?.owner])

  if (json?.mimeType?.includes("video")) {
    const child = (
      <div className="flex flex-col justify-center cursor-pointer">
        <div className="object-cover relative bg-transparent">

            <div className="flex absolute z-20 flex-col justify-evenly p-8 w-full h-full tracking-tighter text-white text-opacity-0 bg-black bg-opacity-0 transition-all duration-200 delay-75 translate-y-3 hover:justify-evenly hover:text-opacity-100 hover:tracking-wider hover:bg-opacity-100 hover:translate-y-10">
            {/* <div className="flex absolute bottom-0 z-20 justify-between items-center w-full text-white bg-black bg-opacity-75"> */}
              <div className="text-2xl text-center">
                {tokenInfo.metadata.name}
              <br />
                <p className="truncate whitespace-pre-wrap break-words">
                  {tokenInfo.metadata.description}
                </p>
              </div>
              <div className="flex-col items-center space-y-1 text-sm text-center">
                #{tokenInfo.tokenId} <br />
                {prettyAddress && (
                  `${prettyAddress}`
                )}
              </div>
            </div>

          <video
            muted
            autoPlay
            controls={false}
            loop
            playsInline
            onLoadedMetadata={(metadata) => calcAspectRatio(metadata)}
          >
            <source src={media.contentURI} />
          </video>
        </div>
      </div>
    );
    return container(child);
  }

  if (json?.mimeType?.includes("image")) {
    const child = (
      <div className="flex flex-col justify-center cursor-pointer">
        <div className="object-cover relative bg-transparent">
          {isHover && (
            <div className="flex absolute z-20 flex-col justify-evenly p-8 w-full h-full tracking-tighter text-white text-opacity-0 bg-black bg-opacity-0 transition-all duration-200 delay-75 translate-y-3 hover:justify-evenly hover:text-opacity-100 hover:tracking-wider hover:bg-opacity-100 hover:translate-y-10">
            {/* <div className="flex absolute bottom-0 z-20 justify-between items-center w-full text-white bg-black bg-opacity-75"> */}
              <div className="text-2xl text-center">
                {tokenInfo.metadata.name}
              <br />
                <p className="truncate break-words">
                  {tokenInfo.metadata.description}
                </p>
              </div>
              <div className="flex-col items-center space-y-1 text-sm text-center">
                #{tokenInfo.tokenId} <br />
                {prettyAddress && (
                  `${prettyAddress}`
                )}
              </div>
            </div>
          )}
          <img
            alt={tokenInfo.metadata.name}
            src={media?.contentURI || null}
            className="w-full h-full"
            onLoad={(loadedMedia) => {
              calcAspectRatio(loadedMedia);
            }}
          />
        </div>
      </div>
    );
    return container(child);
  }
  return <> </>;
  // return container();
};

export default NFTMasonry;
