"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Icon } from "@/components/icons";
import {
  Button,
  EmptyState,
  ProjectDot,
  Select,
  Table,
  TableHeader,
  TableRow,
} from "@/components/ui";
import type { ClientOption } from "@/lib/clients/queries";
import { formatHours, formatMoney } from "@/lib/format";
import type { ProjectListItem } from "@/lib/projects/queries";
import { projectPath, ROUTES } from "@/lib/routes";

import { ProjectFormModal } from "./project-form-modal";

const COLUMNS = "16px 1fr 160px 100px 130px 40px";
const ALL_CLIENTS = "all";

export function ProjectsView({
  projects,
  clients,
}: {
  projects: ProjectListItem[];
  clients: ClientOption[];
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState(ALL_CLIENTS);

  const filterOptions = useMemo(
    () => [
      { value: ALL_CLIENTS, label: "All clients", separatorAfter: true },
      ...clients.map((client) => ({ value: client.id, label: client.name })),
    ],
    [clients],
  );

  const filteredProjects =
    clientFilter === ALL_CLIENTS
      ? projects
      : projects.filter((project) => project.clientId === clientFilter);

  return (
    <div className="flex flex-col gap-4.5">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <div className="flex items-center gap-2.5">
          {clients.length > 0 ? (
            <Select
              options={filterOptions}
              value={clientFilter}
              onValueChange={setClientFilter}
              className="w-50"
              compact
            />
          ) : null}
          <Button
            onClick={() => setCreateOpen(true)}
            disabled={clients.length === 0}
          >
            <Icon name="plus" size={14} />
            New project
          </Button>
        </div>
      </header>

      {clients.length === 0 ? (
        <EmptyState
          title="Add a client first"
          body="Projects belong to a client. Create one to start adding projects."
          actions={
            <Link href={ROUTES.clients}>
              <Button>New client</Button>
            </Link>
          }
        />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          body="A project is billable work under a client. Add your first to start tracking time."
          actions={
            <Button onClick={() => setCreateOpen(true)}>New project</Button>
          }
        />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          variant="no-results"
          title="No projects for this client"
          body="Try selecting a different client or clear the filter."
          actions={
            <Button
              variant="secondary"
              onClick={() => setClientFilter(ALL_CLIENTS)}
            >
              Clear filter
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader columns={COLUMNS}>
            <span />
            <span>Project</span>
            <span>Client</span>
            <span>Rate</span>
            <span className="text-right">Unbilled hrs</span>
            <span />
          </TableHeader>
          {filteredProjects.map((project, index) => (
            <Link
              key={project.id}
              href={projectPath(project.id)}
              className="block"
            >
              <TableRow columns={COLUMNS} first={index === 0}>
                <ProjectDot color={project.color} />
                <span className="font-medium">{project.name}</span>
                <span className="text-muted">{project.clientName}</span>
                <span className="font-mono">
                  {formatMoney(project.hourlyRate)}
                </span>
                <span className="text-right font-mono text-accent">
                  {formatHours(project.unbilledMs)}
                </span>
                <Icon
                  name="chevron-right"
                  size={14}
                  className="ml-auto text-subtle"
                />
              </TableRow>
            </Link>
          ))}
        </Table>
      )}

      <ProjectFormModal
        mode="create"
        clients={clients}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
