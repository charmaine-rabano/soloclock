import { PageContainer } from "@/components/layout/page-container";
import { requireUser } from "@/lib/auth/session";
import { listClients } from "@/lib/clients/queries";

import { ClientsView } from "./clients-view";

export const metadata = { title: "Clients" };

export default async function ClientsPage() {
  const user = await requireUser();
  const clients = await listClients(user.id);

  return (
    <PageContainer title="Clients">
      <ClientsView clients={clients} />
    </PageContainer>
  );
}
