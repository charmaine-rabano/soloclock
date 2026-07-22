import { redirect } from "next/navigation";

import { ROUTES } from "@/lib/routes";

// Root entry point. Auth and a real landing page arrive in later modules;
// for now the app opens straight onto the dashboard shell.
export default function Home() {
  redirect(ROUTES.dashboard);
}
