import { PageContainer } from "@/components/layout/page-container";
import { Button, Card } from "@/components/ui";
import { logoutAction } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/session";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <PageContainer
      title="Account"
      description="Your signed-in email and session."
    >
      <Card className="flex max-w-100 flex-col gap-4.5 p-6">
        <div>
          <p className="text-[12.5px] text-muted">Signed in as</p>
          <p className="mt-1 text-[15px] font-semibold">{user.email}</p>
        </div>
        <form action={logoutAction}>
          <Button variant="secondary" type="submit">
            Log out
          </Button>
        </form>
      </Card>
    </PageContainer>
  );
}
