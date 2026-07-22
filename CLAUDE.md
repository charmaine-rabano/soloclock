# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last updated:** 2026-07-22
**Description:** Conventions, commands, and architecture for Soloclock — the ownership model, Prisma access rules, routing structure, and the design rules binding UI work.

## What this is

Soloclock — a freelance invoice & time tracker for solo contractors: manage clients, track time per project, generate invoices from unbilled hours. Next.js App Router + TypeScript (strict), Tailwind CSS v4, Postgres on Supabase via Prisma, deployed on Vercel. Auth.js (M1) and `@react-pdf/renderer` (M7) are planned but not yet installed.

The repo is currently the M0 scaffold: every route under `src/app/(app)/` is a placeholder shell that renders a `<div>` naming the module that will fill it in.

## Commands

```bash
npm run dev            # dev server on :3000
npm run build          # prisma generate + next build
npm run lint           # eslint .
npm run typecheck      # tsc --noEmit
npm run format:check   # prettier --check . (CI-friendly)
npm run db:migrate     # prisma migrate dev
npm run db:deploy      # prisma migrate deploy (production)
npm run db:studio      # Prisma Studio
```

There is no test runner configured. `lint` + `typecheck` + `format:check` is the verification loop; run it via the `/verify` slash command, which also fixes failures it finds.

`postinstall` runs `prisma generate`, so `npm install` is enough after a schema change pulled from git; after editing `prisma/schema.prisma` locally, run `npm run db:migrate`.

## Environment

Two connection strings, and the split matters (see `.env.example`):

- `DATABASE_URL` — Supabase **pooled** connection (PgBouncer, port 6543) used by the app at runtime.
- `DIRECT_URL` — **direct** connection (port 5432) used by Prisma Migrate and Studio.

`AUTH_SECRET` / `AUTH_URL` are documented ahead of the Auth.js work in M1.

## Architecture

**Ownership model.** `User → Client → Project → TimeEntry → Invoice`. `userId` lives on `Client` only — `Project`, `TimeEntry`, and `Invoice` carry no owner column and must resolve their owner by joining back through `Client`. Every authorization check and every list query needs to filter through that relation; do not add a denormalized `userId` without deciding to change this convention deliberately.

Other schema points worth knowing before writing queries:

- `TimeEntry.endedAt == null` means a **currently running timer**. That's the only marker; there is no separate "active" flag.
- `TimeEntry` has both `billable` (user intent) and `billed` (invoiced yet), plus a nullable `invoiceId` set when it lands on an invoice.
- `Invoice.status` is a plain string, one of `draft | sent | paid | void`.
- `hourlyRate` and `totalAmount` are Prisma `Decimal` — don't do money math in JS floats.

**Prisma access.** Always import the singleton from `@/lib/prisma`; it caches the client on `globalThis` in dev so fast refresh doesn't exhaust the connection pool. Never construct `new PrismaClient()` in a route or component.

**Routing.** `src/app/(app)/` is a route group holding the authenticated area — the group parens mean it contributes no URL segment, so its pages are served at top-level paths (`/dashboard`, `/timesheet`, `/clients`, ...). Its `layout.tsx` is the nav-plus-page-container shell; route protection is deferred to M1. New authenticated pages go inside the group and link without any prefix.

**Styling.** Tailwind CSS v4, configured entirely in `src/app/globals.css` — there is no `tailwind.config.js` (v4 does config in CSS) and content paths are auto-detected. PostCSS wiring lives in `postcss.config.mjs`.

The design tokens live directly in a single `@theme` block, which both sets each value and generates its utility.

Rules for UI work:

- Use utility classes. Reach for an inline `style` prop only for genuinely dynamic values — most notably a user-chosen project hex, which can't be a static class.
- Add a new token to the `@theme` block rather than hardcoding a hex in markup.
- Don't add a `tailwind.config.js` or CSS modules; extend `globals.css`.
- Prettier sorts class strings via `prettier-plugin-tailwindcss`, so let `npm run format` order them.

Path alias: `@/*` → `./src/*`.

## Design conventions (binding on UI work)

From `docs/soloclock-modules-and-tickets.md`, and they exist to keep project color from colliding with status signalling:

- **Color encodes project identity only.** No other meaning is ever carried by hue.
- **Status is text.** Non-billable time and invoice `draft`/`sent`/`paid`/`void` are text tags or badges, never a color difference alone.
- **Project color renders as an accent** — a swatch dot or left rail beside text in normal ink — never as a background behind text or a row fill. Project hexes are user-chosen and not contrast-checked, so this rule is what prevents an unreadable UI.

## Planning docs

Feature work is broken into modules M0–M9 with ticket IDs like `SC-INV-03`.

- `docs/soloclock-modules-and-tickets.md` — module breakdown and per-ticket acceptance criteria. Check the relevant ticket before implementing a feature; the criteria are specific.
- `docs/soloclock-project-context.md` — product rationale and schema notes.
- `docs/designs/` — wireframe and hi-fi HTML mockups.

## Keeping this file accurate

If you find that something here no longer matches the code — a renamed path, a dropped or added script, a changed convention, a stated fact you verified to be wrong — say so and ask the user whether to update CLAUDE.md, rather than silently working around it or editing the file unprompted. Report the specific line and what the code actually does. Drift is only worth raising once confirmed against the code, not on a hunch.

Whenever you do edit this file, set **Last updated** at the top to the current date.
