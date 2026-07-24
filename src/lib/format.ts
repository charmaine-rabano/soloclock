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
