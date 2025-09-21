import { ExpressAuth, type ExpressAuthConfig } from "@auth/express";
import Google from "@auth/express/providers/google";

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
    // IDK why i am redirecting, but redirects only work when i do this.
    async redirect({ url, baseUrl }) {
      // console.log(url);
      return url;
    },
  },
};

export const expressAuthConfig = ExpressAuth(authConfig);
