'use client'

import { useEffect, useState } from 'react'
import { Download, FileText, Printer, X } from 'lucide-react'
import {
  education,
  experiences,
  profile,
  projects,
  skillCategories,
} from '@/lib/data'
import { SectionHeading } from './section-heading'

export function Resume() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const openHandler = () => setOpen(true)
    window.addEventListener('open-resume', openHandler)
    return () => window.removeEventListener('open-resume', openHandler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <section id="resume" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <div className="glass flex flex-col items-start gap-6 rounded-2xl p-8 md:flex-row md:items-center md:justify-between md:p-10">
        <div className="flex flex-col gap-3">
          <SectionHeading
            eyebrow="Resume"
            title="Read the full story"
            description="Preview the complete, structured resume in-browser or grab a print-ready PDF copy."
          />
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110"
          >
            <FileText className="size-4" />
            Preview Resume
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Download className="size-4" />
            Download PDF
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Resume preview"
        >
          <button
            type="button"
            aria-label="Close resume"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <div className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
              <div className="flex flex-col">
                <span className="font-semibold">{profile.name}</span>
                <span className="text-xs text-muted-foreground">
                  {profile.role} · {profile.location}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-all hover:brightness-110"
                >
                  <Printer className="size-3.5" />
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-6 py-6 sm:px-8">
              <ResumeBody />
            </div>
          </div>
        </div>
      )}

      {/* Hidden printable copy — shown only when printing */}
      <div id="resume-print" className="hidden">
        <ResumeBody print />
      </div>
    </section>
  )
}

function ResumeBody({ print = false }: { print?: boolean }) {
  return (
    <div className={print ? 'text-black' : ''}>
      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile.role} Developer · {profile.location}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {profile.email} · {profile.github} · {profile.linkedin}
        </p>
      </header>

      <ResumeGroup title="Summary">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {profile.headline}. {profile.subtitle}
        </p>
      </ResumeGroup>

      <ResumeGroup title="Experience">
        <div className="flex flex-col gap-4">
          {experiences.map((e) => (
            <div key={e.company}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="font-semibold">
                  {e.role} — {e.company}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {e.period}
                </span>
              </div>
              <ul className="mt-1.5 flex flex-col gap-1">
                {e.points.map((p, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ResumeGroup>

      <ResumeGroup title="Projects">
        <div className="flex flex-col gap-3">
          {projects.map((p) => (
            <div key={p.title}>
              <span className="font-semibold">{p.title}</span>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {p.blurb}
              </p>
            </div>
          ))}
        </div>
      </ResumeGroup>

      <ResumeGroup title="Skills">
        <div className="flex flex-col gap-2">
          {skillCategories.map((c) => (
            <p key={c.name} className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{c.name}: </span>
              {c.skills.join(', ')}
            </p>
          ))}
        </div>
      </ResumeGroup>

      <ResumeGroup title="Education & Honors">
        <p className="text-sm">
          <span className="font-semibold">{education.school}</span> —{' '}
          {education.degree} ({education.expected})
        </p>
        <ul className="mt-1.5 flex flex-col gap-1">
          {education.honors.map((h) => (
            <li key={h} className="text-sm text-muted-foreground">
              {h}
            </li>
          ))}
        </ul>
      </ResumeGroup>
    </div>
  )
}

function ResumeGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-5">
      <h2 className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
        {title}
      </h2>
      {children}
    </div>
  )
}
