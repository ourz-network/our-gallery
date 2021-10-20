import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FetchStaticData, MediaFetchAgent, NetworkIDs } from "@zoralabs/nft-hooks";
import NFTMasonry from "./NFTMasonry";

export const AuctionsList = () => {
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState([]);
  const router = useRouter();

  const fetchAgent = new MediaFetchAgent(process.env.NEXT_PUBLIC_NETWORK_ID as NetworkIDs);

  useEffect(() => {
    async function getTokens() {
      try {
        const res = await FetchStaticData.fetchZoraIndexerList(fetchAgent, {
          curatorAddress: '0x27f9D0aF8F4d9780dFd9895B9FbB97D313aC3f5E',
          collectionAddress: '0x27f9D0aF8F4d9780dFd9895B9FbB97D313aC3f5E',
          limit: 50,
          offset: 75,
        });
        if (res) {
          setTokens(res);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center mt-4 w-full text-center">
      {!loading ? (
        <div
          className="flex flex-col justify-center content-center space-y-2 w-full h-full lg:space-y-4 timeline xl:grid xl:space-x-5 xl:space-y-5"
          // className="flex flex-wrap gap-3 justify-center items-center my-auto"
          // css={{ display: "flex", flexWrap: "wrap", justifyContent: "center"}}
        >
          {tokens &&
            tokens.map((token) => {
              const tokenInfo = FetchStaticData.getIndexerServerTokenInfo(token);

              return (
                <NFTMasonry
                  token={token}
                  tokenInfo={tokenInfo}
                  key={tokenInfo.tokenId}
                  onClick={() =>
                    router.push(`/token/${tokenInfo.tokenContract}/${tokenInfo.tokenId}`)
                  }
                />
              );
            })}
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
};
