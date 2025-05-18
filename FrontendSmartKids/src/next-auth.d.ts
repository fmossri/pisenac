import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      tipo: number
    }
  }

  interface User {
    id: string
    email: string
    tipo: number
  }

  interface JWT {
    id: string
    email: string
    tipo: number
  }
}
