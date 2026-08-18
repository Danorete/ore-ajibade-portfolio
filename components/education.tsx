import { Award, GraduationCap } from 'lucide-react'
import { education } from '@/lib/data'

export function Education() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="glass grid gap-6 rounded-2xl p-6 md:grid-cols-[1.2fr_1fr] md:p-8">
        <div className="flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <GraduationCap className="size-6" />
          </span>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              Education
            </span>
            <h3 className="text-lg font-semibold">{education.school}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {education.degree}
            </p>
            <span className="mt-1 w-fit rounded-md bg-secondary px-2 py-1 font-mono text-xs text-muted-foreground">
              {education.expected}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
            <Award className="size-4" />
            Honors
          </span>
          <ul className="flex flex-col gap-2.5">
            {education.honors.map((h) => (
              <li
                key={h}
                className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
              >
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
