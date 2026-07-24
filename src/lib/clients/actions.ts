"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireUser } from "@/lib/auth/session";
import { clientSchema } from "@/lib/clients/validation";
import { prisma } from "@/lib/prisma";
import { clientPath, ROUTES } from "@/lib/routes";

export interface ClientActionState {
  ok?: boolean;
  fieldErrors?: {
    name?: string;
    email?: string;
  };
  formError?: string;
}

function parseClient(formData: FormData) {
  return clientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
}

export async function createClientAction(
  _prevState: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const user = await requireUser();

  const parsed = parseClient(formData);
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;
    return {
      fieldErrors: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
      },
    };
  }

  await prisma.client.create({
    data: {
      name: parsed.data.name,
      // `?? null`, not the bare (possibly undefined) value: Prisma treats an
      // `undefined` field as "omit", not "clear", so a blank email must be
      // written as an explicit null.
      email: parsed.data.email ?? null,
      userId: user.id,
    },
  });

  revalidatePath(ROUTES.clients);
  return { ok: true };
}

export async function updateClientAction(
  _prevState: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const user = await requireUser();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { formError: "Client not found." };
  }

  const parsed = parseClient(formData);
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;
    return {
      fieldErrors: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
      },
    };
  }

  const { count } = await prisma.client.updateMany({
    where: { id, userId: user.id },
    // `?? null`, not the bare (possibly undefined) value: Prisma treats an
    // `undefined` field as "omit", not "clear", so an updateMany with
    // `email: undefined` would silently leave the existing email in place
    // instead of clearing it when the user blanks the field.
    data: { name: parsed.data.name, email: parsed.data.email ?? null },
  });

  if (count === 0) {
    return { formError: "Client not found." };
  }

  revalidatePath(ROUTES.clients);
  revalidatePath(clientPath(id));
  return { ok: true };
}

export async function deleteClientAction(
  _prevState: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const user = await requireUser();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { formError: "Client not found." };
  }

  const client = await prisma.client.findFirst({
    where: { id, userId: user.id },
    include: { _count: { select: { projects: true } } },
  });

  if (!client) {
    return { formError: "Client not found." };
  }

  if (client._count.projects > 0) {
    return {
      formError:
        "This client still has projects. Delete or reassign them first.",
    };
  }

  await prisma.client.delete({ where: { id } });

  revalidatePath(ROUTES.clients);
  // Throws Next.js's internal NEXT_REDIRECT signal on success — must
  // propagate, not be swallowed here.
  redirect(ROUTES.clients);
}
