import { z } from "zod";

// Shared by both the server actions (src/lib/clients/actions.ts) and the
// client form, so client- and server-side validation rules never drift apart.
export const clientSchema = z.object({
  name: z.string().trim().min(1, "Enter a client name."),
  // Blank accepted; if present it must be a valid address (SC-CLI-02).
  email: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.email("Enter a valid email address.").optional(),
  ),
});

export type ClientInput = z.infer<typeof clientSchema>;
