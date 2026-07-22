import { Nav } from "@/components/nav";

// Shell for the authenticated area. `(app)` is a route group, so these pages
// live at top-level paths (`/dashboard`, `/clients`, ...). Route protection
// is added in M1 (Authentication); this layout only provides the nav shell
// and page container that every feature module renders into.
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh">
      <Nav />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
