import { z } from "zod";

// Shared by both the server actions (src/lib/auth/actions.ts) and the client
// forms, so client- and server-side validation rules never drift apart
const email = z.email("Enter a valid email address.");

// Login only checks that a password was entered — the strength requirement
// is a signup-time rule, not a login-time one, and enforcing it here would
// lock out existing users if the rule ever changes.
export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

export const signupSchema = z.object({
  email,
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
export type SignupCredentials = z.infer<typeof signupSchema>;
