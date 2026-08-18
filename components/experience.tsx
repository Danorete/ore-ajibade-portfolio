'use client'

import { useState } from 'react'
import { ChevronDown, MapPin } from 'lucide-react'
import { experiences } from '@/lib/data'
import { cn } from '@/lib/utils'
import { SectionHeading } from './section-heading'

export function Experience() {
  const [open, setOpen] = useState(0)

  return (
    <section id="experience" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <SectionHeading
        eyebrow="Career"
        title="Work Experience & Leadership"
        description="A timeline of the roles where I've shipped data pipelines, AI systems, and measurable business impact."
      />

      <div className="mt-10 flex flex-col">
        {experiences.map((exp, i) => {
          const isOpen = open === i
          return (
            <div key={exp.company} className="relative pl-8 sm:pl-10">
              {/* timeline line */}
              <span
                className="absolute left-[7px] top-2 bottom-0 w-px bg-border sm:left-[9px]"
                aria-hidden
              />
              {/* node */}
              <span
                className={cn(
                  'absolute left-0 top-5 size-3.5 rounded-full border-2 transition-colors sm:size-4.5',
                  isOpen
                    ? 'border-primary bg-primary shadow-[0_0_16px] shadow-primary/60'
                    : 'border-border bg-card',
                )}
                aria-hidden
              />

              <div className="mb-3 overflow-hidden rounded-xl border border-border bg-card/40 transition-colors hover:border-primary/30">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="font-semibold">{exp.role}</span>
                      <span className="text-primary">·</span>
                      <span className="font-medium text-primary">
                        {exp.company}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-mono">{exp.period}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3" />
                        {exp.location}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      'size-5 shrink-0 text-muted-foreground transition-transform duration-300',
                      isOpen && 'rotate-180 text-primary',
                    )}
                  />
                </button>

                <div
                  className={cn(
                    'grid transition-all duration-300 ease-out',
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-5 sm:px-5">
                      <ul className="flex flex-col gap-2 border-t border-border pt-4">
                        {exp.points.map((p, idx) => (
                          <li
                            key={idx}
                            className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                          >
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                            {p}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {exp.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-secondary px-2 py-1 font-mono text-xs text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
