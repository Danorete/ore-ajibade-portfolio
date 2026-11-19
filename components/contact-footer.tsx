'use client'

import { useId, useState } from 'react'
import { profile } from '@/lib/data'
import { Section } from './section'
import { GithubIcon, LinkedinIcon } from './brand-icons'

const fieldClass =
  'w-full border border-input bg-card px-3.5 py-2.5 text-base outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring sm:text-sm'

export function ContactFooter() {
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)
  const helpId = useId()

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  // Opens the visitor's email app with the message filled in. Nothing is stored.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const subject = encodeURIComponent(`Portfolio inquiry from ${data.get('name')}`)
    const body = encodeURIComponent(
      `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`,
    )
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setSent(true)
    form.reset()
    setTimeout(() => setSent(false), 4000)
  }

  const rowClass =
    'grid gap-1 border-b border-border py-4 sm:grid-cols-[7rem_1fr] sm:gap-6'

  return (
    <Section
      id="contact"
      index="07"
      label="Contact"
      title="Let's build something intelligent"
      intro="Open to Fall 2026 / 2027 AI & Data Engineering roles. Reach out and I'll get back to you quickly."
    >
      <div className="grid gap-12 md:grid-cols-2 md:gap-10">
        <dl className="border-t border-foreground">
          <div className={rowClass}>
            <dt className="eyebrow pt-1">Email</dt>
            <dd className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <a className="text-link numeric inline-flex min-h-11 items-center font-mono text-sm" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex min-h-11 items-center border border-border px-3 text-xs font-medium transition-colors hover:border-foreground"
              >
                Copy address
              </button>
              <span role="status" className="text-xs text-muted-foreground">
                {copied ? 'Copied to clipboard' : ''}
              </span>
            </dd>
          </div>
          <div className={rowClass}>
            <dt className="eyebrow pt-1">Phone</dt>
            <dd>
              <a className="text-link numeric inline-flex min-h-11 items-center font-mono text-sm" href={profile.phoneHref}>
                {profile.phone}
              </a>
            </dd>
          </div>
          <div className={rowClass}>
            <dt className="eyebrow pt-1">Location</dt>
            <dd className="font-mono text-sm">{profile.location}</dd>
          </div>
          <div className={rowClass}>
            <dt className="eyebrow pt-1">Elsewhere</dt>
            <dd className="flex flex-wrap gap-x-6">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="text-link inline-flex min-h-11 items-center gap-2 text-sm font-medium"
              >
                <GithubIcon aria-hidden className="size-4" />
                GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-link inline-flex min-h-11 items-center gap-2 text-sm font-medium"
              >
                <LinkedinIcon aria-hidden className="size-4" />
                LinkedIn
              </a>
            </dd>
          </div>
        </dl>

        <form onSubmit={onSubmit} aria-describedby={helpId} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                required
                autoComplete="name"
                placeholder="Jane Doe"
                className={fieldClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className="text-sm font-medium">
                Your email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="jane@company.com"
                className={fieldClass}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              placeholder="Tell me about the role or project"
              className={`${fieldClass} resize-y`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="inline-flex min-h-11 items-center bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              Send message
            </button>
            <span role="status" className="text-sm text-muted-foreground">
              {sent ? 'Opening your email app…' : ''}
            </span>
          </div>
          <p id={helpId} className="text-xs leading-relaxed text-muted-foreground">
            Sending opens your email app with this message filled in. Nothing is
            stored on this site.
          </p>
        </form>
      </div>

      <div className="mt-16 flex flex-col justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
        <span>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js and
          Tailwind CSS.
        </span>
        <span className="font-mono">
          {profile.role} · {profile.location}
        </span>
      </div>
    </Section>
  )
}
