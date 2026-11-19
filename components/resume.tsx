'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import {
  education,
  experiences,
  profile,
  projects,
  skillCategories,
} from '@/lib/data'
import { Section } from './section'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export function Resume() {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnFocusTo = useRef<HTMLElement | null>(null)

  const show = useCallback(() => {
    returnFocusTo.current = document.activeElement as HTMLElement | null
    setOpen(true)
  }, [])

  const hide = useCallback(() => {
    setOpen(false)
    returnFocusTo.current?.focus()
  }, [])

  // Other parts of the page (nav, hero) ask for the preview with this event.
  useEffect(() => {
    window.addEventListener('open-resume', show)
    return () => window.removeEventListener('open-resume', show)
  }, [show])

  // While open: lock scroll, move focus in, keep Tab inside, close on Escape.
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hide()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const items = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, hide])

  return (
    <Section
      id="resume"
      index="06"
      label="Resume"
      title="Read the full story"
      intro="The complete resume, in the page or as a PDF."
    >
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={show}
          className="inline-flex min-h-11 items-center bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-85"
        >
          Preview resume
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-11 items-center border border-foreground px-6 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
        >
          Download PDF
        </button>
      </div>
      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        Download PDF opens your browser&apos;s print dialog. Choose &ldquo;Save as
        PDF&rdquo; as the destination.
      </p>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-dialog-title"
        >
          <div
            aria-hidden
            onClick={hide}
            className="absolute inset-0 bg-foreground/60"
          />
          <div
            ref={dialogRef}
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden border border-foreground bg-background"
          >
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
              <div className="flex flex-col">
                <span
                  id="resume-dialog-title"
                  className="font-display text-lg font-medium"
                >
                  {profile.name}
                </span>
                <span className="eyebrow">
                  {profile.role} · {profile.location}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex min-h-11 items-center border border-foreground px-4 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
                >
                  Print / Save PDF
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={hide}
                  aria-label="Close resume preview"
                  className="flex size-11 items-center justify-center hover:bg-muted"
                >
                  <X aria-hidden className="size-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-6 py-6 sm:px-8">
              <ResumeBody />
            </div>
          </div>
        </div>
      )}

      {/* Hidden printable copy, shown only when printing */}
      <div id="resume-print" className="hidden">
        <ResumeBody print />
      </div>
    </Section>
  )
}

function ResumeBody({ print = false }: { print?: boolean }) {
  return (
    <div className={print ? 'text-black' : ''}>
      <header className="border-b border-border pb-4">
        <h1 className="font-display text-3xl font-medium">{profile.name}</h1>
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
                <span className="numeric font-mono text-xs text-muted-foreground">
                  {e.period}
                </span>
              </div>
              <ul className="mt-1.5 flex flex-col gap-1">
                {e.points.map((p) => (
                  <li
                    key={p}
                    className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span
                      aria-hidden
                      className="mt-2.5 h-px w-2 shrink-0 bg-muted-foreground"
                    />
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
      <h2 className="eyebrow mb-2 !text-foreground">{title}</h2>
      {children}
    </div>
  )
}
