# Soloclock: Modules & Tickets

Complete ticket breakdown for Soloclock, a freelance invoice and time tracker.

Modules are ordered so each one is usable before the next begins. Within a module, tickets are meant to be worked top to bottom.

---

## Module Overview

| #   | Module              | Prefix | Purpose                                             | Tickets           |
| --- | -------------------- | ------ | --------------------------------------------------- | ------------------ |
| M0  | Foundation & Setup  | `FND`  | Repo, database, deploy pipeline                     | SC-FND-01 → 05     |
| M1  | Authentication      | `AUTH` | Auth.js accounts, session, route protection         | SC-AUTH-01 → 04    |
| M2  | Clients             | `CLI`  | Client CRUD, the top of the data hierarchy          | SC-CLI-01 → 04     |
| M3  | Projects            | `PRJ`  | Projects under clients, hourly rates, project color | SC-PRJ-01 → 05     |
| M4  | Timer               | `TMR`  | Start/stop tracking with live client-side duration  | SC-TMR-01 → 05     |
| M5  | Manual Time Entries | `TME`  | Create/edit/delete entries by hand                  | SC-TME-01 → 04     |
| M6  | Timesheet           | `TSH`  | Grouped, filterable view of tracked time            | SC-TSH-01 → 03     |
| M7  | Invoicing           | `INV`  | Generate, progress, and export invoices             | SC-INV-01 → 09     |
| M8  | Reporting           | `RPT`  | Dashboard and monthly revenue reporting             | SC-RPT-01 → 03     |
| M9  | Polish & Ship       | `SHP`  | Empty states, errors, responsive, production deploy | SC-SHP-01 → 05     |

---

## Design Conventions

These rules bind every UI ticket below and exist so the project-color feature can't collide with existing status signals:

- **Color encodes project identity only.** Every project has an assigned hex color; no other meaning is ever carried by hue.
- **Status is text.** Non-billable time, and invoice draft/sent/paid/void, are text tags or badges, never a color difference alone.
- **Project color renders as an accent** — a swatch dot or left rail — beside text in normal ink, never as a background behind text or as a row fill. Colors are not contrast-checked against light/dark surfaces, so this rule is what keeps a badly chosen hex from making anything unreadable: the worst case is a hard-to-see dot next to a fully readable name.

---

## M0 — Foundation & Setup

### SC-FND-01 — Scaffold Next.js app with TypeScript and tooling

Acceptance Criteria:

- [ ] Next.js App Router project runs locally with `npm run dev`
- [ ] TypeScript configured in strict mode with no build errors
- [ ] ESLint and Prettier run clean on the whole repo
- [ ] Base layout renders with a shared nav shell and page container
- [ ] `.env.example` documents every environment variable the app expects

### SC-FND-02 — Provision Supabase Postgres and connect Prisma

Acceptance Criteria:

- [ ] Supabase project created with connection strings stored in `.env` (pooled for runtime, direct for migrations)
- [ ] Prisma client instantiated as a singleton that survives dev hot reload
- [ ] `npx prisma migrate dev` runs successfully against the database
- [ ] A trivial query from a server component returns data without connection errors

### SC-FND-03 — Define initial Prisma schema and run first migration

Context: the core entities (User → Client → Project → TimeEntry → Invoice) shape every feature that follows, so they land as one unit.

Acceptance Criteria:

- [ ] `User`, `Client`, `Project`, `TimeEntry`, and `Invoice` models match the agreed schema, including `Project.color` (`#RRGGBB`, required, server-side default) and `Invoice.sentAt` / `paidAt` (nullable timestamps)
- [ ] `TimeEntry.endedAt` is nullable to represent a running timer
- [ ] `TimeEntry.invoiceId` is nullable so unbilled entries are valid
- [ ] `TimeEntry.billable` defaults to `true`, and is independent of `billed`
- [ ] Money fields use `Decimal`, not `Float`
- [ ] Migration applies cleanly to an empty database
- [ ] Prisma Studio shows all tables with expected relations

