import { Icon, iconNames } from "@/components/icons";
import {
  Avatar,
  Button,
  Card,
  Field,
  FieldLabel,
  Logo,
  ProjectDot,
  StatCard,
  Tag,
  type TagStatus,
} from "@/components/ui";
import { cn } from "@/lib/cn";

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
    </div>
  );
}
