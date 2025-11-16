"use client";

import { ApolloProvider } from "@apollo/client/react";
import client from "@/lib/apollo-client";

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
