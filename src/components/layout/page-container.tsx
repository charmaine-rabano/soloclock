export function PageContainer({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-270 px-8 pt-8 pb-16">
      <header className="mb-6">
        <h1 className="text-2xl tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1.5 text-muted">{description}</p>
        ) : null}
      </header>
      {children}
    </div>
  );
}
