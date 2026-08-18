'use client'

import {
  ArrowRight,
  BadgeCheck,
  Database,
  Download,
  Share2,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { heroStats, profile } from '@/lib/data'

const statIcons = {
  trophy: Trophy,
  database: Database,
  graph: Share2,
  badge: BadgeCheck,
} as const

export function Hero() {
  return (
    <section
      id="about"
      className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 pt-32 pb-16 sm:px-6 md:pt-40 md:pb-24"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        {profile.status}
      </div>

      <div className="max-w-3xl">
        <h1 className="text-pretty text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
          Bridging{' '}
          <span className="glow-text bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Data Analytics, Graph RAG
          </span>{' '}
          &amp; Intelligent AI Systems
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {profile.subtitle}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href="#projects"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110"
        >
          Explore Projects
          <ArrowRight className="size-4" />
        </a>
        <a
          href="#experience"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          View Experience
        </a>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('open-resume'))}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <Download className="size-4" />
          Download Resume (PDF)
        </button>
      </div>

      <div className="grid w-full grid-cols-2 gap-3 pt-4 md:grid-cols-4">
        {heroStats.map((s) => {
          const Icon = statIcons[s.icon]
          return (
            <div
              key={s.label}
              className="glass flex flex-col gap-2 rounded-xl p-4 transition-colors hover:border-primary/40"
            >
              <span className="flex items-center gap-2">
                <Icon className="size-4 text-primary" />
                <span className="font-mono text-xl font-bold text-primary">
                  {s.metric}
                </span>
              </span>
              <span className="text-xs leading-snug text-muted-foreground">
                {s.label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="size-3.5 text-primary" />
        Based in {profile.location} · Open to relocation
      </div>
    </section>
  )
}
