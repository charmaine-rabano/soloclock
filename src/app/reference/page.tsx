import { Icon, iconNames } from "@/components/icons";

export const metadata = { title: "Reference" };

const colorSwatches = [
  { label: "foreground", className: "text-foreground" },
  { label: "accent", className: "text-accent" },
  { label: "danger", className: "text-danger" },
  { label: "status-paid", className: "text-status-paid" },
  { label: "muted", className: "text-muted" },
];

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

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">currentColor</h2>
        <p className="mb-3 text-sm text-muted">
          Icons inherit color from surrounding text — no fixed hex.
        </p>
        <div className="flex gap-6 rounded-card border border-border bg-card p-6">
          {colorSwatches.map(({ label, className }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-2 ${className}`}
            >
              <Icon name="check" size={22} />
              <span className="font-mono text-xs">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
