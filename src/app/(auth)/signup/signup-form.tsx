"use client";

import Link from "next/link";
import { type FormEvent, useActionState, useState } from "react";
import { z } from "zod";

import {
  AuthCard,
  Button,
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui";
import { type AuthActionState, signupAction } from "@/lib/auth/actions";
import { signupSchema } from "@/lib/auth/validation";
import { ROUTES } from "@/lib/routes";

const initialState: AuthActionState = {};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState,
  );
  const [clientErrors, setClientErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Mirrors the server's signupSchema so obviously-invalid submissions
  // never round-trip
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const parsed = signupSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      event.preventDefault();
      const fieldErrors = z.flattenError(parsed.error).fieldErrors;
      setClientErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setClientErrors({});
  }

  const emailError = clientErrors.email ?? state.fieldErrors?.email;
  const passwordError = clientErrors.password ?? state.fieldErrors?.password;

  return (
    <AuthCard
      title="Create your account"
      subtitle="Track time, bill clients, get paid."
      footer={
        <>
          Already have one?{" "}
          <Link href={ROUTES.login} className="text-accent-hover">
            Log in
          </Link>
        </>
      }
    >
      <form
        action={formAction}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4.5"
      >
        <FieldGroup>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Field
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={emailError}
          />
        </FieldGroup>
        <FieldGroup>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Field
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={passwordError}
          />
          {!passwordError ? (
            <p className="text-[12.5px] text-subtle">At least 8 characters.</p>
          ) : null}
        </FieldGroup>
        <Button type="submit" fullWidth loading={isPending}>
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
