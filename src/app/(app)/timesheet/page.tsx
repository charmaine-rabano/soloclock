import { PageContainer } from "@/components/page-container";

export const metadata = { title: "Timesheet" };

export default function TimesheetPage() {
  return (
    <PageContainer
      title="Timesheet"
      description="Tracked time grouped by day or project, with filters."
    >
      <div className="rounded-ui border border-dashed border-border p-8 text-muted">
        Scaffolded shell. Feature work lands in M6 — Timesheet.
      </div>
    </PageContainer>
  );
}
