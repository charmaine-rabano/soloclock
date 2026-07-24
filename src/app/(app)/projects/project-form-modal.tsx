"use client";

import { useActionState, useEffect, useState } from "react";

import {
  Button,
  ColorPicker,
  Field,
  FieldGroup,
  FieldLabel,
  FieldShell,
  FormRow,
  Modal,
  Select,
  useToast,
} from "@/components/ui";
import {
  createProjectAction,
  type ProjectActionState,
  updateProjectAction,
} from "@/lib/projects/actions";
import { randomSuggestions } from "@/lib/projects/validation";

const initialState: ProjectActionState = {};

interface ProjectFormModalProps {
  mode: "create" | "edit";
  project?: {
    id: string;
    name: string;
    clientId: string;
    color: string;
    hourlyRate: number;
  };
  clients: { id: string; name: string }[];
  defaultClientId?: string;
  open: boolean;
  onClose: () => void;
}

export function ProjectFormModal({
  mode,
  project,
  clients,
  defaultClientId,
  open,
  onClose,
}: ProjectFormModalProps) {
  const [state, formAction, isPending] = useActionState(
    mode === "create" ? createProjectAction : updateProjectAction,
    initialState,
  );
  const { toast } = useToast();

  // Controlled rather than defaultValue: React resets uncontrolled <form>
  // fields after *any* action dispatch that doesn't throw, including one
  // that returns fieldErrors — which would otherwise wipe what the user
  // typed on a failed submit.
  const [name, setName] = useState(project?.name ?? "");
  const [hourlyRate, setHourlyRate] = useState(
    project?.hourlyRate != null ? String(project.hourlyRate) : "",
  );
  // Generated once per form load and stable while the form is open (SC-PRJ-02).
  const [suggestions, setSuggestions] = useState(() => randomSuggestions(3));
  const [clientId, setClientId] = useState(
    project?.clientId ?? defaultClientId ?? "",
  );
  // Color is never blank on create: seeded from the first random suggestion.
  const [color, setColor] = useState(project?.color ?? suggestions[0]);

  // Re-seed only on the open transition — not on every keystroke, and not
  // on every prop change while the modal is already open — so a failed
  // submit (which doesn't toggle `open`) leaves typed input intact.
  useEffect(() => {
    if (!open) return;
    const freshSuggestions = randomSuggestions(3);
    setSuggestions(freshSuggestions);
    setName(project?.name ?? "");
    setClientId(project?.clientId ?? defaultClientId ?? "");
    setColor(project?.color ?? freshSuggestions[0]);
    setHourlyRate(
      project?.hourlyRate != null ? String(project.hourlyRate) : "",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // The list/detail page refreshes via `revalidatePath` inside the action —
  // closing here just dismisses the modal (no manual refresh). `state` is a
  // fresh object on every submit, so this fires exactly once per dispatch —
  // including a repeated failure with the same message text.
  useEffect(() => {
    if (state.ok) {
      toast({
        title: mode === "create" ? "Project created" : "Project updated",
      });
      onClose();
    } else if (state.formError) {
      toast({
        variant: "error",
        title:
          mode === "create"
            ? "Couldn't create project"
            : "Couldn't update project",
        message: state.formError,
      });
    }
    // `state` alone gates this; onClose/toast/mode are fresh as of the
    // render that changed `state`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const clientOptions = clients.map((client) => ({
    value: client.id,
    label: client.name,
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New project" : "Edit project"}
      size="md"
    >
      <form action={formAction} className="flex flex-col gap-3.75">
        {mode === "edit" && project ? (
          <input type="hidden" name="id" value={project.id} />
        ) : null}
        <input type="hidden" name="clientId" value={clientId} />
        <input type="hidden" name="color" value={color} />

        <FieldGroup>
          <FieldLabel htmlFor="name" required>
            Project name
          </FieldLabel>
          <Field
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={state.fieldErrors?.name}
          />
        </FieldGroup>

        <FormRow>
          <FieldGroup>
            <FieldLabel htmlFor="project-client" required>
              Client
            </FieldLabel>
            <Select
              id="project-client"
              options={clientOptions}
              value={clientId}
              onValueChange={setClientId}
              placeholder="Choose a client"
            />
            {state.fieldErrors?.clientId ? (
              <p className="text-[12.5px] text-danger-text">
                {state.fieldErrors.clientId}
              </p>
            ) : null}
          </FieldGroup>
          <FieldGroup>
            <FieldLabel htmlFor="hourlyRate" required>
              Hourly rate
            </FieldLabel>
            <FieldShell align="start">
              <span className="text-subtle">$</span>
              <input
                id="hourlyRate"
                name="hourlyRate"
                inputMode="decimal"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                aria-invalid={state.fieldErrors?.hourlyRate ? true : undefined}
                className="w-full min-w-0 bg-transparent font-mono outline-none"
              />
            </FieldShell>
            {state.fieldErrors?.hourlyRate ? (
              <p className="text-[12.5px] text-danger-text">
                {state.fieldErrors.hourlyRate}
              </p>
            ) : null}
          </FieldGroup>
        </FormRow>

        <FieldGroup>
          <FieldLabel>Project color</FieldLabel>
          <ColorPicker
            value={color}
            onChange={(next) => setColor(next.toUpperCase())}
            suggestions={suggestions}
          />
          {state.fieldErrors?.color ? (
            <p className="text-[12.5px] text-danger-text">
              {state.fieldErrors.color}
            </p>
          ) : null}
        </FieldGroup>

        <div className="flex justify-end gap-2.5">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Save project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
