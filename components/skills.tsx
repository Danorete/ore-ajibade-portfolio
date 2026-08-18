'use client'

import { useState } from 'react'
import { BadgeCheck, Boxes, BrainCircuit, LineChart } from 'lucide-react'
import { skillCategories } from '@/lib/data'
import { cn } from '@/lib/utils'
import { SectionHeading } from './section-heading'

const icons = [BrainCircuit, Boxes, LineChart, BadgeCheck]

export function Skills() {
  const [active, setActive] = useState(0)
  const current = skillCategories[active]
  const isCerts = current.name === 'Certifications'

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <SectionHeading
        eyebrow="Toolkit"
        title="Skills & Tool Matrix"
        description="Filter by discipline to see the specific tools, techniques, and credentials I work with."
      />

      <div className="mt-10 flex flex-wrap gap-2">
        {skillCategories.map((c, i) => {
          const Icon = icons[i]
          const isActive = active === i
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all',
                isActive
                  ? 'border-primary/40 bg-primary/15 text-primary'
                  : 'border-border bg-card/40 text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <Icon className="size-4" />
              {c.name}
            </button>
          )
        })}
      </div>

      <div className="mt-6 glass rounded-2xl p-6">
        <div className={cn('flex flex-wrap gap-2.5', isCerts && 'flex-col')}>
          {current.skills.map((s) =>
            isCerts ? (
              <div
                key={s}
                className="flex items-center gap-3 rounded-lg border border-border bg-background/40 px-4 py-3"
              >
                <BadgeCheck className="size-5 shrink-0 text-primary" />
                <span className="text-sm font-medium">{s}</span>
              </div>
            ) : (
              <span
                key={s}
                className="rounded-lg border border-border bg-background/40 px-3.5 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {s}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
