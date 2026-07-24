import type { Prisma } from "@prisma/client";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatMoney(value: Prisma.Decimal | number): string {
  const amount = typeof value === "number" ? value : value.toNumber();
  return currencyFormatter.format(amount);
}

// e.g. `142h 15m`, `128h 00m` — minutes always zero-padded.
export function formatHours(ms: number): string {
  const totalMinutes = Math.round(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

export function durationMs(startedAt: Date, endedAt: Date): number {
  return endedAt.getTime() - startedAt.getTime();
}

// e.g. `01:12:44` — zero-padded HH:MM:SS, for a *live* running duration
// (SC-TMR-02). Completed entries use `formatHours` instead.
export function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
