import { Spinner } from "@/components/ui";

export default function Loading() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <Spinner className="size-6 text-muted" />
    </div>
  );
}
