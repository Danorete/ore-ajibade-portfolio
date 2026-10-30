import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Trophy } from 'lucide-react'
import { DemoClip } from '@/components/demo-clip'
import { profile } from '@/lib/data'
import { getDemoClips, getScreenshots } from '@/lib/piedmont-media'

/** Set when a public demo URL is ready. Empty hides the live-demo button. */
const DEMO_URL = ''

export const metadata: Metadata = {
  title: 'The Piedmont Ledger — Ore Ajibade',
  description:
    'A team investigation of a simulated ticketing-system breach, with a tested alert and a six-week plan. Honorable Mention at the Microsoft × AIS GSU Data Dive, Cybersecurity track.',
}

const skillBlocks = [
  {
    title: 'Data analysis and visualization',
    bullets: [
      'Cleaned, joined and verified two data files with pandas. Rechecked an earlier set of findings against the raw files and fixed one number (92 tickets to replace, not 96: refunded tickets excluded).',
      'Built a held-out test for a detection rule so the result was not just fitted to the answer.',
      'Designed visuals for a non-technical audience: a timeline with callout boxes (fact versus our guess), a gate scene with people walking in, and a before-and-after comparison (500 details copied with an alert, 11,000 without).',
      'Labelled every claim as fact, our guess, unknown or proposal, and cited the file and row.',
    ],
  },
  {
    title: 'AI agent prompting',
    bullets: [
      'Directed several AI tools as a team of specialists: one to explore and critique the data, a design tool for the first draft, a code editor for the animated build, and a second model for outside critique.',
      'Wrote a source-of-truth rubric (30+ locked facts, each marked confirmed, guess or unknown, with forbidden claims and expected test results) so every agent worked from the same numbers.',
      'Wrote audit-first prompts: each build prompt told the agent to check the numbers against the rubric, write a test (all 16 control combinations), run the page, and report what it could not do.',
      'Verified AI output myself with headless-browser tests (offline, overflow, playback), and rejected advice that did not fit, such as outside suggestions to claim technology we had not built.',
    ],
  },
  {
    title: 'Project management',
    bullets: [
      'Time-boxed a 24-hour sprint: investigation, then story, then build, then rehearsal.',
      'Turned advisor feedback into changes: agenda on slide 2, bigger titles, fewer bullets, one risk per fix, plain words, and a clear ask for the festival day.',
      'Cut scope hard to fit five minutes: from 34 steps to 10 slides, and kept extras as spoken "mentions" in a script.',
      'Kept fallbacks: earlier versions of the deck were saved as backups, and a timed script with a Q&A cheat sheet.',
    ],
  },
  {
    title: 'Cybersecurity',
    bullets: [
      'Reconstructed an incident timeline from logs: attacker identification, first and last activity, what was accessed, and which tickets were fake.',
      'Found the weaknesses behind the incident (keys that never expire, every key allowed everything, keys could reach other companies\' events, no alerts, tickets could be created without a purchase) and ranked fixes by how much harm each removes.',
      'Designed a festival-day plan (stamped tickets, a help desk for people holding fakes, scanners that work offline) and a customer-notice process that waits for confirmation and legal advice.',
      'Built a simple behavior-based alert and measured its false alarms.',
    ],
  },
] as const

const differently = [
  {
    title: 'Finish with time to spare.',
    body: 'We ran out of time before the last slide, the one with the three decisions. Next time I would set a hard timeline for the pitch, rehearse with a timer earlier, and cut earlier.',
  },
  {
    title: 'Share the work sooner.',
    body: 'I ended up carrying most of the build. A clearer split on day one, with short briefs for each teammate, would have made the hand-offs and the Q&A stronger.',
  },
  {
    title: 'Test with a stranger.',
    body: 'An early dry run with someone outside the case would have caught the jargon sooner.',
  },
] as const

const tools = [
  'Python (pandas)',
  'Excel/CSV',
  'Claude',
  'Cursor',
  'GSAP animation',
  'Playwright for browser testing',
  'HTML/CSS/JavaScript',
]

