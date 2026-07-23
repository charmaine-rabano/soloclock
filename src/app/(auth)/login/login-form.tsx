"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

import {
  AuthCard,
  Button,
  Field,
  FieldGroup,
  FieldLabel,
  Toast,
} from "@/components/ui";
import { type AuthActionState, loginAction } from "@/lib/auth/actions";
import { ROUTES } from "@/lib/routes";

const initialState: AuthActionState = {};

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  // `state` is a fresh object on every submit, so re-surfacing the toast on a
  // repeated failure works even when the message string is unchanged.
  useEffect(() => {
    if (state.formError) setToastOpen(true);
  }, [state]);

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your workspace"
      footer={
        <>
          New here?{" "}
          <Link href={ROUTES.signup} className="text-accent-hover">
            Create an account
          </Link>
        </>
      }
    >
      <form action={formAction} className="flex flex-col gap-4.5">
        <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />
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
            error={state.fieldErrors?.email}
          />
        </FieldGroup>
        <FieldGroup>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Field
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={state.fieldErrors?.password}
          />
        </FieldGroup>
        <Button type="submit" fullWidth loading={isPending}>
          Log in
        </Button>
      </form>
      <Toast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        variant="error"
        title="Couldn't sign in"
        message={state.formError}
      />
    </AuthCard>
  );
}
