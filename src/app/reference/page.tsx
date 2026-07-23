import { Icon, iconNames } from "@/components/icons";
import { MobileShell } from "@/components/layout/mobile-shell";
import { RunningTimerBar } from "@/components/layout/running-timer-bar";
import { TopNav } from "@/components/layout/top-nav";
import { logoutAction } from "@/lib/auth/actions";
import {
  AuthCard,
  Avatar,
  BarChart,
  Breadcrumb,
  Button,
  Card,
  ChartLegend,
  DateField,
  EmptyState,
  EntryRow,
  ErrorState,
  Field,
  FieldGroup,
  FieldLabel,
  FormRow,
  GroupHeader,
  InlineFormError,
  KpiRow,
  Logo,
  PageHeader,
  ProjectDot,
  Select,
  StatCard,
  StatusTimeline,
  SummaryTotals,
  Table,
  TableHeader,
  TableRow,
  Tag,
  type TagStatus,
  TimeField,
} from "@/components/ui";
import { cn } from "@/lib/cn";

import {
  CheckboxDemo,
  CollapsibleGroupRowDemo,
  ColorPickerDemo,
  ConfirmDialogDemo,
  FilterRailDemo,
  ModalDemo,
  SegmentedControlDemo,
  ToggleDemo,
} from "./demos";

export const metadata = { title: "Reference" };

const colorSwatches = [
  { label: "foreground", className: "text-foreground" },
  { label: "accent", className: "text-accent" },
  { label: "danger", className: "text-danger" },
  { label: "status-paid", className: "text-status-paid" },
  { label: "muted", className: "text-muted" },
];

const tagStatuses: { status: TagStatus; label: string }[] = [
  { status: "running", label: "RUNNING" },
  { status: "non-billable", label: "NON-BILLABLE" },
  { status: "count", label: "×2" },
  { status: "excluded", label: "EXCLUDED" },
  { status: "draft", label: "DRAFT" },
  { status: "sent", label: "SENT" },
  { status: "paid", label: "PAID" },
  { status: "void", label: "VOID" },
];

// Sample user-chosen project hexes from the mockup.
const projectColors = [
  "#56c7d6",
  "#a78bfa",
  "#f27db4",
  "#a6e24d",
  "#9aa6b2",
  "#e2b23c",
];

const chartData = [
  { month: "Feb", billed: 3200, collected: 3200 },
  { month: "Mar", billed: 4100, collected: 3900 },
  { month: "Apr", billed: 3600, collected: 3600 },
  { month: "May", billed: 4800, collected: 4200 },
  { month: "Jun", billed: 4400, collected: 4400 },
  { month: "Jul", billed: 5200, collected: 3100, current: true },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {description ? (
        <p className="mb-3 text-sm text-muted">{description}</p>
      ) : null}
      <div className="rounded-card border border-border bg-card p-6">
        {children}
      </div>
    </section>
  );
}

