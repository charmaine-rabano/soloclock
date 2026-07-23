import { PageContainer } from "@/components/layout/page-container";

export const metadata = { title: "Clients" };

export default function ClientsPage() {
  return (
    <PageContainer
      title="Clients"
      description="The people and companies you do work for."
    >
      <div className="rounded-ui border border-dashed border-border p-8 text-muted">
        Scaffolded shell. Feature work lands in M2 — Clients.
      </div>
    </PageContainer>
  );
}