### SC-FND-04 — Deploy to Vercel with a working preview pipeline

Acceptance Criteria:

- [ ] Repo connected to Vercel, production deploy succeeds from the default branch
- [ ] Environment variables set for both preview and production
- [ ] Prisma generate runs as part of the build (no stale-client build failures)
- [ ] Deployed URL loads the app shell without runtime errors

### SC-FND-05 — Build the shared UI component library

Context: the hi-fi designs reuse the same set of primitives (buttons, fields, tags, cards, avatars, table rows, and the rest) across every screen; building them once here keeps every later module from re-styling the same elements.

Acceptance Criteria:

- [ ] Every recurring UI element identified in the hi-fi designs exists as its own component, not copy-pasted markup
- [ ] Each component exposes its visual variants (e.g. status, emphasis, size) as props rather than one-off inline styles at the call site
- [ ] Components read font, color, and spacing from shared tokens, so a token change updates every usage
- [ ] Interactive components (buttons, inputs, rows, etc.) expose disabled/pending/error states where the design calls for them
- [ ] Components compose cleanly — a component built from smaller ones (e.g. a card built from a table row) reuses those components rather than re-implementing them
- [ ] Each component is used at least once outside this ticket (e.g. in the app shell or a placeholder page) to confirm it renders correctly before other modules depend on it
- [ ] A single reference page or story lists every component and its variants for use as a lookup while building later modules

---

## M1 — Authentication

### SC-AUTH-01 — Add Auth.js with email/password credentials

Context: auth is built outside a BaaS on purpose, to show session handling that isn't Firebase-managed.

Acceptance Criteria:

- [ ] Signup creates a user with a hashed password (bcrypt or argon2, never plaintext)
- [ ] Signup rejects duplicate emails with a visible inline error
- [ ] Login with valid credentials creates a session; invalid credentials show an error and do not
- [ ] Session persists across a full page refresh
- [ ] Logout clears the session and redirects to the login page

### SC-AUTH-02 — Scope data to the signed-in contractor via Client

Context: `Client` is a customer record, not an account holder — clients never log in. Ownership lives on `Client` only, and Projects, TimeEntries, and Invoices inherit it through that relation.

Acceptance Criteria:

- [ ] `Client` has a required `userId` relation to `User`
- [ ] No `userId` on `Project`, `TimeEntry`, or `Invoice` — scope resolves through the Client relation
- [ ] Migration backfills or clears existing rows without leaving orphans
- [ ] Requesting another contractor's client, project, invoice, or time entry by id returns 404, not 403 or the record

### SC-AUTH-03 — Protect authenticated routes

Acceptance Criteria:

- [ ] Unauthenticated visits to any `/app` route redirect to login
- [ ] Post-login redirect returns the user to their originally requested URL
- [ ] Authenticated visits to `/login` or `/signup` redirect to the dashboard
- [ ] Server actions and route handlers reject unauthenticated calls

### SC-AUTH-04 — Build signup, login, and account pages

Acceptance Criteria:

- [ ] Signup and login forms validate email format and minimum password length client- and server-side
- [ ] Submit buttons show a pending state and are disabled during submission
- [ ] Form errors render next to the offending field
- [ ] Account page shows the signed-in email and a logout button

---

## M2 — Clients

### SC-CLI-01 — List clients

Acceptance Criteria:

- [ ] Clients page lists the signed-in user's clients with name, email, and project count
- [ ] Empty state explains what a client is and links to the create form
- [ ] List is sorted by name, ascending
- [ ] Each row links to that client's detail page

### SC-CLI-02 — Create a client

Acceptance Criteria:

- [ ] Form captures name (required) and email (optional)
- [ ] Empty name is rejected with an inline error
- [ ] Invalid email format is rejected; a blank email is accepted
- [ ] On success, the new client appears in the list without a manual refresh

### SC-CLI-03 — Edit and delete a client

