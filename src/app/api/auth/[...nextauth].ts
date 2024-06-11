import NextAuth, { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  providers: [],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      // Add properties to the session object
      session.user = token.user as typeof session.user;
      return session;
    },
    async jwt({ token, user }) {
      // Add properties to the JWT token
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  // Add more NextAuth configuration options here if needed
};

export default NextAuth(authOptions);
