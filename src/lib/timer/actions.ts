"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { projectPath } from "@/lib/routes";

// Unlike the clients/projects actions, these aren't bound to a <form> via
// useActionState — Start/Stop are single button clicks and the description/
// project fields save on blur/Enter, so callers invoke these directly
// (`await startTimerAction(id)`) from a client component instead of via
// `formAction`. Every action still opens with `requireUser()` and every
// write is ownership-scoped through the Client relation, matching the rest
// of the codebase's access rules.

export interface StartTimerResult {
  ok: boolean;
  error?: string;
  /** Set when starting this timer auto-stopped another one (SC-TMR-03). */
  stoppedProjectName?: string;
}

export async function startTimerAction(
  projectId: string,
): Promise<StartTimerResult> {
  const user = await requireUser();

  const project = await prisma.project.findFirst({
    where: { id: projectId, client: { userId: user.id } },
    select: { id: true },
  });
  if (!project) {
    return { ok: false, error: "Project not found." };
  }

  const startedAt = new Date();

  // SC-TMR-03: the DB must never hold two `endedAt: null` rows for the same
  // user. Auto-stop-then-create happens inside one transaction so there's
  // no window where a concurrent read could see either zero or two running
  // entries.
  const stoppedProjectName = await prisma.$transaction(async (tx) => {
    const running = await tx.timeEntry.findFirst({
      where: { endedAt: null, project: { client: { userId: user.id } } },
      select: { id: true, project: { select: { name: true } } },
    });

    if (running) {
      await tx.timeEntry.update({
        where: { id: running.id },
        data: { endedAt: startedAt },
      });
    }

    await tx.timeEntry.create({
      data: { projectId, startedAt, endedAt: null, billable: true },
    });

    return running?.project.name;
  });

  // Broad on purpose: the running timer can show on any authenticated page
  // (SC-TMR-05), so every route under the shell needs to see the new state.
  revalidatePath("/", "layout");
  return { ok: true, stoppedProjectName };
}

export interface StopTimerResult {
  ok: boolean;
}

export async function stopTimerAction(): Promise<StopTimerResult> {
  const user = await requireUser();

  // Matches zero rows (already stopped) without throwing — stopping an
  // already-stopped entry is a no-op, not an error (SC-TMR-01).
  await prisma.timeEntry.updateMany({
    where: { endedAt: null, project: { client: { userId: user.id } } },
    data: { endedAt: new Date() },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export interface UpdateRunningEntryResult {
  ok: boolean;
  error?: string;
}

export async function updateRunningDescriptionAction(
  entryId: string,
  description: string,
): Promise<UpdateRunningEntryResult> {
  const user = await requireUser();

  const { count } = await prisma.timeEntry.updateMany({
    where: {
      id: entryId,
      endedAt: null,
      project: { client: { userId: user.id } },
    },
    data: { description: description.trim() || null },
  });

  if (count === 0) {
    return { ok: false, error: "Timer is no longer running." };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateRunningBillableAction(
  entryId: string,
  billable: boolean,
): Promise<UpdateRunningEntryResult> {
  const user = await requireUser();

  const { count } = await prisma.timeEntry.updateMany({
    where: {
      id: entryId,
      endedAt: null,
      project: { client: { userId: user.id } },
    },
    data: { billable },
  });

  if (count === 0) {
    return { ok: false, error: "Timer is no longer running." };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateRunningProjectAction(
  entryId: string,
  projectId: string,
): Promise<UpdateRunningEntryResult> {
  const user = await requireUser();

  const [project, previousEntry] = await Promise.all([
    prisma.project.findFirst({
      where: { id: projectId, client: { userId: user.id } },
      select: { id: true },
    }),
    // Read-only, for revalidation below — the actual write is guarded
    // atomically by the `updateMany` filter, not by this lookup.
    prisma.timeEntry.findFirst({
      where: { id: entryId },
      select: { projectId: true },
    }),
  ]);
  if (!project) {
    return { ok: false, error: "Project not found." };
  }

  const { count } = await prisma.timeEntry.updateMany({
    where: {
      id: entryId,
      endedAt: null,
      project: { client: { userId: user.id } },
    },
    data: { projectId },
  });

  if (count === 0) {
    return { ok: false, error: "Timer is no longer running." };
  }

  revalidatePath("/", "layout");
  // The project detail page's totals depend on which project the running
  // entry belongs to, so both the old and new project's pages need a
  // refresh too.
  if (previousEntry) revalidatePath(projectPath(previousEntry.projectId));
  revalidatePath(projectPath(projectId));
  return { ok: true };
}
