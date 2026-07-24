import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumb,
  EmptyState,
  KpiRow,
  PageHeader,
  StatCard,
  Table,
  TableRow,
  Tag,
} from "@/components/ui";
import { requireUser } from "@/lib/auth/session";
import { listClientOptions } from "@/lib/clients/queries";
import { formatHours, formatMoney } from "@/lib/format";
import { getProjectDetail } from "@/lib/projects/queries";
import { clientPath, ROUTES } from "@/lib/routes";

import { ProjectDetailActions } from "./project-detail-actions";

const ENTRY_COLUMNS = "90px 150px 84px 1fr auto";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const [project, clients] = await Promise.all([
    getProjectDetail(user.id, id),
    listClientOptions(user.id),
  ]);

  // Not found or not owned by this user both 404 (matches SC-AUTH-02)
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-270 px-8 pt-8 pb-16">
      <div className="mb-6 flex flex-col gap-5">
        <Breadcrumb
          items={[
            { label: "Projects", href: ROUTES.projects },
            { label: project.name },
          ]}
        />
        <PageHeader
          title={project.name}
          rail={project.color}
          subtitle={
            <>
              <Link
                href={clientPath(project.client.id)}
                className="text-accent"
              >
                {project.client.name}
              </Link>{" "}
              · {formatMoney(project.hourlyRate)}/hr
            </>
          }
          actions={
            <ProjectDetailActions
              project={{
                id: project.id,
                name: project.name,
                color: project.color,
                clientId: project.client.id,
                hourlyRate: project.hourlyRate.toNumber(),
              }}
              clients={clients}
            />
          }
        />
      </div>

      <div className="flex flex-col gap-5">
        <KpiRow cols={3}>
          <StatCard
            label="Total hours"
            value={formatHours(project.totalHoursMs)}
            caption="incl. non-billable"
          />
          <StatCard
            label="Unbilled hours"
            value={formatHours(project.unbilledHoursMs)}
          />
          <StatCard
            label="Unbilled amount"
            value={formatMoney(project.unbilledAmount)}
            accent
          />
        </KpiRow>

        <div className="flex flex-col gap-2.5">
          <h2 className="text-[15px] font-semibold">Recent time entries</h2>
          {project.recentEntries.length === 0 ? (
            <EmptyState
              title="No time entries yet"
              body="Time tracked on this project will show up here."
            />
          ) : (
            <Table>
              {project.recentEntries.map((entry, index) => {
                const end = entry.endedAt ?? new Date();
                const timeRange = entry.running
                  ? `${timeFormatter.format(entry.startedAt)} – now`
                  : `${timeFormatter.format(entry.startedAt)} – ${timeFormatter.format(end)}`;
                const durationMs = end.getTime() - entry.startedAt.getTime();

                return (
                  <TableRow
                    key={entry.id}
                    columns={ENTRY_COLUMNS}
                    first={index === 0}
                    className={
                      entry.running
                        ? "border-l-[3px] border-l-accent bg-accent/9"
                        : undefined
                    }
                  >
                    <span className="font-mono text-[12.5px] text-muted">
                      {dateFormatter.format(entry.startedAt)}
                    </span>
                    <span className="font-mono text-[12.5px] text-muted">
                      {timeRange}
                    </span>
                    <span
                      className={
                        entry.running
                          ? "font-mono text-[13.5px] font-semibold text-accent"
                          : "font-mono text-[13.5px]"
                      }
                    >
                      {formatHours(durationMs)}
                    </span>
                    <span className="truncate text-[12.5px] text-body">
                      {entry.description ?? "—"}
                    </span>
                    {entry.running ? (
                      <Tag status="running">RUNNING</Tag>
                    ) : !entry.billable ? (
                      <Tag status="non-billable">NON-BILLABLE</Tag>
                    ) : (
                      <span />
                    )}
                  </TableRow>
                );
              })}
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
