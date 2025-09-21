import { ExpressAuth, type ExpressAuthConfig } from "@auth/express";
import Google from "@auth/express/providers/google";
import { handleUserSignIn } from "./user-sign-in";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const authConfig: ExpressAuthConfig = {
  providers: [
    Google({
      authorization: {
        params: {
          // so only vit accounts are able to log in.
          hd: "vit.ac.in",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return await handleUserSignIn(user);
    },
    async session({ session, user }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (dbUser) {
          (session.user as any).onboardingComplete = dbUser.onboardingComplete;
          (session.user as any).siteRole = dbUser.siteRole;
        }
      }
      return session;
    },
    // IDK why i am redirecting, but redirects only work when i do this.
    async redirect({ url, baseUrl }) {
      // console.log(url);
      return url;
    },
  },
};

export const expressAuthConfig = ExpressAuth(authConfig);
