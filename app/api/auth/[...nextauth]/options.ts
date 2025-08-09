import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  // Secret for Next-auth, without this JWT encryption/decryption won't work
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user, account }) => {
      console.log("JWT Callback:", { token, user, account });
      // Store access_token directly on token
      if (account?.access_token) {
        token.access_token = account.access_token;
      }

      return token;
    },
    session({ session, token }: { session: any; token: JWT }) {
      console.log("Session Callback:", { session, token });
      // Copy access_token from token to session
      session.accessToken = token.access_token;
      if (token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
  // Configure one or more authentication providers
  providers: [
    {
      id: "zitadel", // Unique identifier for the provider
      name: "Zitadel", // Name of the provider
      type: "oauth", // Provider type
      wellKnown: process.env.AUTH_OIDC_WELL_KNOWN,
      clientId: process.env.AUTH_OIDC_CLIENT_ID, // Client ID for authentication from environment variable
      clientSecret: process.env.AUTH_OIDC_CLIENT_SECRET, // Client Secret for authentication from environment variable
      authorization: {
        params: { scope: "openid email profile offline_access" },
      },
      profile(profile) {
        // Log essential information when a user logs in
        console.log("User logged in", { userId: profile.sub });
        console.log(profile);

        return {
          id: profile.sub, // User ID from the profile
          username: profile.sub?.toLowerCase(), // Username (converted to lowercase)
          name: `${profile.given_name} ${profile.family_name}`, // Full name from given and family names
          email: profile.email, // User email
        };
      },
    },
  ],
};
