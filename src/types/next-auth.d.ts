import type { DefaultSession } from "next-auth";

// Augment Auth.js's session/JWT types with the `id` field our `jwt`/`session`
// callbacks (src/auth.config.ts) put on the token, so `session.user.id` and
// `token.id` type-check everywhere they're read (e.g. src/lib/auth/session.ts).
// `email` is narrowed to a required `string` (not `string | null`) because
// our Credentials `authorize` (src/auth.ts) always returns one from `User`.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
  }
}
