"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/lib/routes";

const links = [
  { href: ROUTES.dashboard, label: "Dashboard" },
  { href: ROUTES.timesheet, label: "Timesheet" },
  { href: ROUTES.clients, label: "Clients" },
  { href: ROUTES.projects, label: "Projects" },
  { href: ROUTES.invoices, label: "Invoices" },
  { href: ROUTES.reports, label: "Reports" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 flex h-dvh w-nav shrink-0 flex-col gap-1 border-r border-border bg-surface px-3 py-5"
    >
      <Link
        href={ROUTES.dashboard}
        className="px-3 pt-1 pb-4 text-lg font-bold tracking-tight"
      >
        Soloclock
      </Link>

      {links.map((link) => {
        const active =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "rounded-ui bg-surface-hover px-3 py-2 font-semibold text-foreground"
                : "rounded-ui px-3 py-2 font-medium text-muted"
            }
          >
            {link.label}
          </Link>
        );
      })}

      <div className="mt-auto">
        <Link
          href={ROUTES.account}
          aria-current={pathname === ROUTES.account ? "page" : undefined}
          className="block rounded-ui px-3 py-2 font-medium text-muted"
        >
          Account
        </Link>
      </div>
    </nav>
  );
}
