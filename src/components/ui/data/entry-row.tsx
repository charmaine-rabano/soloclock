import { cn } from "@/lib/cn";

import { ProjectDot } from "../core/project-dot";
import { RowEditAffordance } from "./row-edit-affordance";
import { TableRow } from "./table";

const COLUMNS = "16px 168px 118px 152px 84px 1fr auto";

interface EntryRowProps {
  projectColor: string;
  projectName: string;
  clientName: string;
  timeRange: string;
  duration: string;
  description: string;
  running?: boolean;
  /** Overrides the default edit affordance — e.g. a status Tag instead. */
  trailing?: React.ReactNode;
  onEdit?: () => void;
  editHref?: string;
  first?: boolean;
  className?: string;
}

export function EntryRow({
  projectColor,
  projectName,
  clientName,
  timeRange,
  duration,
  description,
  running = false,
  trailing,
  onEdit,
  editHref,
  first = false,
  className,
}: EntryRowProps) {
  return (
    <TableRow
      columns={COLUMNS}
      first={first}
      className={cn(
        running && "border-l-[3px] border-l-accent bg-accent/9",
        className,
      )}
    >
      <ProjectDot color={projectColor} />
      <span className="truncate text-[13.5px] font-medium">{projectName}</span>
      <span className="truncate text-[12.5px] text-muted">{clientName}</span>
      <span className="font-mono text-[12.5px] text-muted">{timeRange}</span>
      <span className="font-mono text-[13.5px]">{duration}</span>
      <span className="truncate text-[12.5px] text-body">{description}</span>
      {trailing ?? <RowEditAffordance onClick={onEdit} href={editHref} />}
    </TableRow>
  );
}
