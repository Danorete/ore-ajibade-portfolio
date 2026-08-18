export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <span className="inline-flex w-fit items-center gap-2 font-mono text-xs font-medium uppercase tracking-widest text-primary">
        <span className="h-px w-6 bg-primary" />
        {eyebrow}
      </span>
      <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-pretty leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}
