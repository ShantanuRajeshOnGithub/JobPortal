import NextAuth, { AuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import clientPromise from "@/lib/db";
import { IUser } from "../../../../models/Users";
import logger from "@/utils/serverLogger";

// Replace with your user lookup logic
async function findUserByEmail(email: string): Promise<IUser | null> {
  const client = await clientPromise;
  const db = client.db("HireHaven");
  const user = await db.collection("users").findOne({ email });
  return user ? (user as IUser) : null;
}
// Extend the User type locally
interface ExtendedUser extends NextAuthUser {
  id: string;
  accountType: "candidate" | "employee";
}
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }
        const user = await findUserByEmail(credentials.email);
        if (user && (await compare(credentials.password, user.password))) {
          console.log("authorize function got user:", user);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            accountType: user.accountType,
          };
        }
        throw new Error("Invalid email or password");
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.id = extendedUser.id;
        token.email = extendedUser.email;
        token.name = extendedUser.name;
        token.accountType = extendedUser.accountType;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        accountType: token.accountType,
      } as ExtendedUser;
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
