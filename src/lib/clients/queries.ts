import { Prisma } from "@prisma/client";

import { durationMs } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export interface ClientListItem {
  id: string;
  name: string;
  email: string | null;
  projectCount: number;
  unbilled: number;
}

export async function listClients(userId: string): Promise<ClientListItem[]> {
  const clients = await prisma.client.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { projects: true } },
      projects: {
        select: {
          hourlyRate: true,
          timeEntries: {
            where: {
              billable: true,
              invoiceId: null,
              endedAt: { not: null },
            },
            select: { startedAt: true, endedAt: true },
          },
        },
      },
    },
  });

  return clients.map((client) => {
    // NOTE: the Unbilled total is aggregated here in application code — this
    // query pulls every billable, uninvoiced, completed TimeEntry for the
    // user and sums hourlyRate * duration in JS (kept in Prisma.Decimal,
    // never floats). Cost scales with the user's total open time-entry
    // count, not the number of clients shown on the page. That's fine for a
    // solo-contractor dataset; if a user's entry count ever grows large,
    // replace this with a Postgres-side grouped aggregation (a raw SQL SUM
    // over the Client → Project → TimeEntry join) instead of fetching raw
    // rows. Deliberate tradeoff for now, not an oversight.
    const unbilled = client.projects.reduce((clientTotal, project) => {
      const projectUnbilled = project.timeEntries.reduce((sum, entry) => {
        // `endedAt` is guaranteed non-null by the `where` filter above.
        const hours = durationMs(entry.startedAt, entry.endedAt!) / 3_600_000;
        return sum.add(project.hourlyRate.mul(hours));
      }, new Prisma.Decimal(0));
      return clientTotal.add(projectUnbilled);
    }, new Prisma.Decimal(0));

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      projectCount: client._count.projects,
      // Converted to a plain number here, not left as a Prisma.Decimal: this
      // DTO crosses into a "use client" component (ClientsView), and Decimal
      // instances lose their prototype methods when serialized across that
      // server/client boundary. All the Decimal-precision math is already
      // done above; this is the formatting-safe boundary to drop to number.
      unbilled: unbilled.toNumber(),
    };
  });
}

export interface ClientOption {
  id: string;
  name: string;
}

export async function listClientOptions(
  userId: string,
): Promise<ClientOption[]> {
  return prisma.client.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export interface ClientDetailProject {
  id: string;
  name: string;
  color: string;
  hourlyRate: Prisma.Decimal;
  trackedMs: number;
}

export interface ClientDetail {
  id: string;
  name: string;
  email: string | null;
  createdAt: Date;
  hoursTrackedMs: number;
  amountInvoiced: Prisma.Decimal;
  amountUnbilled: Prisma.Decimal;
  projects: ClientDetailProject[];
}

export async function getClientDetail(
  userId: string,
  id: string,
): Promise<ClientDetail | null> {
  const client = await prisma.client.findFirst({
    where: { id, userId },
    include: {
      projects: {
        orderBy: { name: "asc" },
        include: {
          timeEntries: {
            select: {
              startedAt: true,
              endedAt: true,
              billable: true,
              invoiceId: true,
            },
          },
          invoices: { select: { totalAmount: true, status: true } },
        },
      },
    },
  });

  if (!client) return null;

  let hoursTrackedMs = 0;
  let amountUnbilled = new Prisma.Decimal(0);

  const projects: ClientDetailProject[] = client.projects.map((project) => {
    let trackedMs = 0;
    for (const entry of project.timeEntries) {
      // Running timers (`endedAt == null`) are excluded from every total —
      // deterministic, documented assumption (SC-CLI-04).
      if (!entry.endedAt) continue;
      const ms = durationMs(entry.startedAt, entry.endedAt);
      trackedMs += ms;
      hoursTrackedMs += ms;
      if (entry.billable && entry.invoiceId === null) {
        amountUnbilled = amountUnbilled.add(
          project.hourlyRate.mul(ms / 3_600_000),
        );
      }
    }
    return {
      id: project.id,
      name: project.name,
      color: project.color,
      hourlyRate: project.hourlyRate,
      trackedMs,
    };
  });

  const amountInvoiced = client.projects
    .flatMap((project) => project.invoices)
    .filter((invoice) => invoice.status !== "void")
    .reduce(
      (sum, invoice) => sum.add(invoice.totalAmount),
      new Prisma.Decimal(0),
    );

  return {
    id: client.id,
    name: client.name,
    email: client.email,
    createdAt: client.createdAt,
    hoursTrackedMs,
    amountInvoiced,
    amountUnbilled,
    projects,
  };
}

export async function getClientForEdit(userId: string, id: string) {
  return prisma.client.findFirst({
    where: { id, userId },
    select: { id: true, name: true, email: true },
  });
}
