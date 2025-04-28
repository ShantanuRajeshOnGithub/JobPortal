import NextAuth, { AuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import clientPromise from "@/lib/db";
import { IUser } from "../../../../models/Users";
import logger from "@/utils/serverLogger";
import GoogleProvider from "next-auth/providers/google";


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
        if (!credentials) throw new Error("No credentials provided");
        const user = await findUserByEmail(credentials.email);
        if (user && (await compare(credentials.password, user.password))) {
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id || token.sub;
        token.email = user.email;
        token.name = user.name;
  
        // For credentials login, use accountType from DB
        // For Google, fallback to 'candidate' if not found
        token.accountType = (user as any).accountType || "candidate";
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
