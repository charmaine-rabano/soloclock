"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

interface InlineTextFieldProps {
  value: string;
  onCommit: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}

// A text input styled to look like plain text until focused — used where an
// otherwise-static label (a running timer's description) needs to become
// editable in place without disturbing its surrounding layout. Commits on
// blur or Enter; Escape reverts to the last committed value and blurs.
export function InlineTextField({
  value,
  onCommit,
  placeholder,
  ariaLabel,
  className,
}: InlineTextFieldProps) {
  const [draft, setDraft] = useState(value);

  // Re-syncs when the committed value changes for a reason other than this
  // input (e.g. a fresh server read after navigating back to the page).
  useEffect(() => {
    setDraft(value);
  }, [value]);

  function commit() {
    const next = draft.trim();
    if (next !== value) onCommit(next);
  }

  return (
    <input
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        } else if (event.key === "Escape") {
          setDraft(value);
          event.currentTarget.blur();
        }
      }}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={cn(
        "min-w-0 bg-transparent outline-none placeholder:text-subtle",
        className,
      )}
    />
  );
}
