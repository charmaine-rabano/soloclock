import { MobileShell } from "@/components/layout/mobile-shell";
import { RunningTimerBarLive } from "@/components/layout/running-timer-bar-live";
import { TopNav } from "@/components/layout/top-nav";
import { ToastProvider } from "@/components/ui";
import { logoutAction } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/session";
import { listProjects } from "@/lib/projects/queries";
import { getRunningTimer } from "@/lib/timer/queries";

// Shell for the authenticated area. `(app)` is a route group, so these pages
// live at top-level paths (`/dashboard`, `/clients`, ...). Middleware
// (src/middleware.ts) already guarantees a session for every route rendered
// here; `requireUser()` is defense-in-depth and gives us the real user.
export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();

  // The server is the source of truth for the running timer (SC-TMR-04): a
  // fresh read on every navigation/reload, not a client-side cache. Absent
  // entirely when idle (SC-TMR-05), so the project list for the bar's
  // picker is only fetched when there's a bar to show.
  const runningTimer = await getRunningTimer(user.id);
  const projectOptions = runningTimer
    ? (await listProjects(user.id)).map((project) => ({
        id: project.id,
        name: project.name,
        color: project.color,
        clientName: project.clientName,
      }))
    : [];

  return (
    <ToastProvider>
      <div className="flex min-h-dvh flex-col">
        <TopNav userEmail={user.email} logoutAction={logoutAction} />
        <MobileShell userEmail={user.email} logoutAction={logoutAction} />
        <main className="min-w-0 flex-1">{children}</main>
        {runningTimer ? (
          <RunningTimerBarLive
            entryId={runningTimer.entryId}
            projectId={runningTimer.projectId}
            projectColor={runningTimer.projectColor}
            projectName={runningTimer.projectName}
            clientLabel={runningTimer.clientName}
            description={runningTimer.description}
            billable={runningTimer.billable}
            startedAtMs={runningTimer.startedAt.getTime()}
            projectOptions={projectOptions}
          />
        ) : null}
      </div>
    </ToastProvider>
  );
}
