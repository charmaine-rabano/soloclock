"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Icon } from "@/components/icons";
import { Avatar, Logo } from "@/components/ui";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/lib/routes";

import { UserMenu } from "./user-menu";

const links = [
  { href: ROUTES.dashboard, label: "Dashboard" },
  { href: ROUTES.timesheet, label: "Timesheet" },
  { href: ROUTES.clients, label: "Clients" },
  { href: ROUTES.projects, label: "Projects" },
  { href: ROUTES.invoices, label: "Invoices" },
  { href: ROUTES.reports, label: "Reports" },
];

interface MobileShellProps {
  userEmail: string;
  logoutAction: () => void;
}

export function MobileShell({ userEmail, logoutAction }: MobileShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <header className="flex h-13.5 items-center gap-3.5 border-b border-border bg-field px-4.5">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
          className="cursor-pointer text-muted"
        >
          <Icon name="menu" size={20} />
        </button>
        <Logo size="sm" />
        <div className="ml-auto">
          <UserMenu
            userEmail={userEmail}
            logoutAction={logoutAction}
            avatarSize={28}
          />
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-pointer bg-scrim"
          />
          <div className="absolute inset-y-0 left-0 flex w-70 flex-col gap-2 border-r border-border-strong bg-drawer p-4.5 shadow-2xl">
            <Link
              href={ROUTES.dashboard}
              onClick={() => setOpen(false)}
              className="mb-3.5"
            >
              <Logo size="md" />
            </Link>

            {links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-ui px-3.5 py-3 text-[15px]",
                    active
                      ? "bg-surface-hover font-semibold text-foreground"
                      : "text-muted",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-auto flex items-center gap-2.5 border-t border-border pt-4">
              <Avatar initials={userEmail[0]?.toUpperCase() ?? "?"} />
              <span className="min-w-0 flex-1 truncate text-[13px] text-subtle">
                {userEmail}
              </span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="cursor-pointer text-[13px] text-muted"
                >
                  Log out
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
