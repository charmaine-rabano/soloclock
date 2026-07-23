import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ROUTES } from "@/lib/routes";

import { LoginForm } from "./login-form";

export const metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect(ROUTES.dashboard);
  }

  const { callbackUrl } = await searchParams;

  return <LoginForm callbackUrl={callbackUrl} />;
}
