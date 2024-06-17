import { ApolloClient, InMemoryCache } from '@apollo/client';

// Cliente de Apollo para realizar consultas a la API de GraphQL
export const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache()
});
