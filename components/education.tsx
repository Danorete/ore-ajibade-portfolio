import { education } from '@/lib/data'
import { Section } from './section'

export function Education() {
  return (
    <Section
      id="education"
      index="04"
      label="Education"
      title="Academics"
    >
      <div className="grid gap-10 md:grid-cols-2 md:gap-8">
        <div>
          <p className="eyebrow mb-3">Degree</p>
          <h3 className="font-display text-2xl font-medium leading-tight tracking-[-0.01em]">
            {education.school}
          </h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed">{education.degree}</p>
          <p className="numeric mt-2 font-mono text-xs text-muted-foreground">
            {education.expected}
          </p>
        </div>

        <div>
          <p className="eyebrow mb-3">Honors</p>
          <ul className="space-y-2.5">
            {education.honors.map((h) => (
              <li
                key={h}
                className="relative pl-5 text-[0.95rem] leading-relaxed"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-[0.75em] h-px w-3 bg-muted-foreground"
                />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-10 border-t border-border pt-5 font-mono text-xs leading-relaxed text-muted-foreground">
        <span className="eyebrow mr-2">Coursework</span>
        {education.coursework.join(', ')}
      </p>
    </Section>
  )
}
