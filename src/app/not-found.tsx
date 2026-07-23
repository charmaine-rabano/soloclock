import Link from "next/link";

import { Button, ErrorState } from "@/components/ui";
import { ROUTES } from "@/lib/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-8">
      <ErrorState
        variant="not-found"
        title="Page not found"
        body="The page you're looking for doesn't exist or has moved."
        actions={
          <Link href={ROUTES.dashboard}>
            <Button variant="primary">Back to dashboard</Button>
          </Link>
        }
      />
    </div>
  );
}