export default function PiedmontLedgerPage() {
  const clips = getDemoClips().filter((c) => c.mp4 || c.gif || c.poster)
  const screenshots = getScreenshots()

  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-50 border-b border-border">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" />
            Back to projects
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {profile.name}
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16">
        {/* Hero */}
        <section className="flex flex-col gap-6" aria-labelledby="piedmont-title">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            <Trophy className="size-3.5" />
            Honorable Mention
          </span>

          <div className="flex flex-col gap-3">
            <h1
              id="piedmont-title"
              className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            >
              The Piedmont Ledger
            </h1>
            <p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
              A team investigation of a simulated ticketing-system breach, with a
              tested alert and a six-week plan
            </p>
          </div>

          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="glass rounded-xl p-4">
              <dt className="font-mono text-xs uppercase tracking-widest text-primary">
                Event
              </dt>
              <dd className="mt-1.5 leading-relaxed text-foreground">
                Microsoft × AIS GSU Data Dive, Cybersecurity track, October 27 to
                28, 2026
              </dd>
            </div>
            <div className="glass rounded-xl p-4">
              <dt className="font-mono text-xs uppercase tracking-widest text-primary">
                Team
              </dt>
              <dd className="mt-1.5 leading-relaxed text-foreground">
                Cybersecurity Team 2: Ore Ajibade, Dora Amobi, Jemima Kabamba,
                Devon Stock
              </dd>
            </div>
            <div className="glass rounded-xl p-4 sm:col-span-2">
              <dt className="font-mono text-xs uppercase tracking-widest text-primary">
                My role
              </dt>
              <dd className="mt-1.5 leading-relaxed text-foreground">
                I led the investigation, built the demo and presented it
              </dd>
            </div>
          </dl>

          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            The case was fictional and provided by the organizers.
          </p>

          {DEMO_URL ? (
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ExternalLink className="size-4" />
              Live demo
            </a>
          ) : null}
        </section>

        {/* Demo clips */}
        {clips.length > 0 ? (
          <section className="mt-16 md:mt-24" aria-labelledby="demo-heading">
            <div className="flex max-w-2xl flex-col gap-3">
              <span className="inline-flex w-fit items-center gap-2 font-mono text-xs font-medium uppercase tracking-widest text-primary">
                <span className="h-px w-6 bg-primary" />
                Demo
              </span>
              <h2
                id="demo-heading"
                className="text-balance text-2xl font-bold tracking-tight sm:text-3xl"
              >
                The demo in 90 seconds
              </h2>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {clips.map((clip, index) => (
                <DemoClip
                  key={clip.id}
                  mp4={clip.mp4}
                  gif={clip.gif}
                  poster={clip.poster}
                  caption={clip.caption}
                  priority={index === 0}
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* Story */}
        <section className="mt-16 md:mt-24" aria-labelledby="story-heading">
          <div className="flex max-w-2xl flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 font-mono text-xs font-medium uppercase tracking-widest text-primary">
              <span className="h-px w-6 bg-primary" />
              Case study
            </span>
            <h2
              id="story-heading"
              className="text-balance text-2xl font-bold tracking-tight sm:text-3xl"
            >
              The story
            </h2>
          </div>

          <div className="mt-8 flex max-w-3xl flex-col gap-10">
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold">The problem</h3>
              <p className="leading-relaxed text-muted-foreground">
                PassPoint is a ticketing company. A festival company&apos;s secret
                key (its &quot;keycard&quot;) was posted online by accident. Someone
                used it to copy customer details and create fake tickets, and
                nothing warned anyone. The organizers gave us 1,400 log lines,
                1,161 ticket records, account notes and a data dictionary (a
                fictional case). We had to explain what happened, what to fix, how
                to run the festival day safely, and how to prove the fix works, for
                Piedmont Live, whose festival was six weeks away.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold">What I found</h3>
              <ul className="flex list-disc flex-col gap-3 pl-5 text-muted-foreground">
                <li className="leading-relaxed">
                  <span className="font-medium text-foreground">
                    One stranger, 54 visits, three nights.
                  </span>{' '}
                  Only seven network addresses ever used the system. Six belonged
                  to festival companies; one belonged to nobody (185.220.101.7). It
                  used Oak Hollow&apos;s key with an automatic script, between 2
                  and 4 a.m., while Oak Hollow&apos;s own office works 9 to 6.
                </li>
                <li className="leading-relaxed">
                  <span className="font-medium text-foreground">
                    Up to 11,000 customer records and 3,000 order records copied
                  </span>{' '}
                  in 28 requests of 500, starting at 2:41:17 a.m. on Sept 11.
                </li>
                <li className="leading-relaxed">
                  <span className="font-medium text-foreground">
                    630 fake tickets
                  </span>
                  , found with a blank order field. All 630 trace back to the
                  stranger&apos;s 22 ticket requests. 525 were for Piedmont&apos;s
                  festival (84% of its tickets in that window), even though
                  Piedmont&apos;s own key was never used.
                </li>
                <li className="leading-relaxed">
                  <span className="font-medium text-foreground">
                    Four days unnoticed.
                  </span>{' '}
                  The leak was reported on Sept 15 by a ticket buyer; nothing
                  alerted PassPoint.
                </li>
                <li className="leading-relaxed">
                  <span className="font-medium text-foreground">
                    What I could not know:
                  </span>{' '}
                  whose records were copied, whether any fake ticket was sold, and
                  whether anything happened before Sept 1. I put these on the
                  slides as &quot;not known yet&quot; instead of guessing.
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold">What I recommended</h3>
              <p className="leading-relaxed text-muted-foreground">
                Four layers, each with an action and one risk: keys that open only
                their own door, trap records with an automatic cut-off, no ticket
                without a purchase, and Piedmont&apos;s own stamp on its tickets.
                Run alone on the real data, the layers stop different harms;
                together they block all 54 visits. A six-week plan, three
                decisions for Piedmont, and a draft notice to ticket buyers that is
                clearly marked as a proposal.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold">How I proved the alert works</h3>
              <ul className="flex list-disc flex-col gap-3 pl-5 text-muted-foreground">
                <li className="leading-relaxed">
                  Learned each company&apos;s normal (address, program, tasks,
                  hours) from{' '}
                  <span className="font-medium text-foreground">
                    Sept 1 to 10 only
                  </span>
                  , then judged{' '}
                  <span className="font-medium text-foreground">
                    Sept 11 to 14
                  </span>
                  , days the rule had never seen:{' '}
                  <span className="font-medium text-foreground">
                    467 visits, 54 bad ones caught, 0 false alarms, 0 missed.
                  </span>
                </li>
                <li className="leading-relaxed">
                  A simple &quot;night-time&quot; rule would have flagged The
                  Velvet Tap 52 times, because it copies its own list at 2 a.m.
                  every night. Comparing each company with its own habits avoided
                  that.
                </li>
                <li className="leading-relaxed">
                  I stated the limit: this stranger looked very different from
                  normal. A quieter one needs the other layers. One attack in 14
                  days is a first test, not a guarantee.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Screenshots */}
        {screenshots.length > 0 ? (
          <section
            className="mt-16 md:mt-24"
            aria-labelledby="screenshots-heading"
          >
            <div className="flex max-w-2xl flex-col gap-3">
              <span className="inline-flex w-fit items-center gap-2 font-mono text-xs font-medium uppercase tracking-widest text-primary">
                <span className="h-px w-6 bg-primary" />
                Evidence
              </span>
              <h2
                id="screenshots-heading"
                className="text-balance text-2xl font-bold tracking-tight sm:text-3xl"
              >
                Screenshots
              </h2>
            </div>

            <div className="mt-8 grid gap-8">
              {screenshots.map((shot) => (
                <figure key={shot.id} className="flex flex-col gap-3">
                  <div className="overflow-hidden rounded-xl border border-border bg-background/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shot.src}
                      alt={shot.alt}
                      width={1280}
                      height={720}
                      loading="lazy"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                  <figcaption className="text-sm leading-relaxed text-muted-foreground">
                    {shot.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {/* Skills */}
        <section className="mt-16 md:mt-24" aria-labelledby="skills-heading">
          <div className="flex max-w-2xl flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 font-mono text-xs font-medium uppercase tracking-widest text-primary">
              <span className="h-px w-6 bg-primary" />
              Capabilities
            </span>
            <h2
              id="skills-heading"
              className="text-balance text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Skills this project shows
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {skillBlocks.map((block) => (
              <div key={block.title} className="glass flex flex-col gap-4 rounded-2xl p-6">
                <h3 className="text-lg font-semibold">{block.title}</h3>
                <ul className="flex list-disc flex-col gap-2.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                  {block.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Differently */}
        <section
          className="mt-16 md:mt-24"
          aria-labelledby="differently-heading"
        >
          <div className="flex max-w-2xl flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 font-mono text-xs font-medium uppercase tracking-widest text-primary">
              <span className="h-px w-6 bg-primary" />
              Reflection
            </span>
            <h2
              id="differently-heading"
              className="text-balance text-2xl font-bold tracking-tight sm:text-3xl"
            >
              What I would do differently
            </h2>
          </div>

          <ol className="mt-8 flex max-w-3xl list-decimal flex-col gap-5 pl-5">
            {differently.map((item) => (
              <li key={item.title} className="leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">{item.title}</span>{' '}
                {item.body}
              </li>
            ))}
          </ol>
        </section>

        {/* Tools */}
        <section className="mt-16 md:mt-24" aria-labelledby="tools-heading">
          <div className="flex max-w-2xl flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 font-mono text-xs font-medium uppercase tracking-widest text-primary">
              <span className="h-px w-6 bg-primary" />
              Stack
            </span>
            <h2
              id="tools-heading"
              className="text-balance text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Tools
            </h2>
          </div>

          <ul className="mt-6 flex flex-wrap gap-2">
            {tools.map((tool) => (
              <li
                key={tool}
                className="rounded-md bg-secondary px-3 py-1.5 font-mono text-xs text-muted-foreground"
              >
                {tool}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 border-t border-border pt-8 md:mt-24">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" />
            Back to all projects
          </Link>
        </div>
      </main>
    </div>
  )
}
