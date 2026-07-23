import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ROUTES } from "@/lib/routes";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

// Guard for server actions / route handlers: rejects unauthenticated calls
// (SC-AUTH-03), as defense-in-depth beyond the middleware.
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(ROUTES.login);
  }
  return user;
}
