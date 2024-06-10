import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: '/api/graphql', // La URL de tu API GraphQL
  cache: new InMemoryCache()
});
