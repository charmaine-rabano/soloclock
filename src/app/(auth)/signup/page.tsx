import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ROUTES } from "@/lib/routes";

import { SignupForm } from "./signup-form";

export const metadata = { title: "Sign up" };

export default async function SignupPage() {
  const session = await auth();
  if (session?.user) {
    redirect(ROUTES.dashboard);
  }

  return <SignupForm />;
}
