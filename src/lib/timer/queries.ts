import { prisma } from "@/lib/prisma";

export interface RunningTimer {
  entryId: string;
  projectId: string;
  startedAt: Date;
  description: string | null;
  billable: boolean;
  projectName: string;
  projectColor: string;
  clientName: string;
}

// A "running timer" is the TimeEntry with `endedAt === null` — the only
// marker there is (see CLAUDE.md). Project/TimeEntry carry no userId of
// their own, so ownership is resolved by joining back through Client.
export async function getRunningTimer(
  userId: string,
): Promise<RunningTimer | null> {
  const entry = await prisma.timeEntry.findFirst({
    where: { endedAt: null, project: { client: { userId } } },
    select: {
      id: true,
      projectId: true,
      startedAt: true,
      description: true,
      billable: true,
      project: {
        select: { name: true, color: true, client: { select: { name: true } } },
      },
    },
  });

  if (!entry) return null;

  return {
    entryId: entry.id,
    projectId: entry.projectId,
    startedAt: entry.startedAt,
    description: entry.description,
    billable: entry.billable,
    projectName: entry.project.name,
    projectColor: entry.project.color,
    clientName: entry.project.client.name,
  };
}
