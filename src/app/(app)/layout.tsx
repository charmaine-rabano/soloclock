import { MobileShell } from "@/components/layout/mobile-shell";
import { RunningTimerBar } from "@/components/layout/running-timer-bar";
import { TopNav } from "@/components/layout/top-nav";
import { ToastProvider } from "@/components/ui";
import { logoutAction } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/session";

// Shell for the authenticated area. `(app)` is a route group, so these pages
// live at top-level paths (`/dashboard`, `/clients`, ...). Middleware
// (src/middleware.ts) already guarantees a session for every route rendered
// here; `requireUser()` is defense-in-depth and gives us the real user.
export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();

  return (
    <ToastProvider>
      <div className="flex min-h-dvh flex-col">
        <TopNav userEmail={user.email} logoutAction={logoutAction} />
        <MobileShell userEmail={user.email} logoutAction={logoutAction} />
        <main className="min-w-0 flex-1">{children}</main>
        <RunningTimerBar
          projectColor="#56c7d6"
          projectName="Acme Redesign"
          clientLabel="Acme Co"
          descriptionLabel="Hero section polish"
          elapsed="01:12:44"
        />
      </div>
    </ToastProvider>
  );
}
