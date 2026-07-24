"use client";

import Link from "next/link";
import { useState } from "react";

import { Icon } from "@/components/icons";
import {
  Button,
  EmptyState,
  Table,
  TableHeader,
  TableRow,
} from "@/components/ui";
import type { ClientListItem } from "@/lib/clients/queries";
import { formatMoney } from "@/lib/format";
import { clientPath } from "@/lib/routes";

import { ClientFormModal } from "./client-form-modal";

const COLUMNS = "1fr 220px 120px 130px 40px";

export function ClientsView({ clients }: { clients: ClientListItem[] }) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4.5">
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Icon name="plus" size={14} />
          New client
        </Button>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          title="No clients yet"
          body="A client is a person or company you do work for. Add your first to start tracking time."
          actions={
            <Button onClick={() => setCreateOpen(true)}>New client</Button>
          }
        />
      ) : (
        <Table>
          <TableHeader columns={COLUMNS}>
            <span>Client</span>
            <span>Email</span>
            <span>Projects</span>
            <span className="text-right">Unbilled</span>
            <span />
          </TableHeader>
          {clients.map((client, index) => (
            <Link
              key={client.id}
              href={clientPath(client.id)}
              className="block"
            >
              <TableRow columns={COLUMNS} first={index === 0}>
                <span className="font-medium">{client.name}</span>
                <span className={client.email ? "text-muted" : "text-subtle"}>
                  {client.email ?? "—"}
                </span>
                <span className="text-muted">
                  {client.projectCount === 1
                    ? "1 project"
                    : `${client.projectCount} projects`}
                </span>
                <span className="text-right font-mono text-accent">
                  {formatMoney(client.unbilled)}
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

      <ClientFormModal
        mode="create"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
