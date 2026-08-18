'use client'

import { useState } from 'react'
import { Check, Copy, Mail, MapPin, Send } from 'lucide-react'
import { profile } from '@/lib/data'
import { SectionHeading } from './section-heading'
import { GithubIcon, LinkedinIcon } from './brand-icons'

export function ContactFooter() {
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

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
    setTimeout(() => setSent(false), 2500)
  }

  return (
    <footer id="contact" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something intelligent"
        description="Open to Fall 2026 / 2027 AI & Data Engineering roles. Reach out and I'll get back to you quickly."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={copyEmail}
            className="glass group flex items-center justify-between gap-4 rounded-xl p-4 text-left transition-colors hover:border-primary/40"
          >
            <span className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Mail className="size-5" />
              </span>
              <span className="flex flex-col">
                <span className="text-xs text-muted-foreground">Email</span>
                <span className="text-sm font-medium">{profile.email}</span>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
              {copied ? (
                <>
                  <Check className="size-3.5 text-primary" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" /> Copy
                </>
              )}
            </span>
          </button>

          <div className="glass flex items-center gap-3 rounded-xl p-4">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <MapPin className="size-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-xs text-muted-foreground">Location</span>
              <span className="text-sm font-medium">{profile.location}</span>
            </span>
          </div>

          <div className="flex gap-3">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="glass flex flex-1 items-center justify-center gap-2 rounded-xl p-4 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
            >
              <GithubIcon className="size-4.5" />
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="glass flex flex-1 items-center justify-center gap-2 rounded-xl p-4 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
            >
              <LinkedinIcon className="size-4.5" />
              LinkedIn
            </a>
          </div>
        </div>

        <form onSubmit={onSubmit} className="glass flex flex-col gap-4 rounded-2xl p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Name</span>
              <input
                name="name"
                required
                placeholder="Jane Doe"
                className="rounded-lg border border-border bg-background/50 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Email</span>
              <input
                name="email"
                type="email"
                required
                placeholder="jane@company.com"
                className="rounded-lg border border-border bg-background/50 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Message</span>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Tell me about the role or project…"
              className="resize-none rounded-lg border border-border bg-background/50 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110"
          >
            {sent ? (
              <>
                <Check className="size-4" /> Opening email…
              </>
            ) : (
              <>
                <Send className="size-4" /> Send Message
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
        <span>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js &amp;
          Tailwind CSS.
        </span>
        <span className="font-mono text-xs">{profile.role} · {profile.location}</span>
      </div>
    </footer>
  )
}
