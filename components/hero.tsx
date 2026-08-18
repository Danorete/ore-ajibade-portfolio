'use client'

import {
  ArrowRight,
  BadgeCheck,
  Database,
  Download,
  Mail,
  MapPin,
  Phone,
  Share2,
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
      className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 pt-32 pb-8 sm:px-6 md:pt-40 md:pb-10"
    >
      <div className="flex w-full flex-col-reverse items-start gap-8 md:flex-row md:justify-between">
        <div className="flex flex-col items-start gap-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {profile.status}
          </div>

          <div className="max-w-3xl">
            <h1 className="text-pretty text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
              Meet{' '}
              <span className="glow-text bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                {profile.name}
              </span>
            </h1>
            <p className="mt-4 text-pretty text-lg font-semibold text-foreground sm:text-xl">
              {profile.headline}
            </p>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {profile.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-primary" />
              {profile.location}
            </span>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Mail className="size-4 text-primary" />
              {profile.email}
            </a>
            <a
              href={profile.phoneHref}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Phone className="size-4 text-primary" />
              {profile.phone}
            </a>
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
        </div>

        <img
          src="/ore-ajibade.png"
          alt="Professional portrait of Ore Ajibade"
          className="w-40 shrink-0 rounded-2xl border border-primary/30 object-cover shadow-xl shadow-primary/15 sm:w-48 md:w-60"
        />
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

    </section>
  )
}
