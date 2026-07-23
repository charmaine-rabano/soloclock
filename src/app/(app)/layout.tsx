import { MobileShell } from "@/components/layout/mobile-shell";
import { RunningTimerBar } from "@/components/layout/running-timer-bar";
import { TopNav } from "@/components/layout/top-nav";

// Shell for the authenticated area. `(app)` is a route group, so these pages
// live at top-level paths (`/dashboard`, `/clients`, ...). Route protection
// is added in M1 (Authentication); this layout only provides the nav shell
// and page container that every feature module renders into.
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <TopNav />
      <MobileShell />
      <main className="min-w-0 flex-1">{children}</main>
      <RunningTimerBar
        projectColor="#56c7d6"
        projectName="Acme Redesign"
        clientLabel="Acme Co"
        descriptionLabel="Hero section polish"
        elapsed="01:12:44"
      />
    </div>
  );
}
