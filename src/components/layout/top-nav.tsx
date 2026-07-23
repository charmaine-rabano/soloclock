"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@/components/icons";
import { Button, Logo } from "@/components/ui";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/lib/routes";

import { UserMenu } from "./user-menu";

const links = [
  { href: ROUTES.dashboard, label: "Dashboard" },
  { href: ROUTES.timesheet, label: "Timesheet" },
  { href: ROUTES.clients, label: "Clients" },
  { href: ROUTES.projects, label: "Projects" },
  { href: ROUTES.invoices, label: "Invoices" },
];

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

function NavLink({ href, active, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-ui px-2.75 py-1.75 text-sm",
        active
          ? "bg-surface-hover font-semibold text-foreground"
          : "text-muted",
      )}
    >
      {children}
    </Link>
  );
}

interface TopNavProps {
  userEmail: string;
  logoutAction: () => void;
}

export function TopNav({ userEmail, logoutAction }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header className="hidden h-15 items-center gap-7.5 border-b border-border bg-field px-5.5 md:flex">
      <Link href={ROUTES.dashboard}>
        <Logo size="md" />
      </Link>

      <nav aria-label="Primary" className="flex gap-1">
        {links.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <NavLink key={link.href} href={link.href} active={active}>
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <Button variant="primary">
          <Icon name="plus" size={14} />
          New entry
        </Button>
        <UserMenu userEmail={userEmail} logoutAction={logoutAction} />
      </div>
    </header>
  );
}
