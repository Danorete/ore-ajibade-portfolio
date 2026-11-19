'use client'

import { Fragment } from 'react'
import { heroFacts, heroStats, profile } from '@/lib/data'

// Keep codes such as "AZ-900" on one line, but still allow a break after them.
function NoBreakCodes({ text }: { text: string }) {
  return text.split(' ').map((word, i, all) => (
    <Fragment key={`${word}-${i}`}>
      <span className={word.includes('-') ? 'whitespace-nowrap' : undefined}>
        {word}
      </span>
      {i < all.length - 1 ? ' ' : ''}
    </Fragment>
  ))
}

/*
 * Framing: from tablet width up the stat strip sits at the top of the right
 * column, above the portrait. The numbers are then visible on any realistic
 * viewport height and the fold can only cut through the photo. On phones the
 * portrait comes first and the strip follows below the first screen.
 */
export function Hero() {
  return (
    <section
      id="about"
      aria-labelledby="hero-title"
      className="mx-auto max-w-6xl px-4 pt-8 pb-14 sm:px-6 md:pt-10 md:pb-16"
    >
      <p className="eyebrow flex items-center gap-2.5">
        <span aria-hidden className="size-1.5 bg-primary" />
        {profile.status}
      </p>

      <div className="mt-6 grid gap-10 md:grid-cols-12 md:gap-x-8 lg:gap-x-10">
        <div className="md:col-span-8">
          <h1
            id="hero-title"
            className="font-display text-[clamp(3.25rem,8vw,6rem)] font-medium leading-[0.92] tracking-[-0.035em]"
          >
            {profile.name}
          </h1>
          <p className="mt-5 max-w-2xl font-display text-2xl leading-snug tracking-[-0.01em] sm:text-[1.75rem]">
            {profile.headline}
          </p>

          <dl className="mt-8 border-t border-border">
            {heroFacts.map((f) => (
              <div
                key={f.label}
                className="grid gap-1 border-b border-border py-2.5 sm:grid-cols-[7rem_1fr] sm:gap-6"
              >
                <dt className="eyebrow pt-1">{f.label}</dt>
                <dd>
                  <span className="font-medium">{f.value}</span>
                  <span className="numeric mt-0.5 block font-mono text-xs text-muted-foreground">
                    {f.detail}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex min-h-11 items-center bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              View projects
            </a>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-resume'))}
              className="inline-flex min-h-11 items-center border border-foreground px-6 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
            >
              Open resume
            </button>
            <a
              href="#contact"
              className="text-link inline-flex min-h-11 items-center text-sm font-medium sm:ml-2"
            >
              Get in touch
            </a>
          </div>

          <p className="numeric mt-2 flex flex-wrap gap-x-5 gap-y-0 font-mono text-xs text-muted-foreground">
            <span className="inline-flex min-h-11 items-center">{profile.location}</span>
            <a className="text-link inline-flex min-h-11 items-center" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <a className="text-link inline-flex min-h-11 items-center" href={profile.phoneHref}>
              {profile.phone}
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-6 md:col-span-4">
          <img
            src="/ore-ajibade.png"
            alt="Professional portrait of Ore Ajibade"
            width={682}
            height={1024}
            className="aspect-[4/3] w-full border border-border object-cover object-top sm:aspect-[16/9] md:aspect-[4/3]"
          />

          <dl className="grid grid-cols-2 border-t border-foreground md:order-first">
            {heroStats.map((s) => (
              <div
                key={s.label}
                className="flex min-w-0 flex-col border-b border-border py-4 odd:pr-4 even:border-l even:pl-4"
              >
                <dt className="order-2 mt-1 text-balance text-sm leading-snug text-muted-foreground">
                  <NoBreakCodes text={s.label} />
                </dt>
                <dd className="numeric order-1 font-mono text-3xl leading-none tracking-tight">
                  {s.metric}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
