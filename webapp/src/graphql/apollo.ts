/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-console */
import { useMemo } from 'react';

import {
  from,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GetServerSidePropsContext } from 'next';


let apolloClient: ApolloClient<any>;

type GetAuthToken = () => Promise<string | null>;

export type ApolloClientContext = GetServerSidePropsContext;

function createApolloClient(
  ctx?: ApolloClientContext,
  getAuthToken?: GetAuthToken
) {
  const coreApiLink = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_CORE_API}`,
  });
  const coreApiAuthLink = setContext(async (_, { headers }) => {
    let authToken: string | null;

    if (getAuthToken) {
      authToken = await getAuthToken();
    } else {
      return;
    }

    return {
      headers: {
        ...headers,
        Authorization: authToken,
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(async ({ message }) => {
        console.error(`[GraphQL error]: Message: ${message}`);
      });
    if (networkError) console.error(`[Network error]: ${networkError}`);
  });

  const coreApiLinks = from([coreApiAuthLink, errorLink, coreApiLink]);

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: coreApiLinks,
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(
  ctx?: ApolloClientContext, // passed only during SSR
  initialState: any = null,
  getAuthToken?: GetAuthToken
) {
  const ac = apolloClient ?? createApolloClient(ctx, getAuthToken);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = ac.extract();
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    ac.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') {
    return ac;
  }

  // Create the Apollo Client once in the client
  if (!apolloClient) {
    apolloClient = ac;
  }

  return ac;
}

export const getApolloClient = initializeApollo;

export function useApollo(initialState: any, getAuthToken?: GetAuthToken) {
  const store = useMemo(
    () => initializeApollo(undefined, initialState, getAuthToken),
    [initialState, getAuthToken]
  );
  return store;
}
