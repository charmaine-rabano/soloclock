"use client";

import { useEffect, useState, useTransition } from "react";

import { InlineTextField, Tag, TableRow, useToast } from "@/components/ui";
import { formatClock } from "@/lib/format";
import { updateRunningDescriptionAction } from "@/lib/timer/actions";

const COLUMNS = "90px 150px 84px 1fr auto";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

interface RunningEntryRowProps {
  entryId: string;
  startedAtMs: number;
  description: string | null;
  first?: boolean;
}

// The project detail page's "Recent time entries" table is otherwise fully
// server-rendered; the one running entry (there's ever at most one, SC-TMR-03)
// needs a client component so its duration ticks live and its description
// stays editable while it runs (SC-TMR-01, SC-TMR-02).
export function RunningEntryRow({
  entryId,
  startedAtMs,
  description,
  first = false,
}: RunningEntryRowProps) {
  const [elapsedMs, setElapsedMs] = useState(() => Date.now() - startedAtMs);
  const [, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const tick = () => setElapsedMs(Date.now() - startedAtMs);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAtMs]);

  function handleCommit(next: string) {
    startTransition(async () => {
      const result = await updateRunningDescriptionAction(entryId, next);
      if (!result.ok) {
        toast({
          variant: "error",
          title: "Couldn't update description",
          message: result.error,
        });
      }
    });
  }

  const startedAt = new Date(startedAtMs);

  return (
    <TableRow
      columns={COLUMNS}
      first={first}
      className="border-l-[3px] border-l-accent bg-accent/9"
    >
      <span className="font-mono text-[12.5px] text-muted">
        {dateFormatter.format(startedAt)}
      </span>
      <span className="font-mono text-[12.5px] text-muted">
        {timeFormatter.format(startedAt)} – now
      </span>
      <span className="font-mono text-[13.5px] font-semibold text-accent tabular-nums">
        {formatClock(elapsedMs)}
      </span>
      <InlineTextField
        value={description ?? ""}
        onCommit={handleCommit}
        placeholder="Add a description"
        ariaLabel="Timer description"
        className="text-[12.5px] text-body"
      />
      <Tag status="running">RUNNING</Tag>
    </TableRow>
  );
}
