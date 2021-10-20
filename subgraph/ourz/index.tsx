import { ApolloClient, InMemoryCache } from "@apollo/client";

// Ourz Rinkeby subgraph
const APIURL = "https://api.thegraph.com/subgraphs/name/nickadamson/ourzrinkebyv1";

// Create client
const ourzSubgraph = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

// Export clients
export default ourzSubgraph;
