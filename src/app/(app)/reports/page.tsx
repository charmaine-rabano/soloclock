import { PageContainer } from "@/components/page-container";

export const metadata = { title: "Reports" };

export default function ReportsPage() {
  return (
    <PageContainer
      title="Reports"
      description="Monthly revenue — billed versus collected."
    >
      <div className="rounded-ui border border-dashed border-border p-8 text-muted">
        Scaffolded shell. Feature work lands in M8 — Reporting.
      </div>
    </PageContainer>
  );
}
