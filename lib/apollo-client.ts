"use client";
// ^ this file needs the "use client" pragma

import { HttpLink } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs";

export function makeClient() {
  const httpLink = new HttpLink({
    uri: "http://localhost:3000/graphql",

    fetchOptions: {},
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}