Acceptance Criteria:

- [ ] Edit form is pre-filled with current values and saves changes
- [ ] Delete asks for confirmation naming the client before proceeding
- [ ] Deleting a client with projects is blocked with an explanatory message
- [ ] Deleting a client with no projects removes it from the list

### SC-CLI-04 — Client detail page

Acceptance Criteria:

- [ ] Page shows client name, email, and creation date
- [ ] Lists that client's projects with hourly rate and total tracked hours
- [ ] Shows lifetime totals: hours tracked (billable and not), amount invoiced, amount unbilled
- [ ] Unbilled amount counts only billable, uninvoiced entries
- [ ] Empty state prompts creating the client's first project

---

## M3 — Projects

### SC-PRJ-01 — Create a project under a client

Acceptance Criteria:

- [ ] Form captures project name (required), hourly rate (required), and parent client
- [ ] Hourly rate rejects negative values and non-numeric input
- [ ] Rate is stored as `Decimal` and round-trips to two decimal places
- [ ] Creating from a client detail page pre-selects that client
- [ ] Color defaults to an unused value so the field is never blank on create

### SC-PRJ-02 — Pick a project color

Context: projects are told apart by color everywhere time appears, so the swatch component is built once here and reused by every downstream module.

Acceptance Criteria:

- [ ] Primary control is a hex text input (e.g. `#7C9A92`) with an inline swatch preview showing the current value
- [ ] Color input accepts any `#RRGGBB` value and rejects malformed input
- [ ] A color picker button sits beside the hex input and opens a color picker; choosing a color writes it back to the hex input
- [ ] A "Suggestions" row below the input offers three randomly generated colors as circles, produced once per form load and stable while the form is open
- [ ] Clicking a suggestion sets the hex input and swatch preview to that color
- [ ] Shared swatch component renders a project's color as a dot or rail, never as a text background or row fill
- [ ] Project name always accompanies the swatch, so color is never the sole identifier
- [ ] Changing a project's color updates it everywhere without touching historical invoices

### SC-PRJ-03 — List and filter projects

Acceptance Criteria:

- [ ] Projects page lists all projects with client name, hourly rate, and unbilled hours (billable, uninvoiced entries only)
- [ ] Each row shows the project's color swatch beside its name
- [ ] Filter by client narrows the list
- [ ] Empty state links to client creation when the user has no clients yet
- [ ] Each row links to that project's detail page

### SC-PRJ-04 — Edit and delete a project

Acceptance Criteria:

- [ ] Editing the hourly rate does not alter amounts on already-generated invoices
- [ ] Delete asks for confirmation naming the project
- [ ] Deleting a project with time entries or invoices is blocked with an explanatory message
- [ ] Deleting an empty project removes it from the list

### SC-PRJ-05 — Project detail page

Acceptance Criteria:

- [ ] Header shows project name, client, and hourly rate
- [ ] Header carries the project color as an accent rail, with heading text in normal ink
- [ ] Summary shows total hours, unbilled hours, and unbilled amount
- [ ] Total hours includes non-billable time; unbilled hours and unbilled amount exclude it
- [ ] Recent time entries are listed newest first, with non-billable ones carrying a "Non-billable" text tag
- [ ] Page includes the timer control and a link to that project's invoices

---

## M4 — Timer

### SC-TMR-01 — Start and stop a timer for a project

Context: the timer is the core interaction — everything billable originates here.

Acceptance Criteria:

- [ ] Start creates a `TimeEntry` with `startedAt` set, `endedAt` null, and `billable: true`
- [ ] Stop sets `endedAt` on the running entry
- [ ] Start sends `startedAt` to the server exactly once; the server is not polled while running
- [ ] Stopping an already-stopped entry is a no-op rather than an error
- [ ] Optional description can be entered when stopping

### SC-TMR-02 — Show a live running duration

Acceptance Criteria:

