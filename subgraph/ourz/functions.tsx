import { ApolloQueryResult } from "@apollo/client";
import ourzSubgraph from "./index"; // Apollo Client
import {
  ALL_TOKENS,
  ALL_EDITIONS,
  ALL_USER_ADDRESSES,
  ALL_PROXY_ADDRESSES,
  SPLITS_BY_OWNER,
  SPLITS_BY_RECIPIENT,
  EDITION_INFO,
  RECIPIENTS_BY_ID,
} from "./queries"; // GraphQL Queries
import { OurProxy, SplitZNFT, SplitEdition, User, SplitRecipient } from "@/utils/OurzSubgraph";
import { formatEditionPost, NFTCard } from "../utils";

interface Data {
  ourProxy?: OurProxy;
  ourProxies?: OurProxy[];
  user?: User;
  users?: User[];
  splitZNFT?: SplitZNFT;
  splitZNFTs?: SplitZNFT[];
  splitEdition?: SplitEdition;
  splitEditions?: SplitEdition[];
}

export const getAllProfilePaths = async (): Promise<string[] | null> => {
  const queryUsers: ApolloQueryResult<Data> = await ourzSubgraph.query({
    query: ALL_USER_ADDRESSES(),
  });
  const queryProxies: ApolloQueryResult<Data> = await ourzSubgraph.query({
    query: ALL_PROXY_ADDRESSES(),
  });

  const addresses: string[] = [];
  if (queryUsers?.data && queryProxies?.data) {
    const { users } = queryUsers.data;
    users.map((user) => addresses.push(user.id));
    const { ourProxies } = queryProxies.data;
    ourProxies.map((proxy) => addresses.push(proxy.id));
  }
  return addresses;
};

export const getAllOurzTokens = async (): Promise<SplitZNFT[] | null> => {
  const query: ApolloQueryResult<Data> = await ourzSubgraph.query({
    query: ALL_TOKENS(),
  });
  if (!query.data.splitZNFTs) return null;
  return query.data.splitZNFTs;
};

export const getAllOurzEditions = async (): Promise<SplitEdition[] | null> => {
  const query: ApolloQueryResult<Data> = await ourzSubgraph.query({
    query: ALL_EDITIONS(),
  });
  if (!query.data.splitEditions) return null;
  return query.data.splitEditions;
};

/**
 * Collect Split Proxies owned by a specific address
 * @param {String} owner ethereum address
 * @returns {Object} containing all split contracts owned by owner
 */
export const getSplitRecipients = async (
  proxyAddress: string
): Promise<SplitRecipient[] | null> => {
  const query: ApolloQueryResult<Data> = await ourzSubgraph.query({
    query: RECIPIENTS_BY_ID(proxyAddress),
  });
  if (!query.data.ourProxy) return null;
  return query.data.ourProxy.splitRecipients;
};
/**
 * Collect Split Proxies owned by a specific address
 * @param {String} owner ethereum address
 * @returns {Object} containing the owners of a split
 */
export const getSplitOwners = async (proxyAddress: string): Promise<User[] | null> => {
  const query: ApolloQueryResult<Data> = await ourzSubgraph.query({
    query: RECIPIENTS_BY_ID(proxyAddress),
  });
  if (!query.data.ourProxy) return null;

  const proxyOwners = query.data.ourProxy.proxyOwners.map((owner) => owner.id);
  return proxyOwners;
};

/**
 * Collect Split Proxies owned by a specific address
 * @param {String} ownerAddress ethereum address
 * @returns {Object} containing all split contracts owned by owner
 */
export const getOwnedSplits = async (ownerAddress: string): Promise<OurProxy[] | null> => {
  const query: ApolloQueryResult<Data> = await ourzSubgraph.query({
    query: SPLITS_BY_OWNER(ownerAddress),
  });
  if (!query.data.user) return null;
  return query.data.user.ownedProxies;
};

/**
 * Collect Split Proxies claimable by a specific address
 * @param {String} recipientAddress ethereum address
 * @returns {Object} containing all split contracts claimable by recipient
 */
export const getClaimableSplits = async (
  recipientAddress: string
): Promise<SplitRecipient[] | null> => {
  const query: ApolloQueryResult<Data> = await ourzSubgraph.query({
    query: SPLITS_BY_RECIPIENT(recipientAddress),
  });
  if (!query.data.user) return null;
  return query.data.user.recipientInfo;
};

/**
 * Collect metadata for an Edition Contract
 * @param {String} editionAddress ethereum address
 * @returns {Object} containing metadata
 */
export const getEditionMetadata = async (editionAddress: string): Promise<SplitEdition | null> => {
  const query: ApolloQueryResult<Data> = await ourzSubgraph.query({
    query: EDITION_INFO(editionAddress),
  });
  if (!query.data.splitEdition) return null;
  return query.data.splitEdition;
};

/**
 * Collect metadata for an Edition Contract
 * @param {String} editionAddress ethereum address
 * @returns {Object} containing metadata
 */
export const getPostByEditionAddress = async (editionAddress: string): Promise<NFTCard | null> => {
  const query: ApolloQueryResult<Data> = await ourzSubgraph.query({
    query: EDITION_INFO(editionAddress),
  });
  if (!query.data.splitEdition) return null;
  const post = formatEditionPost(query.data.splitEdition);
  return post;
};
