'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronDown,
  Code,
  ExternalLink,
  MapPin,
  Trophy,
} from 'lucide-react'
import { hackathons } from '@/lib/data'
import { cn } from '@/lib/utils'
import { SectionHeading } from './section-heading'

export function Hackathons() {
  const [open, setOpen] = useState(0)

  return (
    <section
      id="hackathons"
      className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 md:pt-10 md:pb-24"
    >
      <SectionHeading
        eyebrow="Competition"
        title="Hackathons"
        description="Timed builds where I've led teams, shipped prototypes, and competed under pressure."
      />

      <div className="mt-10 flex flex-col">
        {hackathons.map((hack, i) => {
          const isOpen = open === i
          return (
            <div key={hack.name} className="relative pl-8 sm:pl-10">
              <span
                className="absolute left-[7px] top-2 bottom-0 w-px bg-border sm:left-[9px]"
                aria-hidden
              />
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
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-semibold">{hack.role}</span>
                      <span className="text-primary">·</span>
                      <span className="font-medium text-primary">
                        {hack.name}
                      </span>
                      {hack.result ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          <Trophy className="size-3" />
                          {hack.result}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-mono">{hack.period}</span>
                      {hack.event ? <span>{hack.event}</span> : null}
                      {hack.location ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3" />
                          {hack.location}
                        </span>
                      ) : null}
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
                        {hack.points.map((p, idx) => (
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
                        {hack.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-secondary px-2 py-1 font-mono text-xs text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      {(hack.liveUrl || hack.repoUrl || hack.detailHref) && (
                        <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4">
                          {hack.detailHref && (
                            <Link
                              href={hack.detailHref}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                            >
                              View case study
                              <ArrowRight className="size-3.5" />
                            </Link>
                          )}
                          {hack.liveUrl && (
                            <a
                              href={hack.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                            >
                              <ExternalLink className="size-3.5" />
                              Live Demo
                            </a>
                          )}
                          {hack.repoUrl && (
                            <a
                              href={hack.repoUrl}
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
