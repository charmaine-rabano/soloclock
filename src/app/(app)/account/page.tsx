import { PageContainer } from "@/components/layout/page-container";

export const metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <PageContainer
      title="Account"
      description="Your signed-in email and session."
    >
      <div className="rounded-ui border border-dashed border-border p-8 text-muted">
        Scaffolded shell. Feature work lands in M1 — Authentication.
      </div>
    </PageContainer>
  );
}
