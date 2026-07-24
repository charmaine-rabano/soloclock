import { Prisma } from "@prisma/client";

import { durationMs } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export interface ProjectListItem {
  id: string;
  name: string;
  color: string;
  clientId: string;
  clientName: string;
  hourlyRate: number;
  unbilledMs: number;
}

export async function listProjects(
  userId: string,
  clientId?: string,
): Promise<ProjectListItem[]> {
  const projects = await prisma.project.findMany({
    where: {
      client: { userId },
      ...(clientId ? { clientId } : {}),
    },
    orderBy: { name: "asc" },
    include: {
      client: { select: { id: true, name: true } },
      timeEntries: {
        where: {
          billable: true,
          invoiceId: null,
          endedAt: { not: null },
        },
        select: { startedAt: true, endedAt: true },
      },
    },
  });

  return projects.map((project) => {
    const unbilledMs = project.timeEntries.reduce((sum, entry) => {
      // `endedAt` is guaranteed non-null by the `where` filter above.
      return sum + durationMs(entry.startedAt, entry.endedAt!);
    }, 0);

    return {
      id: project.id,
      name: project.name,
      color: project.color,
      clientId: project.client.id,
      clientName: project.client.name,
      // Converted to a plain number here, not left as a Prisma.Decimal: this
      // DTO crosses into a "use client" component (ProjectsView), and Decimal
      // instances lose their prototype methods when serialized across that
      // server/client boundary.
      hourlyRate: project.hourlyRate.toNumber(),
      unbilledMs,
    };
  });
}

export interface ProjectDetailEntry {
  id: string;
  startedAt: Date;
  endedAt: Date | null;
  description: string | null;
  billable: boolean;
  running: boolean;
}

export interface ProjectDetail {
  id: string;
  name: string;
  color: string;
  hourlyRate: Prisma.Decimal;
  client: { id: string; name: string };
  totalHoursMs: number;
  unbilledHoursMs: number;
  unbilledAmount: Prisma.Decimal;
  recentEntries: ProjectDetailEntry[];
}

export async function getProjectDetail(
  userId: string,
  id: string,
): Promise<ProjectDetail | null> {
  const project = await prisma.project.findFirst({
    where: { id, client: { userId } },
    include: {
      client: { select: { id: true, name: true } },
      timeEntries: {
        orderBy: { startedAt: "desc" },
        take: 12,
        select: {
          id: true,
          startedAt: true,
          endedAt: true,
          description: true,
          billable: true,
          invoiceId: true,
        },
      },
    },
  });

  if (!project) return null;

  let totalHoursMs = 0;
  let unbilledHoursMs = 0;
  let unbilledAmount = new Prisma.Decimal(0);

  for (const entry of project.timeEntries) {
    // Running timers (`endedAt == null`) are excluded from every total —
    // deterministic, documented assumption (matches SC-CLI-04).
    if (!entry.endedAt) continue;
    const ms = durationMs(entry.startedAt, entry.endedAt);
    // Total hours includes non-billable time (SC-PRJ-05).
    totalHoursMs += ms;
    if (entry.billable && entry.invoiceId === null) {
      unbilledHoursMs += ms;
      unbilledAmount = unbilledAmount.add(
        project.hourlyRate.mul(ms / 3_600_000),
      );
    }
  }

  const recentEntries: ProjectDetailEntry[] = project.timeEntries.map(
    (entry) => ({
      id: entry.id,
      startedAt: entry.startedAt,
      endedAt: entry.endedAt,
      description: entry.description,
      billable: entry.billable,
      running: entry.endedAt === null,
    }),
  );

  return {
    id: project.id,
    name: project.name,
    color: project.color,
    hourlyRate: project.hourlyRate,
    client: project.client,
    totalHoursMs,
    unbilledHoursMs,
    unbilledAmount,
    recentEntries,
  };
}

export async function getProjectForEdit(userId: string, id: string) {
  const project = await prisma.project.findFirst({
    where: { id, client: { userId } },
    select: {
      id: true,
      name: true,
      clientId: true,
      color: true,
      hourlyRate: true,
    },
  });
  if (!project) return null;
  return {
    ...project,
    hourlyRate: project.hourlyRate.toNumber(),
  };
}
