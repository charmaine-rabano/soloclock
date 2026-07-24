"use client";

import { useActionState, useEffect, useState } from "react";

import { Icon } from "@/components/icons";
import { Button, Modal, useToast } from "@/components/ui";
import {
  type ClientActionState,
  deleteClientAction,
} from "@/lib/clients/actions";

import { ClientFormModal } from "../client-form-modal";

const initialDeleteState: ClientActionState = {};

interface ClientDetailActionsProps {
  client: { id: string; name: string; email: string | null };
}

export function ClientDetailActions({ client }: ClientDetailActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    deleteClientAction,
    initialDeleteState,
  );
  const { toast } = useToast();

  // Success redirects server-side (the component unmounts), so there's no
  // client-side moment to toast a success message from — only the block/
  // not-found failure needs one. `state` is fresh per dispatch (see
  // client-form-modal.tsx), so this fires once per attempt.
  useEffect(() => {
    if (state.formError) {
      toast({
        variant: "error",
        title: "Couldn't delete client",
        message: state.formError,
      });
    }
    // `state` alone gates this; `toast` is fresh as of the render that
    // changed `state`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      <Button variant="secondary" onClick={() => setEditOpen(true)}>
        Edit
      </Button>
      <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
        Delete
      </Button>
      {/* Project creation lands in M3 — stubbed here rather than dropped from
          the header, matching the mockup's primary action slot. */}
      <Button variant="primary" disabled>
        <Icon name="plus" size={14} />
        New project
      </Button>

      <ClientFormModal
        mode="edit"
        client={client}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete client"
        size="sm"
      >
        <form action={formAction} className="flex flex-col gap-3.75">
          <input type="hidden" name="id" value={client.id} />
          <p className="text-[13px] leading-relaxed text-body">
            Delete {client.name}? This can&apos;t be undone.
          </p>
          <div className="flex justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" loading={isPending}>
              Delete
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
