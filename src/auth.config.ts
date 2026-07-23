import type { NextAuthConfig } from "next-auth";

import { ROUTES } from "@/lib/routes";

// Routes that render the (unauthenticated) auth screens themselves.
const AUTH_ROUTES: string[] = [ROUTES.login, ROUTES.signup];

// Every path inside the (app) route group — these require a session.
const PROTECTED_ROUTES: string[] = [
  ROUTES.dashboard,
  ROUTES.timesheet,
  ROUTES.clients,
  ROUTES.projects,
  ROUTES.invoices,
  ROUTES.reports,
  ROUTES.account,
];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

// Edge-safe Auth.js config: no Prisma / bcrypt imports here, since this file
// is also loaded by src/middleware.ts, which runs on the Edge runtime. The
// Node-only Credentials provider (authorize callback) lives in src/auth.ts.
export const authConfig = {
  pages: {
    signIn: ROUTES.login,
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      if (AUTH_ROUTES.some((route) => matchesRoute(pathname, route))) {
        // Already signed in — no reason to see the login/signup screens.
        if (isLoggedIn) {
          return Response.redirect(new URL(ROUTES.dashboard, request.nextUrl));
        }
        return true;
      }

      if (PROTECTED_ROUTES.some((route) => matchesRoute(pathname, route))) {
        // `false` makes Auth.js redirect to `pages.signIn` with the
        // originally requested URL appended as `callbackUrl`.
        return isLoggedIn;
      }

      // Everything else (`/`, `/reference`) is public.
      return true;
    },
  },
} satisfies NextAuthConfig;
