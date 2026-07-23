import { PageContainer } from "@/components/layout/page-container";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <PageContainer
      title="Projects"
      description="Billable work under each client, with rates and colors."
    >
      <div className="rounded-ui border border-dashed border-border p-8 text-muted">
        Scaffolded shell. Feature work lands in M3 — Projects.
      </div>
    </PageContainer>
  );
}