- [ ] Elapsed time is computed client-side as `Date.now() - startedAt`, not fetched per tick
- [ ] Display updates once per second in `HH:MM:SS`
- [ ] Interval is cleared on unmount, with no leaked timers on navigation
- [ ] Duration is accurate after the tab is backgrounded and refocused (recomputed, not incremented)

### SC-TMR-03 — Enforce a single active timer

Context: starting a second timer while one runs is a real mistake users make; the agreed behavior is to auto-stop the first.

Acceptance Criteria:

- [ ] Starting a timer while another is running stops the previous one at the new start time
- [ ] The auto-stop is confirmed with a message naming the stopped project
- [ ] The database never holds two entries with `endedAt` null for the same user
- [ ] The auto-stop and new start happen in a single transaction

### SC-TMR-04 — Restore a running timer on load

Context: a timer left running when the tab closes must keep running, so the server is the source of truth on load.

Acceptance Criteria:

- [ ] On app load, any entry with `endedAt` null is fetched and rendered as running
- [ ] Restored duration reflects real elapsed time since `startedAt`, including time the app was closed
- [ ] A running timer can be stopped immediately after restore
- [ ] No running timer produces the idle state, not a zeroed running state

### SC-TMR-05 — Global timer bar

Acceptance Criteria:

- [ ] Persistent bar visible on every authenticated page while a timer runs
- [ ] Bar shows project name, client name, and live duration
- [ ] Bar carries the running project's color as an accent
- [ ] Stop button in the bar ends the entry from any page
- [ ] Bar is hidden entirely when no timer is running

---

## M5 — Manual Time Entries

### SC-TME-01 — Create a time entry manually

Context: users forget to start timers; without manual entry the tracked totals stop being trustworthy.

Acceptance Criteria:

- [ ] Form captures project, date, start time, end time, optional description, and a billable toggle defaulting to on
- [ ] End time earlier than start time is rejected with an inline error
- [ ] Entries longer than 24 hours are rejected
- [ ] Computed duration is shown live as the times are edited
- [ ] Saved entry appears in the project's entry list

### SC-TME-02 — Edit a time entry

Acceptance Criteria:

- [ ] Editable fields: project, start, end, description, billable
- [ ] Same validation rules apply as manual creation
- [ ] Editing an entry attached to an invoice is blocked with an explanatory message
- [ ] Editing a currently running entry is limited to description, start time, and billable
- [ ] Flipping an entry to non-billable removes it from unbilled totals immediately

### SC-TME-03 — Delete a time entry

Acceptance Criteria:

- [ ] Delete asks for confirmation showing the entry's date and duration
- [ ] Deleting an entry attached to an invoice is blocked with an explanatory message
- [ ] Deleted entries no longer count toward project totals

### SC-TME-04 — Duration and money formatting helpers

Acceptance Criteria:

- [ ] Shared helper formats a duration in seconds as `HH:MM:SS` and as decimal hours
- [ ] Decimal hours round to two places consistently everywhere they appear
- [ ] Shared helper formats `Decimal` amounts as currency
- [ ] Unit tests cover zero duration, sub-minute durations, and multi-day durations

---

## M6 — Timesheet

### SC-TSH-01 — Timesheet grouped by day

Acceptance Criteria:

- [ ] Entries grouped under date headers, most recent day first
- [ ] Each day header shows that day's total hours
- [ ] Each row shows project, client, time range, duration, and description
- [ ] Each row is marked with its project's color swatch
- [ ] Non-billable rows carry a text tag reading "Non-billable"; billable status is never signalled by color
- [ ] A running entry appears in the list with a live duration
- [ ] Empty state explains how to record time

### SC-TSH-02 — Timesheet grouped by project

Acceptance Criteria:

- [ ] Toggle switches grouping between day and project
- [ ] Each project group shows total hours and unbilled hours, where unbilled counts billable entries only
- [ ] Selected grouping persists across navigation within the session
- [ ] Groups with no entries in range are omitted

### SC-TSH-03 — Filter the timesheet by date range and project

