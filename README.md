# Soloclock

A freelance invoice & time tracker for solo contractors: manage clients, track
time per project, and generate invoices from unbilled hours.

## Tech stack

- **Next.js** (App Router) + **TypeScript** (strict)
- **Tailwind CSS v4** for styling, themed from the CSS custom properties in
  `src/app/globals.css`
- **Postgres** on **Supabase**, accessed through **Prisma**
- **Auth.js** for credential auth
- **@react-pdf/renderer** for invoice export
- **Vercel** for deployment

## Getting started

```bash
# 1. Install dependencies (also runs `prisma generate`)
npm install

# 2. Configure environment
cp .env.example .env    # then fill in your Supabase connection strings

# 3. Apply the schema to your database
npm run db:migrate

# 4. Run the dev server
npm run dev
```

The app runs at http://localhost:3000 and opens onto the dashboard shell at
`/dashboard`.

## Scripts

| Script                 | What it does                              |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Start the dev server                      |
| `npm run build`        | `prisma generate` then a production build |
| `npm run start`        | Serve the production build                |
| `npm run lint`         | ESLint over the repo                      |
| `npm run typecheck`    | `tsc --noEmit`                            |
| `npm run format`       | Prettier write                            |
| `npm run format:check` | Prettier check (CI-friendly)              |
| `npm run db:migrate`   | `prisma migrate dev`                      |
| `npm run db:studio`    | Open Prisma Studio                        |

## Project layout

```
prisma/schema.prisma      Core entities: User → Client → Project → TimeEntry → Invoice
src/lib/prisma.ts         PrismaClient singleton (hot-reload safe)
src/app/globals.css       Design tokens + Tailwind entry point and theme bridge
src/app/layout.tsx        Root layout
src/app/(app)/layout.tsx  Authenticated shell (nav + page container)
src/app/(app)/*/page.tsx  One placeholder page per feature module
src/components/           Shared shell components (nav, page container)
```

## Roadmap

Feature work is broken into modules M0–M9. See
[docs/soloclock-modules-and-tickets.md](docs/soloclock-modules-and-tickets.md)
for the full ticket breakdown and
[docs/soloclock-project-context.md](docs/soloclock-project-context.md) for
product context and schema notes.
