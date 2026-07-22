import { PageContainer } from "@/components/page-container";

export const metadata = { title: "Invoices" };

export default function InvoicesPage() {
  return (
    <PageContainer
      title="Invoices"
      description="Invoices generated from unbilled time entries."
    >
      <div className="rounded-ui border border-dashed border-border p-8 text-muted">
        Scaffolded shell. Feature work lands in M7 — Invoicing.
      </div>
    </PageContainer>
  );
}
