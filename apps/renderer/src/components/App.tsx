import React from "react";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@graphql/client";

import { Routes } from "@pages";

export interface AppProps {}

export function App({}: AppProps) {
    return (
        <ApolloProvider client={apolloClient}>
            <Routes />
        </ApolloProvider>
    );
}
