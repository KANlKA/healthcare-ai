// auth.config.ts
// Lightweight auth config for middleware (Edge Runtime compatible - no Mongoose)
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/onboarding",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith('/profiles') ||
                          nextUrl.pathname.startsWith('/journey');

      if (isProtected && !isLoggedIn) {
        return false; // Redirects to signIn page
      }
      return true;
    },
  },
  providers: [], // Providers are added in auth.ts
} satisfies NextAuthConfig;
