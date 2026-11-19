import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { projects, type Project } from '@/lib/data'
import { getCardThumbnail } from '@/lib/piedmont-media'
import { cn } from '@/lib/utils'
import { DemoClip } from './demo-clip'
import { Section } from './section'
import { YouTubeClip } from './youtube-clip'

export function Projects() {
  const piedmontThumb = getCardThumbnail()

  return (
    <Section
      id="projects"
      index="02"
      label="Projects"
      title="Selected work"
      intro="Case summaries with the outcome first. Placements are marked."
    >
      <ol className="space-y-16 md:space-y-20">
        {projects.map((p, i) => (
          <li key={p.title}>
            <CaseSummary
              project={p}
              index={String(i + 1).padStart(2, '0')}
              thumbnail={
                p.title === 'The Piedmont Ledger' ? piedmontThumb : p.thumbnail
              }
            />
          </li>
        ))}
      </ol>
    </Section>
  )
}

function CaseSummary({
  project: p,
  index,
  thumbnail,
}: {
  project: Project
  index: string
  thumbnail?: string | null
}) {
  // Placed or won: media runs full width above the text. Others sit beside it.
  const featured = Boolean(p.award)
  const hasMedia = Boolean(p.youtube || p.video || thumbnail)

  return (
    <article aria-labelledby={`project-${index}`} className="border-t border-foreground pt-5">
      <header className="flex items-baseline justify-between gap-4">
        <p className="eyebrow numeric">{index}</p>
        {p.award && (
          <p className="eyebrow !text-foreground">{p.award}</p>
        )}
      </header>

      <h3
        id={`project-${index}`}
        className="mt-3 max-w-3xl font-display text-2xl font-medium leading-tight tracking-[-0.015em] sm:text-3xl"
      >
        {p.title}
      </h3>

      <div
        className={cn(
          'mt-6',
          hasMedia && !featured && 'lg:grid lg:grid-cols-12 lg:gap-x-8',
        )}
      >
        {hasMedia && (
          <div className={cn(featured ? 'mb-8' : 'mb-8 lg:col-span-6 lg:mb-0')}>
            <Media project={p} thumbnail={thumbnail} />
          </div>
        )}

        <div className={cn(hasMedia && !featured && 'lg:col-span-6')}>
          <p className="eyebrow mb-2">Summary</p>
          <p className="max-w-2xl text-[0.95rem] leading-relaxed">{p.blurb}</p>

          <dl className="numeric mt-6 grid grid-cols-3 gap-x-4 border-t border-border pt-4">
            {p.highlights.map((h) => (
              <div key={h.label} className="flex flex-col">
                <dt className="order-2 mt-1 text-xs leading-snug text-muted-foreground">
                  {h.label}
                </dt>
                <dd className="order-1 font-mono text-xl tracking-tight sm:text-2xl">
                  {h.metric}
                </dd>
              </div>
            ))}
          </dl>

          {(p.architecture || p.validated) && (
            <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm leading-relaxed">
              {p.architecture && (
                <div>
                  <dt className="eyebrow mb-1">Architecture</dt>
                  <dd>{p.architecture}</dd>
                </div>
              )}
              {p.validated && (
                <div>
                  <dt className="eyebrow mb-1">Validated</dt>
                  <dd>{p.validated}</dd>
                </div>
              )}
            </dl>
          )}

          <p className="mt-5 font-mono text-xs leading-relaxed text-muted-foreground">
            <span className="eyebrow mr-2">Stack</span>
            {p.tags.join(', ')}
          </p>

          <ProjectLinks project={p} />
        </div>
      </div>
    </article>
  )
}

function Media({
  project: p,
  thumbnail,
}: {
  project: Project
  thumbnail?: string | null
}) {
  if (p.youtube) {
    return (
      <div className="overflow-hidden border border-border">
        <YouTubeClip
          id={p.youtube.id}
          title={p.youtube.title}
          poster={p.youtube.poster}
        />
      </div>
    )
  }
  if (p.video) {
    return (
      <DemoClip
        mp4={p.video.mp4}
        gif={null}
        poster={p.video.poster}
        caption={p.video.caption}
      />
    )
  }
  if (thumbnail) {
    return (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail}
          alt={p.thumbnailAlt ?? p.title}
          width={1280}
          height={720}
          loading="lazy"
          className="aspect-video w-full border border-border object-cover object-top"
        />
      </figure>
    )
  }
  return null
}

function ProjectLinks({ project: p }: { project: Project }) {
  const linkClass =
    'text-link inline-flex min-h-11 items-center gap-1 text-sm font-medium'
  const external = { target: '_blank', rel: 'noopener noreferrer' } as const

  if (!p.detailHref && !p.liveUrl && !p.repoUrl && !p.proofUrl && !p.repoNote) return null

  return (
    <ul className="mt-2 flex flex-wrap gap-x-6">
      {p.detailHref && (
        <li>
          <Link href={p.detailHref} className={linkClass}>
            Case study
            <ArrowUpRight aria-hidden className="size-3.5" />
          </Link>
        </li>
      )}
      {p.liveUrl && (
        <li>
          <a href={p.liveUrl} {...external} className={linkClass}>
            Live demo
            <ArrowUpRight aria-hidden className="size-3.5" />
          </a>
        </li>
      )}
      {p.proofUrl && (
        <li>
          <a href={p.proofUrl.href} {...external} className={linkClass}>
            {p.proofUrl.label}
            <ArrowUpRight aria-hidden className="size-3.5" />
          </a>
        </li>
      )}
      {p.repoUrl && (
        <li>
          <a href={p.repoUrl} {...external} className={linkClass}>
            Code
            <ArrowUpRight aria-hidden className="size-3.5" />
          </a>
        </li>
      )}
      {p.repoNote && !p.repoUrl && (
        <li className="inline-flex min-h-11 items-center text-sm text-muted-foreground">
          Code: {p.repoNote.toLowerCase()}
        </li>
      )}
    </ul>
  )
}
