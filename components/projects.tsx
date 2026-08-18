import { Code, ExternalLink, Trophy } from 'lucide-react'
import { projects } from '@/lib/data'
import { SectionHeading } from './section-heading'

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <SectionHeading
        eyebrow="Selected Work"
        title="Featured Projects"
        description="Shipped systems that pair rigorous data engineering with practical, agentic AI."
      />

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p.title}
            className="glass group relative flex flex-col gap-5 rounded-2xl p-6 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
          >
            {p.award && (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                <Trophy className="size-3.5" />
                {p.award}
              </span>
            )}

            <div className="flex flex-col gap-2">
              <h3 className="text-balance text-lg font-semibold leading-snug">
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {p.blurb}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-xl border border-border bg-background/40 p-4">
              {p.highlights.map((h) => (
                <div key={h.label} className="flex flex-col gap-1">
                  <span className="font-mono text-lg font-bold text-primary">
                    {h.metric}
                  </span>
                  <span className="text-[11px] leading-tight text-muted-foreground">
                    {h.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-auto flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-secondary px-2 py-1 font-mono text-xs text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>

            {(p.liveUrl || p.repoUrl) && (
              <div className="flex flex-wrap gap-4 border-t border-border pt-4">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    <ExternalLink className="size-3.5" />
                    Live Demo
                  </a>
                )}
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    <Code className="size-3.5" />
                    Code
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
