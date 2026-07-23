"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Avatar } from "@/components/ui";
import { ROUTES } from "@/lib/routes";

interface UserMenuProps {
  userEmail: string;
  logoutAction: () => void;
  avatarSize?: number;
}

// Clicking the avatar opens a small menu (Account / Log out) instead of
// navigating straight to the account page.
export function UserMenu({
  userEmail,
  logoutAction,
  avatarSize,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const initials = userEmail[0]?.toUpperCase() ?? "?";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="cursor-pointer"
      >
        <Avatar initials={initials} size={avatarSize} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute top-full right-0 z-50 mt-2 w-56 rounded-ui border border-border bg-drawer py-1 shadow-2xl"
        >
          <div className="truncate border-b border-border px-3.5 py-2.5 text-[13px] text-subtle">
            {userEmail}
          </div>
          <Link
            href={ROUTES.account}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-3.5 py-2.5 text-[13px] text-foreground hover:bg-surface-hover"
          >
            Account
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              role="menuitem"
              className="w-full cursor-pointer px-3.5 py-2.5 text-left text-[13px] text-foreground hover:bg-surface-hover"
            >
              Log out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
