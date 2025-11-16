"use client";

import { makeClient } from "@/lib/apollo-client";
import { ApolloNextAppProvider } from "@apollo/client-integration-nextjs";

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
