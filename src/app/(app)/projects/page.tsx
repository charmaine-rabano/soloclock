import { PageContainer } from "@/components/layout/page-container";
import { requireUser } from "@/lib/auth/session";
import { listClientOptions } from "@/lib/clients/queries";
import { listProjects } from "@/lib/projects/queries";

import { ProjectsView } from "./projects-view";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const user = await requireUser();
  const [projects, clients] = await Promise.all([
    listProjects(user.id),
    listClientOptions(user.id),
  ]);

  return (
    <PageContainer>
      <ProjectsView projects={projects} clients={clients} />
    </PageContainer>
  );
}
