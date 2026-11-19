import { experiences } from '@/lib/data'
import { Section } from './section'

export function Experience() {
  return (
    <Section
      id="experience"
      index="01"
      label="Experience"
      title="Roles & leadership"
      intro="Where I shipped data pipelines, AI systems, and measurable results."
    >
      <ol className="border-b border-border">
        {experiences.map((exp) => (
          <li
            key={exp.company}
            className="grid gap-4 border-t border-border py-8 first:border-t-0 first:pt-0 md:grid-cols-[10.5rem_1fr] md:gap-8"
          >
            <div className="numeric font-mono text-xs leading-relaxed text-muted-foreground">
              <p>{exp.period}</p>
              <p className="mt-1">{exp.location}</p>
            </div>

            <div>
              <h3 className="font-display text-2xl font-medium leading-tight tracking-[-0.01em]">
                {exp.role}
              </h3>
              <p className="mt-1 text-sm font-medium text-primary">
                {exp.company}
              </p>

              <ul className="mt-4 space-y-2.5">
                {exp.points.map((p) => (
                  <li
                    key={p}
                    className="relative pl-5 text-[0.95rem] leading-relaxed"
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-[0.75em] h-px w-3 bg-muted-foreground"
                    />
                    {p}
                  </li>
                ))}
              </ul>

              <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
                <span className="eyebrow mr-2">Stack</span>
                {exp.tags.join(', ')}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
