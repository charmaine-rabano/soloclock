import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

// Uses the edge-safe config only (no Prisma/bcrypt) — reads the JWT from the
// cookie at the edge, so route protection (SC-AUTH-03) needs no DB call.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
