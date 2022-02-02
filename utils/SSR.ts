import { NetworkIDs } from "@ourz/our-hooks";
import { MediaFetchAgent } from "@zoralabs/nft-hooks";
import { UserConfig } from "../context/SubdomainContext";
import clientPromise from "../mongodb/client";

export const findUser = async ({
  subdomain,
}: {
  subdomain: string;
}): Promise<{ config: UserConfig; contractAddresses: string[]; fetchAgent: MediaFetchAgent }> => {
  const client = await clientPromise;
  const collection = await client.db().collection("ourGallery");
  const config = await collection.findOne({ _id: `${subdomain}` });

  const contractAddresses: string[] =
    config?.contracts?.split(",") ?? JSON.parse(process.env.NEXT_PUBLIC_MAINNET_CONTRACTS);
  if (contractAddresses.at(-1) === "") {
    contractAddresses.pop();
  }

  const fetchAgent = new MediaFetchAgent(
    (config?.networkId as unknown as NetworkIDs) ?? (1 as unknown as NetworkIDs)
  );

  return { config, contractAddresses, fetchAgent };
};
