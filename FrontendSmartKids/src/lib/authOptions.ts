import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log('Authorizing with credentials:', credentials);
          const res = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              senha: credentials?.password,
            }),
          });

          const data = await res.json();
          console.log('Login response:', data);

          if (res.ok && data.token) {
            // Use the user data directly from the login response
            return {
              id: String(data.user.idUsuario),
              email: data.user.email,
              tipo: data.user.tipoUsuario,
              token: data.token
            };
          }
          
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {


      
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.tipo = user.tipo;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback - Session:', session);
      
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.tipo = token.tipo as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
