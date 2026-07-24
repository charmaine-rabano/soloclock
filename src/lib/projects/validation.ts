import { z } from "zod";

// Any #RRGGBB is a valid project color — there is no fixed palette to choose
// from (see randomSuggestions below for the picker's random suggestions).
const HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/;

export function randomHexColor(): string {
  const n = Math.floor(Math.random() * 0xffffff);
  return `#${n.toString(16).padStart(6, "0").toUpperCase()}`;
}

// Produces `count` random colors, generated once per form load and stable
// while the form stays open (SC-PRJ-02). The caller is responsible for
// memoizing the result (e.g. via a useState initializer).
export function randomSuggestions(count = 3): string[] {
  return Array.from({ length: count }, () => randomHexColor());
}

// Shared by both the server actions (src/lib/projects/actions.ts) and the
// project form, so client- and server-side validation rules never drift apart.
export const projectSchema = z.object({
  name: z.string().trim().min(1, "Enter a project name."),
  clientId: z.string().trim().min(1, "Choose a client."),
  hourlyRate: z.preprocess(
    (v) => (typeof v === "string" ? (v.trim() === "" ? NaN : Number(v)) : v),
    z
      .number({ error: "Enter a valid hourly rate." })
      .nonnegative("Rate can't be negative."),
  ),
  color: z.string().trim().regex(HEX_COLOR_RE, "Enter a color hex code like #7C9A92."),
});

export type ProjectInput = z.infer<typeof projectSchema>;
