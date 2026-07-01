import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import type { DiscordProfile } from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,

      authorization: {
        params: {
          scope: "identify guilds",
        },
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const discordProfile = profile as DiscordProfile;

        token.accessToken = account.access_token;

        token.id = discordProfile.id;
        token.username = discordProfile.username;
        token.displayName =
          discordProfile.global_name ?? discordProfile.username;

        token.avatar = discordProfile.avatar
          ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
          : null;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;

      session.user = {
        id: token.id as string,
        username: token.username as string,
        displayName: token.displayName as string,
        avatar: token.avatar as string | null,
      };

      return session;
    },
  },
};