Acceptance Criteria:

- [ ] Date range filter with presets: this week, last week, this month, custom
- [ ] Filter by client and by project
- [ ] Filters reflected in the URL so a filtered view can be shared or reloaded
- [ ] Totals recalculate to match the active filter
- [ ] "No entries match these filters" state is distinct from the no-entries-at-all state

---

## M7 — Invoicing

### SC-INV-01 — Preview an invoice from unbilled entries

Context: generating is destructive to the "unbilled" pool, so the user sees exactly what will be billed first.

Acceptance Criteria:

- [ ] Preview lists every `billable: true`, `billed: false` entry for the selected project with date, description, and hours
- [ ] Non-billable entries never appear in the preview, not even as excluded rows
- [ ] Entries can be individually excluded from the invoice
- [ ] Total shows hours × the project's hourly rate, updating as entries are toggled
- [ ] Running (unstopped) entries are excluded and labeled as such
- [ ] A project whose only uninvoiced time is non-billable shows the same empty state as a project with no unbilled entries

### SC-INV-02 — Generate an invoice

Acceptance Criteria:

- [ ] Invoice is created with `status: "draft"` and the computed `totalAmount`
- [ ] Selected time entries are linked to the invoice and marked `billed: true`
- [ ] Generation runs in a transaction — a failure leaves no invoice and no entries flagged
- [ ] Billed entries no longer appear in any future invoice preview
- [ ] A non-billable entry submitted for generation is rejected rather than invoiced
- [ ] User lands on the new invoice's detail page after generation

### SC-INV-03 — Invoice detail page

Acceptance Criteria:

- [ ] Header shows invoice id, client, project, status, and creation date
- [ ] Line items list each billed entry with date, description, hours, and line amount
- [ ] Footer shows total hours, hourly rate applied, and total amount
- [ ] Totals match the sum of line items to the cent
- [ ] Status actions are available from this page

### SC-INV-04 — Invoice list

Acceptance Criteria:

- [ ] Lists all invoices with client, project, date, total, and status
- [ ] Status badges visually distinguish draft, sent, paid, and voided
- [ ] Filter by status and by client
- [ ] Sorted newest first by default
- [ ] Empty state explains that invoices are generated from unbilled time

### SC-INV-05 — Mark an invoice as sent

Acceptance Criteria:

- [ ] Draft invoices can be marked sent
- [ ] `sentAt` timestamp is recorded and shown on the detail page
- [ ] Sent invoices cannot return to draft
- [ ] Status change is reflected in the invoice list without a manual refresh

### SC-INV-06 — Mark an invoice as paid

Acceptance Criteria:

- [ ] Sent invoices can be marked paid
- [ ] `paidAt` timestamp is recorded and shown on the detail page
- [ ] Marking paid is confirmed before it applies
- [ ] Paid invoices are excluded from the outstanding total on the dashboard

### SC-INV-07 — Void an invoice and release its time entries

Context: a mistakenly generated invoice would otherwise strand its hours as permanently billed.

Acceptance Criteria:

- [ ] Draft invoices can be voided; sent or paid invoices cannot
- [ ] Voiding sets each linked entry back to `billed: false` and clears its `invoiceId`
- [ ] Released entries reappear in the project's invoice preview
- [ ] Void runs in a transaction and requires confirmation
- [ ] Voided invoices are shown with a clear voided badge

### SC-INV-08 — Build the invoice PDF document

Acceptance Criteria:

- [ ] `@react-pdf/renderer` document renders client, project, invoice id, and issue date
- [ ] Line items list each billed entry with date, description, hours, and line amount
- [ ] Footer shows total hours, rate applied, and total amount, matching the web invoice to the cent
- [ ] Invoices with many line items paginate with repeated table headers
- [ ] Long descriptions and client names wrap instead of overflowing

### SC-INV-09 — Download an invoice as PDF

Acceptance Criteria:

