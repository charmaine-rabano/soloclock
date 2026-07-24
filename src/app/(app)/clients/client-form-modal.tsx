"use client";

import { useActionState, useEffect } from "react";

import {
  Button,
  Field,
  FieldGroup,
  FieldLabel,
  Modal,
  useToast,
} from "@/components/ui";
import {
  type ClientActionState,
  createClientAction,
  updateClientAction,
} from "@/lib/clients/actions";

const initialState: ClientActionState = {};

interface ClientFormModalProps {
  mode: "create" | "edit";
  client?: { id: string; name: string; email: string | null };
  open: boolean;
  onClose: () => void;
}

export function ClientFormModal({
  mode,
  client,
  open,
  onClose,
}: ClientFormModalProps) {
  const [state, formAction, isPending] = useActionState(
    mode === "create" ? createClientAction : updateClientAction,
    initialState,
  );
  const { toast } = useToast();

  // The list/detail page refreshes via `revalidatePath` inside the action —
  // closing here just dismisses the modal (SC-CLI-02: no manual refresh).
  // `state` is a fresh object on every submit, so this fires exactly once per
  // dispatch — including a repeated failure with the same message text.
  useEffect(() => {
    if (state.ok) {
      toast({ title: mode === "create" ? "Client created" : "Client updated" });
      onClose();
    } else if (state.formError) {
      toast({
        variant: "error",
        title:
          mode === "create"
            ? "Couldn't create client"
            : "Couldn't update client",
        message: state.formError,
      });
    }
    // `state` alone gates this; onClose/toast/mode are fresh as of the
    // render that changed `state`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New client" : "Edit client"}
      size="sm"
    >
      <form action={formAction} className="flex flex-col gap-3.75">
        {mode === "edit" && client ? (
          <input type="hidden" name="id" value={client.id} />
        ) : null}
        <FieldGroup>
          <FieldLabel htmlFor="name" required>
            Name
          </FieldLabel>
          <Field
            id="name"
            name="name"
            defaultValue={client?.name}
            error={state.fieldErrors?.name}
          />
        </FieldGroup>
        <FieldGroup>
          <FieldLabel htmlFor="email" optional>
            Email
          </FieldLabel>
          <Field
            id="email"
            name="email"
            type="email"
            defaultValue={client?.email ?? ""}
            error={state.fieldErrors?.email}
          />
        </FieldGroup>
        <div className="flex justify-end gap-2.5">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Save client
          </Button>
        </div>
      </form>
    </Modal>
  );
}
