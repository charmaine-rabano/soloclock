"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { hashPassword } from "@/lib/auth/password";
import { loginSchema, signupSchema } from "@/lib/auth/validation";
import { prisma } from "@/lib/prisma";
import { ROUTES } from "@/lib/routes";

export interface AuthActionState {
  fieldErrors?: {
    email?: string;
    password?: string;
  };
  formError?: string;
}

function parseCredentials(
  schema: typeof loginSchema | typeof signupSchema,
  formData: FormData,
) {
  return schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
}

export async function signupAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = parseCredentials(signupSchema, formData);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  const { email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { fieldErrors: { email: "That email is already registered." } };
  }

  const hashed = await hashPassword(password);
  await prisma.user.create({ data: { email, password: hashed } });

  // Throws Next.js's internal NEXT_REDIRECT signal on success — must
  // propagate, not be swallowed here.
  await signIn("credentials", {
    email,
    password,
    redirectTo: ROUTES.dashboard,
  });

  return {};
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = parseCredentials(loginSchema, formData);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  const { email, password } = parsed.data;
  const callbackUrl = formData.get("callbackUrl");
  const redirectTo =
    typeof callbackUrl === "string" && callbackUrl.length > 0
      ? callbackUrl
      : ROUTES.dashboard;

  try {
    await signIn("credentials", { email, password, redirectTo });
  } catch (error) {
    if (error instanceof AuthError) {
      return { formError: "Incorrect email or password." };
    }
    // The NEXT_REDIRECT success signal (and anything else unexpected) must
    // keep propagating.
    throw error;
  }

  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: ROUTES.login });
}