- [ ] Download button on the invoice detail page streams a PDF from a route handler
- [ ] Filename encodes client and invoice id, e.g. `acme-INV-1042.pdf`
- [ ] Requesting another contractor's invoice PDF returns 404
- [ ] Button shows a pending state and re-enables after the download starts
- [ ] Draft invoices are labeled as drafts in the output

---

## M8 — Reporting

### SC-RPT-01 — Dashboard summary

Acceptance Criteria:

- [ ] Shows unbilled hours and unbilled amount across all projects, excluding non-billable entries
- [ ] Shows outstanding amount (sent, not yet paid) and amount paid this month
- [ ] All figures scoped to the signed-in user

### SC-RPT-02 — Aggregate monthly revenue

Context: the chart needs billed and collected bucketed by different timestamps, which is where the arithmetic actually lives.

Acceptance Criteria:

- [ ] Query returns the last 12 months, each with a billed total and a collected total
- [ ] Billed sums sent and paid invoices by `createdAt`; collected sums paid invoices by `paidAt`
- [ ] Months with no invoices return zero rather than being omitted
- [ ] Bucketing uses a consistent timezone, so an invoice never lands in the wrong month
- [ ] Voided invoices are excluded from both series
- [ ] Unit tests cover an empty history, a month with both series, and a paid-in-a-later-month invoice

### SC-RPT-03 — Monthly revenue chart

Acceptance Criteria:

- [ ] Grouped bar chart, 12 months, with billed and collected as two series on a single shared axis
- [ ] Legend is always present; series are not distinguished by color alone
- [ ] Totals row shows 12-month billed, collected, and the outstanding difference
- [ ] Hovering a bar shows a tooltip with the month, series, and amount
- [ ] Empty state renders when no invoices exist, instead of an empty grid

---

## M9 — Polish & Ship

### SC-SHP-01 — Consistent loading and empty states

Acceptance Criteria:

- [ ] Every list view has a defined empty state with a next action
- [ ] Route-level loading states render for every async page
- [ ] Mutating buttons show a pending state and cannot be double-submitted
- [ ] No layout shift between loading and loaded states

### SC-SHP-02 — Error handling and validation boundaries

Acceptance Criteria:

- [ ] Server actions return typed errors rendered as inline form messages
- [ ] Unexpected errors hit an error boundary with a retry action, not a blank screen
- [ ] Unknown routes render a 404 page linking back to the dashboard
- [ ] No raw Prisma or stack-trace text ever reaches the UI

### SC-SHP-03 — Responsive layout

Acceptance Criteria:

- [ ] All pages usable at 375px wide with no horizontal scroll
- [ ] Timer bar and stop control remain reachable on mobile
- [ ] Tables reflow or scroll within their container rather than overflowing the page
- [ ] Nav collapses to a mobile-appropriate pattern

### SC-SHP-04 — Seed script and demo data

Context: a portfolio project needs to look populated the moment someone opens it.

Acceptance Criteria:

- [ ] Seed script creates a demo user, clients, projects (with distinct colors), time entries, and invoices in mixed states
- [ ] Script is idempotent — rerunning does not duplicate data
- [ ] Seeded data covers unbilled hours, at least one non-billable entry, a draft invoice, a sent invoice, and a paid invoice
- [ ] README documents how to run it

### SC-SHP-05 — Production readiness

Acceptance Criteria:

- [ ] README covers setup, environment variables, migrations, and deployment
- [ ] Production database migrated via `prisma migrate deploy` in the release step
- [ ] Full flow verified on production: signup → client → project → timer → invoice → PDF export → paid
- [ ] Lighthouse accessibility score of 90+ on dashboard and timesheet
- [ ] No console errors or warnings on any page in production

---

## Out of Scope

Tracked here so they don't creep into the tickets above:

- Email delivery of invoices (e.g. via Resend)
- Hours-per-client and per-project profitability reporting
- Multi-user teams or client-facing portals
- Recurring invoices, taxes, or discounts
