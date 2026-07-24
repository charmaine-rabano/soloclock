import Link from "next/link";
import { notFound } from "next/navigation";

import { Icon } from "@/components/icons";
import {
  Breadcrumb,
  EmptyState,
  KpiRow,
  PageHeader,
  ProjectDot,
  StatCard,
  Table,
  TableRow,
} from "@/components/ui";
import { requireUser } from "@/lib/auth/session";
import { getClientDetail } from "@/lib/clients/queries";
import { formatHours, formatMoney } from "@/lib/format";
import { projectPath, ROUTES } from "@/lib/routes";

import { ClientDetailActions } from "./client-detail-actions";

const PROJECT_COLUMNS = "16px 1fr 120px 140px 40px";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const client = await getClientDetail(user.id, id);

  // Not found or not owned by this user both 404 (SC-AUTH-02) — the caller
  // can't distinguish "doesn't exist" from "belongs to someone else".
  if (!client) notFound();

  const createdLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(client.createdAt);
  const subtitle = client.email
    ? `${client.email} · Client since ${createdLabel}`
    : `Client since ${createdLabel}`;

  return (
    <div className="mx-auto max-w-270 px-8 pt-8 pb-16">
      <div className="mb-6 flex flex-col gap-5">
        <Breadcrumb
          items={[
            { label: "Clients", href: ROUTES.clients },
            { label: client.name },
          ]}
        />
        <PageHeader
          title={client.name}
          subtitle={subtitle}
          actions={
            <ClientDetailActions
              client={{ id: client.id, name: client.name, email: client.email }}
            />
          }
        />
      </div>

      <div className="flex flex-col gap-5">
        <KpiRow cols={3}>
          <StatCard
            label="Hours tracked"
            value={formatHours(client.hoursTrackedMs)}
            caption="billable + non-billable"
          />
          <StatCard
            label="Invoiced"
            value={formatMoney(client.amountInvoiced)}
          />
          <StatCard
            label="Unbilled"
            value={formatMoney(client.amountUnbilled)}
            caption="billable, uninvoiced"
            accent
          />
        </KpiRow>

        <div className="flex flex-col gap-2.5">
          <h2 className="text-[15px] font-semibold">Projects</h2>
          {client.projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              body="Create this client's first project to start tracking time."
            />
          ) : (
            <Table>
              {client.projects.map((project, index) => (
                <Link
                  key={project.id}
                  href={projectPath(project.id)}
                  className="block"
                >
                  <TableRow columns={PROJECT_COLUMNS} first={index === 0}>
                    <ProjectDot color={project.color} />
                    <span className="font-medium">{project.name}</span>
                    <span className="font-mono text-muted">
                      {formatMoney(project.hourlyRate)}/hr
                    </span>
                    <span className="text-right font-mono text-body">
                      {formatHours(project.trackedMs)}
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
        </div>
      </div>
    </div>
  );
}
