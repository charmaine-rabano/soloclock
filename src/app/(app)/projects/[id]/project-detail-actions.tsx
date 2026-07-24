"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";

import { Icon } from "@/components/icons";
import { Button, Modal, useToast } from "@/components/ui";
import {
  deleteProjectAction,
  type ProjectActionState,
} from "@/lib/projects/actions";
import { ROUTES } from "@/lib/routes";
import { startTimerAction, stopTimerAction } from "@/lib/timer/actions";

import { ProjectFormModal } from "../project-form-modal";

const initialDeleteState: ProjectActionState = {};

interface ProjectDetailActionsProps {
  // Plain values only — Prisma.Decimal can't cross the server/client
  // boundary, so the page converts hourlyRate with `.toNumber()` first.
  project: {
    id: string;
    name: string;
    color: string;
    clientId: string;
    hourlyRate: number;
  };
  clients: { id: string; name: string }[];
  /** Whether the currently running timer (if any) belongs to this project. */
  isRunning: boolean;
}

export function ProjectDetailActions({
  project,
  clients,
  isRunning,
}: ProjectDetailActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    deleteProjectAction,
    initialDeleteState,
  );
  const [isTimerPending, startTimerTransition] = useTransition();
  const { toast } = useToast();

  // Success redirects server-side (the component unmounts), so there's no
  // client-side moment to toast a success message from — only the block/
  // not-found failure needs one. `state` is fresh per dispatch (see
  // project-form-modal.tsx), so this fires once per attempt.
  useEffect(() => {
    if (state.formError) {
      toast({
        variant: "error",
        title: "Couldn't delete project",
        message: state.formError,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function handleStartStop() {
    startTimerTransition(async () => {
      if (isRunning) {
        await stopTimerAction();
        return;
      }

      const result = await startTimerAction(project.id);
      if (!result.ok) {
        toast({
          variant: "error",
          title: "Couldn't start timer",
          message: result.error,
        });
      } else if (result.stoppedProjectName) {
        // SC-TMR-03: starting a second timer auto-stops the first — confirm
        // it here, naming the project that got stopped.
        toast({
          title: "Timer switched",
          message: `Stopped the timer on ${result.stoppedProjectName} and started ${project.name}.`,
        });
      }
    });
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setEditOpen(true)}>
        Edit
      </Button>
      <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
        Delete
      </Button>
      <Link href={ROUTES.invoices}>
        <Button variant="secondary">View invoices</Button>
      </Link>
      {isRunning ? (
        <Button
          variant="secondary"
          onClick={handleStartStop}
          loading={isTimerPending}
        >
          <span className="size-2 rounded-xs bg-accent" />
          Stop timer
        </Button>
      ) : (
        <Button
          variant="primary"
          onClick={handleStartStop}
          loading={isTimerPending}
        >
          <Icon name="play" size={14} />
          Start timer
        </Button>
      )}

      <ProjectFormModal
        mode="edit"
        project={project}
        clients={clients}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete project"
        size="sm"
      >
        <form action={formAction} className="flex flex-col gap-3.75">
          <input type="hidden" name="id" value={project.id} />
          <p className="text-[13px] leading-relaxed text-body">
            Delete {project.name}? This can&apos;t be undone.
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
