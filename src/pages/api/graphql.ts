import { NextApiRequest, NextApiResponse } from 'next';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { Role, MovementType } from '@prisma/client';
import { gql } from 'graphql-tag';
import { prisma } from '@/lib/auth';

// Definición de tipos de GraphQL
const typeDefs = gql`
  enum Role {
    ADMIN
    USER
  }

  enum MovementType {
    INCOME
    EXPENSE
  }

  type User {
    id: ID!
    name: String!
    email: String!
    phone: String!
    role: Role!
  }

  type Movement {
    id: ID!
    concept: String!
    amount: Float!
    date: String!
    user: User!
    type: MovementType!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User!
    movements: [Movement!]!
    movement(id: ID!): Movement!
  }

  type Mutation {
    editUser(
      id: ID!,
      name: String!,
      role: Role!
    ): User!
    createMovement(
      concept: String!,
      amount: Float!,
      date: String!,
      type: MovementType!
    ): Movement!
  }
`;

// Resolvers de GraphQL
const resolvers = {
  Query: {
    users: async (_: any, __: any, context: any) => {
      // Verifica si el usuario está autenticado
      if(!context.user) {
        throw new Error(`Unauthorized`);
      }

      return await prisma.user.findMany();
    },
    user: async (_: any, args: { id: string }, context: any) => {
      // Verifica si el usuario está autenticado
      if(!context.user) {
        throw new Error(`Unauthorized`);
      }

      return await prisma.user.findUnique({ where: { id: args.id } });
    },
    movements: async (_: any, __: any, context: any) => {
      // Verifica si el usuario está autenticado
      if(!context.user) {
        throw new Error(`Unauthorized`);
      }

      return await prisma.movement.findMany({
        include: {
          user: true
        }
      });
    },
    movement: async (_: any, args: { id: string }, context: any) => {
      // Verifica si el usuario está autenticado
      if(!context.user) {
        throw new Error(`Unauthorized`);
      }

      return await prisma.movement.findUnique({ where: { id: args.id } });
    }
  },
  Mutation: {
    editUser: async (_: any, args: { id: string, name: string, email: string, role: Role }, context: any) => {
      // Verifica si el usuario está autenticado y es administrador
      if (context.user.role !== Role.ADMIN) {
        throw new Error(`Unauthorized`);
      }

      return await prisma.user.update({
        where: { id: args.id },
        data: {
          name: args.name,
          role: args.role
        }
      });
    },
    createMovement: async (_: any, args: { concept: string, amount: number, date: string, type: MovementType }, context: any) => {
      // Verifica si el usuario está autenticado y es administrador
      if (context.user.role !== Role.ADMIN) {
        throw new Error(`Unauthorized`);
      }

      return await prisma.movement.create({
        data: {
          concept: args.concept,
          amount: args.amount,
          date: args.date,
          type: args.type,
          userId: context.user.id
        },
      });
    }
  }
};

// Creación del servidor de Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Función para obtener el usuario autenticado
async function getLoggedInUser(req: NextApiRequest) {
  const res = await fetch('http://localhost:3000/api/auth/session', {
    headers: {
      cookie: req.headers.cookie || ''
    }
  });
  const data = await res.json();
  return data?.user
}

// Exporta el servidor de Apollo con el handler de Next.js
export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({ req, res, user: await getLoggedInUser(req) }),
});