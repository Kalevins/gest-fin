// pages/api/graphql.ts
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { PrismaClient } from '@prisma/client';
import { gql } from 'graphql-tag';

const prisma = new PrismaClient();

// Definir el esquema GraphQL
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
  }
`;

// Definir los resolvers
const resolvers = {
  Query: {
    users: async () => await prisma.user.findMany(),
    user: async (_: any, args: { id: string }) => await prisma.user.findUnique({ where: { id: args.id } })
  },
  Mutation: {
    createUser: async (_: any, args: { name: string, email: string }) => {
      return await prisma.user.create({
        data: {
          name: args.name,
          email: args.email
        }
      });
    }
  }
};

// Crear la instancia de Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

export default startServerAndCreateNextHandler(server);