export default function ReferencePage() {
  return (
    <div className="mx-auto max-w-270 px-8 py-8">
      <header className="mb-6">
        <h1 className="text-2xl tracking-tight">Reference</h1>
        <p className="mt-1.5 text-muted">
          Component & icon library lookup for building later modules
          (SC-FND-05).
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Icons</h2>
        <div className="grid grid-cols-2 gap-4 rounded-card border border-border bg-card p-6 sm:grid-cols-4 md:grid-cols-6">
          {iconNames.map((name) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <Icon name={name} size={22} />
              <span className="font-mono text-xs text-muted">{name}</span>
            </div>
          ))}
        </div>
      </section>

      <Section
        title="currentColor"
        description="Icons inherit color from surrounding text — no fixed hex."
      >
        <div className="flex gap-6">
          {colorSwatches.map(({ label, className }) => (
            <div
              key={label}
              className={cn("flex flex-col items-center gap-2", className)}
            >
              <Icon name="check" size={22} />
              <span className="font-mono text-xs">{label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">
              <Icon name="plus" size={14} />
              New entry
            </Button>
            <Button variant="secondary">Filters</Button>
            <Button variant="destructive">Void invoice</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" compact>
              <Icon name="plus" size={13} />
              New
            </Button>
            <Button variant="secondary" compact>
              <Icon name="chevron-down" size={13} />
              Group by
            </Button>
            <Button variant="destructive" compact>
              Delete
            </Button>
          </div>
          <div className="max-w-xs">
            <Button variant="primary" fullWidth>
              Sign in
            </Button>
          </div>
        </div>
      </Section>

      <Section
        title="Tags"
        description="The status-is-text primitive — status glyphs are folded into each variant."
      >
        <div className="flex flex-wrap items-center gap-3">
          {tagStatuses.map(({ status, label }) => (
            <Tag key={status} status={status}>
              {label}
            </Tag>
          ))}
        </div>
      </Section>

      <Section title="Fields">
        <div className="grid max-w-md gap-5">
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Client</FieldLabel>
            <Field placeholder="Acme Inc." />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel optional>Description</FieldLabel>
            <Field placeholder="What did you work on?" />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Hourly rate</FieldLabel>
            <Field defaultValue="-5" error="Rate must be a positive number." />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Invoice number</FieldLabel>
            <Field defaultValue="INV-0007" disabled />
          </div>
        </div>
      </Section>

      <Section title="Stat cards">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Unbilled"
            value="18h 40m"
            accent
            caption="4 projects"
          />
          <StatCard label="This week" value="32h 15m" />
          <StatCard label="Outstanding" value="$2,400" compact />
        </div>
      </Section>

      <Section title="Card">
        <Card className="max-w-md p-5">
          <h3 className="font-semibold">Bordered surface</h3>
          <p className="mt-1 text-sm text-muted">
            The base container other data-display components build on.
          </p>
        </Card>
      </Section>

      <Section title="Avatars">
        <div className="flex items-center gap-4">
          <Avatar initials="CR" />
          <Avatar initials="AD" />
          <Avatar initials="JS" size={40} />
        </div>
      </Section>

      <Section
        title="Project dots"
        description="Accent swatch for project identity — user hex via inline style, never a background behind text."
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            {projectColors.map((color) => (
              <ProjectDot key={color} color={color} />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <ProjectDot color="#56c7d6" size={9} />
            <ProjectDot color="#56c7d6" size={11} />
            <ProjectDot color="#56c7d6" size={13} />
            <ProjectDot color="#56c7d6" size={16} />
          </div>
          <div className="flex items-stretch gap-2">
            <ProjectDot color="#a78bfa" variant="rail" />
            <div className="py-1">
              <p className="text-sm">Website redesign</p>
              <p className="text-xs text-muted">Acme Inc.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Logo">
        <div className="flex items-center gap-8">
          <Logo size="md" />
          <Logo size="sm" />
        </div>
      </Section>

      {/* Form controls */}

      <Section title="Select">
        <div className="grid max-w-md gap-4">
          <Select
            defaultValue="acme-redesign"
            options={[
              {
                value: "acme-redesign",
                label: "Acme Redesign",
                color: "#56c7d6",
                sublabel: "Acme Co",
              },
              {
                value: "q3-retainer",
                label: "Q3 Retainer",
                color: "#e2b23c",
                sublabel: "Acme Co",
              },
              {
                value: "website-copy",
                label: "Website Copy",
                color: "#a78bfa",
                sublabel: "Bright Media",
              },
              {
                value: "internal-ops",
                label: "Internal Ops",
                color: "#9aa6b2",
                sublabel: "Internal",
              },
            ]}
          />
          <Select
            compact
            defaultValue="all"
            options={[
              { value: "all", label: "All clients", separatorAfter: true },
              { value: "acme", label: "Acme Co" },
              { value: "bright", label: "Bright Media" },
              { value: "northwind", label: "Northwind" },
              { value: "lumen", label: "Lumen Labs" },
            ]}
          />
        </div>
      </Section>

      <Section title="Date & time fields">
        <FormRow className="max-w-md">
          <FieldGroup>
            <FieldLabel>Date</FieldLabel>
            <DateField defaultValue="2026-07-14" />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Start</FieldLabel>
            <TimeField
              defaultValue="2:00"
              defaultMeridiem="PM"
              aria-label="Start"
            />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>End</FieldLabel>
            <TimeField
              defaultValue="3:25"
              defaultMeridiem="PM"
              aria-label="End"
            />
          </FieldGroup>
        </FormRow>
      </Section>

      <Section title="Toggle">
        <div className="max-w-xs">
          <ToggleDemo />
        </div>
      </Section>

      <Section title="Checkbox">
        <CheckboxDemo />
      </Section>

      <Section
        title="SegmentedControl"
        description={'The "Group by" Day/Project selector.'}
      >
        <SegmentedControlDemo />
      </Section>

      <Section title="ColorPicker">
        <ColorPickerDemo />
      </Section>

      {/* Navigation & shell */}

      <Section
        title="TopNav"
        description="The 60px authenticated header — wired into the (app) route group's layout."
      >
        <div className="overflow-hidden rounded-card border border-border-field">
          <TopNav userEmail="jane@acme.co" logoutAction={logoutAction} />
        </div>
      </Section>

      <Section
        title="Mobile header & drawer"
        description="Click the hamburger to preview the drawer; the header swaps in below the md breakpoint."
      >
        <div className="max-w-sm overflow-hidden rounded-card border border-border-field">
          <MobileShell userEmail="jane@acme.co" logoutAction={logoutAction} />
        </div>
      </Section>

      <Section
        title="RunningTimerBar"
        description="The live footer bar, gated on isRunning in M6."
      >
        <div className="overflow-hidden rounded-card border border-border-field">
          <RunningTimerBar
            projectColor="#56c7d6"
            projectName="Acme Redesign"
            clientLabel="Acme Co"
            descriptionLabel="Hero section polish"
            elapsed="01:12:44"
          />
        </div>
      </Section>

      <Section title="Breadcrumb">
        <Breadcrumb
          items={[{ label: "Clients", href: "/clients" }, { label: "Acme Co" }]}
        />
      </Section>

      <Section title="PageHeader">
        <PageHeader
          title="Acme Co"
          subtitle="4 active projects · $1,240 unbilled"
          rail="#56c7d6"
          actions={<Button variant="secondary">Edit client</Button>}
        />
      </Section>

      <Section title="FilterRail">
        <FilterRailDemo />
      </Section>

      {/* Data display */}

      <Section title="Table">
        <Table>
          <TableHeader columns="1fr 220px 120px 130px 40px">
            <span>Client</span>
            <span>Email</span>
            <span>Projects</span>
            <span className="text-right">Unbilled</span>
            <span />
          </TableHeader>
          <TableRow columns="1fr 220px 120px 130px 40px" first>
            <span className="font-medium">Acme Co</span>
            <span className="text-muted">billing@acme.co</span>
            <span className="text-muted">4</span>
            <span className="text-right font-mono text-accent">$1,240</span>
            <Icon
              name="chevron-right"
              size={14}
              className="ml-auto text-subtle"
            />
          </TableRow>
          <TableRow columns="1fr 220px 120px 130px 40px">
            <span className="font-medium">Northwind Traders</span>
            <span className="text-muted">ap@northwind.co</span>
            <span className="text-muted">2</span>
            <span className="text-right font-mono text-accent">$480</span>
            <Icon
              name="chevron-right"
              size={14}
              className="ml-auto text-subtle"
            />
          </TableRow>
        </Table>
      </Section>

      <Section
        title="EntryRow"
        description="The time-entry row — running rows get an accent left rail."
      >
        <Table>
          <EntryRow
            first
            running
            projectColor="#56c7d6"
            projectName="Acme Redesign"
            clientName="Acme Co"
            timeRange="2:00 PM – now"
            duration="1h 12m"
            description="Hero section polish"
            trailing={<Tag status="running">RUNNING</Tag>}
          />
          <EntryRow
            projectColor="#a78bfa"
            projectName="Website Copy"
            clientName="Northwind Traders"
            timeRange="9:00 AM – 10:15 AM"
            duration="1h 15m"
            description="Homepage draft"
          />
        </Table>
      </Section>

      <Section title="CollapsibleGroupRow">
        <Table>
          <CollapsibleGroupRowDemo />
        </Table>
      </Section>

      <Section title="GroupHeader">
        <div className="flex flex-col gap-3">
          <div className="overflow-hidden rounded-card border border-border-field">
            <GroupHeader
              left={
                <span className="text-[13.5px] font-bold">Mon · Jul 14</span>
              }
              right={
                <span className="font-mono text-[13px] text-body">10h 15m</span>
              }
            />
          </div>
          <div className="overflow-hidden rounded-card border border-border-field">
            <GroupHeader
              left={
                <>
                  <ProjectDot color="#56c7d6" size={11} />
                  <span className="text-[14.5px] font-bold">Acme Redesign</span>
                  <span className="text-[13px] text-muted">
                    · Acme Co · $95/hr
                  </span>
                </>
              }
              right={
                <>
                  <Tag status="running">RUNNING</Tag>
                  <span className="font-mono text-[13px] text-accent">
                    6h 40m
                  </span>
                </>
              }
            />
          </div>
        </div>
      </Section>

      <Section title="KpiRow">
        <KpiRow>
          <StatCard
            label="Unbilled"
            value="18h 40m"
            accent
            caption="4 projects"
          />
          <StatCard label="This week" value="32h 15m" />
          <StatCard label="Outstanding" value="$2,400" />
          <StatCard label="Active clients" value="6" />
        </KpiRow>
      </Section>

      <Section title="BarChart">
        <div className="flex flex-col gap-4">
          <ChartLegend />
          <BarChart data={chartData} />
        </div>
      </Section>

      <Section title="StatusTimeline">
        <div className="max-w-xs">
          <StatusTimeline
            steps={[
              { label: "Draft", timestamp: "Jul 10", state: "done" },
              { label: "Sent", timestamp: "now", state: "current" },
              { label: "Paid", state: "upcoming" },
            ]}
          />
        </div>
      </Section>

      <Section title="SummaryTotals">
        <div className="max-w-xs">
          <SummaryTotals
            rows={[
              { label: "Total hours", value: "6h 45m" },
              { label: "Rate applied", value: "$95/hr" },
            ]}
            total={{ label: "Total due", value: "$641.25" }}
          />
        </div>
      </Section>

      {/* Overlays & feedback */}

      <Section title="Modal">
        <ModalDemo />
      </Section>

      <Section title="ConfirmDialog">
        <ConfirmDialogDemo />
      </Section>

      <Section title="AuthCard">
        <div className="overflow-hidden rounded-card">
          <AuthCard
            className="min-h-125"
            title="Welcome back"
            subtitle="Sign in to your account"
            footer="Don't have an account? Sign up"
          >
            <FieldGroup>
              <FieldLabel>Email</FieldLabel>
              <Field placeholder="you@company.com" />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>Password</FieldLabel>
              <Field type="password" />
            </FieldGroup>
            <Button variant="primary" fullWidth>
              Sign in
            </Button>
          </AuthCard>
        </div>
      </Section>

      <Section title="EmptyState">
        <div className="grid gap-4 sm:grid-cols-2">
          <EmptyState
            variant="no-data"
            title="No time tracked"
            body="Start a timer or add a manual entry to see it here."
            actions={<Button variant="primary">+ New entry</Button>}
          />
          <EmptyState
            variant="no-results"
            title="No entries match your filters"
            body="Try widening the date range or clearing filters."
            actions={<Button variant="secondary">Clear filters</Button>}
          />
        </div>
      </Section>

      <Section title="ErrorState">
        <div className="grid gap-4 sm:grid-cols-2">
          <ErrorState
            variant="error"
            title="Something went wrong"
            body="Give it another try — if it keeps happening, let us know."
            actions={<Button variant="primary">Try again</Button>}
          />
          <ErrorState
            variant="not-found"
            title="Page not found"
            body="The page you're looking for doesn't exist or has moved."
            actions={<Button variant="primary">Back to dashboard</Button>}
          />
        </div>
      </Section>

      <Section
        title="InlineFormError"
        description="The standalone version — Field's own error prop covers most cases."
      >
        <div className="max-w-md">
          <FieldGroup>
            <FieldLabel required>Email</FieldLabel>
            <Field defaultValue="jane@" />
            <InlineFormError>Incorrect email or password.</InlineFormError>
          </FieldGroup>
        </div>
      </Section>
    </div>
  );
}
