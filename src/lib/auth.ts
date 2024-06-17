import NextAuth from "next-auth"
import Auth0Provider from "next-auth/providers/auth0"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

// Configuración de NextAuth
export const prisma = new PrismaClient().$extends(withAccelerate())

// Exporta handlers de autenticación
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH_AUTH0_ID,
      clientSecret: process.env.AUTH_AUTH0_SECRET,
      issuer: process.env.AUTH_AUTH0_ISSUER,
    })
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id
      return session
    },
  }
})
