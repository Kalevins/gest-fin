import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";

import { client } from "@/lib/apolloClient";
import { Layout } from "@/components/layout";
import { Toaster } from "@/components/ui/toaster";

import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {

  return (
    <ApolloProvider client={client}>
      <SessionProvider session={pageProps.session}>
        <Toaster />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </ApolloProvider>
  )
}
