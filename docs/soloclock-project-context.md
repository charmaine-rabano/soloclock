# Soloclock: Freelance Invoice & Time Tracker

A portfolio project for solo contractors to manage clients, track time per project, and generate invoices from unbilled hours. App name: Soloclock

## Why this project

- Solves a real problem I'd actually use myself
- Moves off Firebase/Firestore into a relational database (Postgres + Prisma), which is a proof point for full stack freelance jobs
- Includes real state management problems (active timers, invoice generation from time entries) that are more convincing in interviews than a basic CRUD app

## Tech Stack

- **Frontend**: Next.js (App Router) + TypeScript
- **Database**: Postgres, hosted on Supabase
- **ORM**: Prisma
- **Auth**: Auth.js (not Firebase Auth, to show auth built outside a BaaS)
- **PDF**: @react-pdf/renderer for invoice export
- **Charts**: a charting library for the revenue report (Recharts is the low-friction fit for a two-series grouped bar chart in React, but nothing depends on that choice)
- **Deployment**: Vercel

## Core Entities

Users → Clients → Projects → Time Entries → Invoices

- A user has many clients
- A client has many projects
- A project has an hourly rate, an assigned color, many time entries, and many invoices
- A time entry belongs to one project, and optionally belongs to one invoice once billed
- An invoice is generated from a set of unbilled time entries for a project

## Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // hashed, never plaintext
  clients   Client[]
  createdAt DateTime @default(now())
}

model Client {
  id        String    @id @default(cuid())
  name      String
  email     String?
  user      User      @relation(fields: [userId], references: [id])
  userId    String
  projects  Project[]
  createdAt DateTime  @default(now())
}

model Project {
  id          String      @id @default(cuid())
  name        String
  hourlyRate  Decimal
  color       String      // #RRGGBB
  client      Client      @relation(fields: [clientId], references: [id])
  clientId    String
  timeEntries TimeEntry[]
  invoices    Invoice[]
}

model TimeEntry {
  id          String    @id @default(cuid())
  project     Project   @relation(fields: [projectId], references: [id])
  projectId   String
  startedAt   DateTime
  endedAt     DateTime?
  description String?
  billable    Boolean   @default(true)
  billed      Boolean   @default(false)
  invoice     Invoice?  @relation(fields: [invoiceId], references: [id])
  invoiceId   String?
}

model Invoice {
  id          String      @id @default(cuid())
  project     Project     @relation(fields: [projectId], references: [id])
  projectId   String
  status      String      @default("draft") // draft, sent, paid, void
  totalAmount Decimal
  timeEntries TimeEntry[]
  createdAt   DateTime    @default(now())
  sentAt      DateTime?
  paidAt      DateTime?
}
```

Notes on the schema:

- `endedAt` being nullable represents a currently running timer
- `billable` and `billed` answer different questions: `billable` is the user's decision that this work should ever be charged to the client (defaults to true; set false for admin, rework, or goodwill time), while `billed` records that it has already been put on an invoice. Only entries that are `billable: true` and `billed: false` are eligible for invoicing
- Non-billable time still counts toward tracked hours everywhere, it is only excluded from unbilled hours, unbilled amounts, and invoice previews
- Ownership lives on `Client` only. Projects, time entries, and invoices resolve their owner through the client relation; none of them carry a `userId` of their own. Clients are customer records and never log in
- `paidAt` is the bucketing key for collected revenue in monthly reporting, so it must be set when an invoice is marked paid, not inferred from `updatedAt`
- Decisions: if a user starts a second timer while one is already active, auto-stop the first one; and a timer left running if the tab is closed should keep running

## Design Conventions

- Color encodes project identity only. Every project has an assigned hex color; no other meaning is ever carried by hue.
- Status is text. Non-billable time, and invoice draft/sent/paid/void, are text tags or badges, never a color difference alone.
- Project color renders as an accent (swatch dot or left rail) beside text in normal ink, never as a background behind text or as a row fill. This is what makes an unvalidated hex safe: the worst case is a hard-to-see dot next to a readable name. Colors are not contrast-checked, so this rule is load-bearing.

## Timer Implementation Decision

The timer will NOT poll the server every second. Instead:

- On "start," the client records `startedAt` and sends it to the server once
- The UI calculates elapsed time client-side using a local clock (e.g. `setInterval` updating a display, computed from `Date.now() - startedAt`)
- On "stop," the client sends `endedAt` to the server, closing out the entry

This mirrors how real time tracking tools work, the server only needs to know when a timer started and stopped, not track a "live" running state itself.

## Feature Scope (build order)

1. Start/stop timer per project, with a live running duration shown in the UI
2. Manual time entry creation and editing (for forgotten/incorrect timers)
3. Timesheet view, entries grouped by day or by project
4. Generate invoice from unbilled time entries for a project, calculated from the hourly rate
5. Mark invoice as sent/paid
6. Assigned project colors, shown throughout the UI
7. Invoice PDF export
8. Monthly revenue reporting (billed vs. collected)

## Future Considerations (not in scope yet)

- Email delivery of invoices (e.g. via Resend)
- Hours-per-client and per-project profitability reporting
- Multi-user teams or client-facing portals
- Recurring invoices, taxes, or discounts
