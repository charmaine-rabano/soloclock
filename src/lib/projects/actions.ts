"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/projects/validation";
import { projectPath, ROUTES } from "@/lib/routes";

export interface ProjectActionState {
  ok?: boolean;
  fieldErrors?: {
    name?: string;
    clientId?: string;
    hourlyRate?: string;
    color?: string;
  };
  formError?: string;
}

function parseProject(formData: FormData) {
  return projectSchema.safeParse({
    name: formData.get("name"),
    clientId: formData.get("clientId"),
    hourlyRate: formData.get("hourlyRate"),
    color: formData.get("color"),
  });
}

export async function createProjectAction(
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const user = await requireUser();

  const parsed = parseProject(formData);
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;
    return {
      fieldErrors: {
        name: fieldErrors.name?.[0],
        clientId: fieldErrors.clientId?.[0],
        hourlyRate: fieldErrors.hourlyRate?.[0],
        color: fieldErrors.color?.[0],
      },
    };
  }

  // Project carries no userId of its own — ownership is verified by
  // confirming the target client belongs to this user before creating.
  const client = await prisma.client.findFirst({
    where: { id: parsed.data.clientId, userId: user.id },
    select: { id: true },
  });
  if (!client) {
    return { fieldErrors: { clientId: "Client not found." } };
  }

  await prisma.project.create({
    data: {
      name: parsed.data.name,
      clientId: parsed.data.clientId,
      color: parsed.data.color,
      hourlyRate: new Prisma.Decimal(parsed.data.hourlyRate).toDecimalPlaces(2),
    },
  });

  revalidatePath(ROUTES.projects);
  return { ok: true };
}

export async function updateProjectAction(
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const user = await requireUser();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { formError: "Project not found." };
  }

  const parsed = parseProject(formData);
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;
    return {
      fieldErrors: {
        name: fieldErrors.name?.[0],
        clientId: fieldErrors.clientId?.[0],
        hourlyRate: fieldErrors.hourlyRate?.[0],
        color: fieldErrors.color?.[0],
      },
    };
  }

  const client = await prisma.client.findFirst({
    where: { id: parsed.data.clientId, userId: user.id },
    select: { id: true },
  });
  if (!client) {
    return { fieldErrors: { clientId: "Client not found." } };
  }

  const { count } = await prisma.project.updateMany({
    where: { id, client: { userId: user.id } },
    data: {
      name: parsed.data.name,
      clientId: parsed.data.clientId,
      color: parsed.data.color,
      // Editing the rate only affects future calculations — already-generated
      // invoices store their own totalAmount and are never touched (SC-PRJ-04).
      hourlyRate: new Prisma.Decimal(parsed.data.hourlyRate).toDecimalPlaces(2),
    },
  });

  if (count === 0) {
    return { formError: "Project not found." };
  }

  revalidatePath(ROUTES.projects);
  revalidatePath(projectPath(id));
  return { ok: true };
}

export async function deleteProjectAction(
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const user = await requireUser();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { formError: "Project not found." };
  }

  const project = await prisma.project.findFirst({
    where: { id, client: { userId: user.id } },
    include: { _count: { select: { timeEntries: true, invoices: true } } },
  });

  if (!project) {
    return { formError: "Project not found." };
  }

  if (project._count.timeEntries > 0 || project._count.invoices > 0) {
    return {
      formError:
        "This project still has time entries or invoices. Delete those first.",
    };
  }

  await prisma.project.delete({ where: { id } });

  revalidatePath(ROUTES.projects);
  // Throws Next.js's internal NEXT_REDIRECT signal on success — must
  // propagate, not be swallowed here.
  redirect(ROUTES.projects);
}
