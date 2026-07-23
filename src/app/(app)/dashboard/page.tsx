import { PageContainer } from "@/components/layout/page-container";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <PageContainer
      title="Dashboard"
      description="Your unbilled work, outstanding invoices, and revenue at a glance."
    >
      <div className="rounded-ui border border-dashed border-border p-8 text-muted">
        Scaffolded shell. Feature work lands in M8 — Reporting.
      </div>
    </PageContainer>
  );
}
