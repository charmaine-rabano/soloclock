export function PageContainer({
  title,
  description,
  children,
}: {
  /** Omit when the view owns its own title+actions row (e.g. list pages that
   *  put the heading on the same line as filters/New buttons). */
  title?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-270 px-8 pt-8 pb-16">
      {title ? (
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-1.5 text-muted">{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </div>
  );
}
