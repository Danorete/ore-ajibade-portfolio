'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import 'lenis/dist/lenis.css'
import { PALETTE, type SceneStation, type StationKind, type Trick } from './tricks'

export type Station = {
  kind: StationKind
  sign: string
  trick: Trick
  title: string
  meta: string
  body: string
  award?: string
}

type Props = {
  name: string
  initials: string
  tagline: string
  email: string
  linkedin: string
  github: string
  stations: Station[]
  /** next/font class and family name for the display face. */
  displayClass: string
  displayFamily: string
}

export function SkateExperience({
  name,
  initials,
  tagline,
  email,
  linkedin,
  github,
  stations,
  displayClass,
  displayFamily,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(-1) // -1 title, -2 drop-in, stations.length outro
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false
    let cleanup = () => {}

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }

    // The signs and deck are painted with the display font, so wait for it.
    const fontReady = document.fonts.load(`64px ${displayFamily}`).catch(() => null)

    Promise.all([import('./scene'), reduced ? null : import('lenis'), fontReady]).then(
      ([{ createSkateScene }, lenisModule]) => {
        if (cancelled) return
        const sceneStations: SceneStation[] = stations.map(({ kind, sign, trick }) => ({ kind, sign, trick }))
        const scene = createSkateScene(canvas, sceneStations, {
          reducedMotion: reduced,
          displayFont: displayFamily,
          initials,
          getProgress: progress,
          onStation: setActive,
          onProgress: (p) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
          },
        })
        if (!scene) {
          setFailed(true)
          return
        }
        const lenis = lenisModule ? new lenisModule.default({ autoRaf: true }) : null
        setReady(true)
        cleanup = () => {
          lenis?.destroy()
          scene.dispose()
        }
      },
      () => !cancelled && setFailed(true),
    )

    return () => {
      cancelled = true
      cleanup()
    }
  }, [stations, displayFamily, initials])

  const outro = active >= stations.length
  const linkClass =
    'inline-flex min-h-11 items-center underline-offset-4 hover:text-[var(--sk-sage)] hover:underline'

  return (
    <div
      className="relative text-[var(--sk-cream)]"
      style={
        {
          '--sk-ink': PALETTE.ink,
          '--sk-bark': PALETTE.bark,
          '--sk-moss': PALETTE.moss,
          '--sk-sage': PALETTE.sage,
          '--sk-cream': PALETTE.cream,
          background: PALETTE.ink,
        } as React.CSSProperties
      }
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`fixed inset-0 h-full w-full transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
      {!ready && !failed && (
        <p className="fixed inset-x-0 top-1/2 z-10 text-center font-mono text-xs uppercase tracking-[0.3em] text-[var(--sk-sage)]">
          Waxing the ledges…
        </p>
      )}

      {/* Top bar, with a soft fade so it reads over the park. */}
      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-[var(--sk-ink)] to-transparent px-4 pt-3 pb-6 font-mono text-xs uppercase tracking-[0.18em] sm:px-6">
        <span className={`${displayClass} text-base tracking-normal`}>{initials}</span>
        <nav aria-label="Skate page" className="flex items-center gap-1">
          <Link href="/" className={`${linkClass} px-2`}>
            Classic site
          </Link>
          <span aria-hidden className="text-[var(--sk-sage)]">/</span>
          <a href={`mailto:${email}`} className={`${linkClass} px-2`}>
            Email
          </a>
        </nav>
      </header>

      <main id="main">
        <h1 className="sr-only">{name}: experience and projects</h1>

        {/* The full content as a plain list for screen readers and no-WebGL visitors. */}
        <div className={failed ? 'relative z-10 mx-auto max-w-2xl px-4 pt-24 pb-16' : 'sr-only'}>
          {failed && (
            <p className="mb-8 text-sm text-[var(--sk-sage)]">
              Your browser could not start the 3D park, so here is the same content as a list.
            </p>
          )}
          <ol className="space-y-6">
            {stations.map((s) => (
              <li key={s.title}>
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--sk-sage)]">
                  {s.kind}
                  {s.award ? ` · ${s.award}` : ''}
                </p>
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <p className="text-sm opacity-80">{s.meta}</p>
                <p className="mt-1 text-sm">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        {!failed && (
          <>
            {/* Intro */}
            <Panel visible={active === -1} className="inset-x-0 top-[13%] px-4 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--sk-sage)]">
                Portfolio / 2026 / Night session
              </p>
              <p
                className={`${displayClass} mt-3 text-[clamp(3rem,11vw,8rem)] leading-[0.88] uppercase`}
                style={{ textShadow: `0.06em 0.06em 0 ${PALETTE.moss}` }}
              >
                {name}
              </p>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed sm:text-base">{tagline}</p>
              <p className="mt-6 inline-block border border-[var(--sk-cream)] px-4 py-2 font-mono text-xs uppercase tracking-[0.3em]">
                Scroll to drop in
              </p>
            </Panel>

            {/* One card per stop */}
            {stations.map((s, i) => (
              <Panel
                key={s.title}
                visible={active === i}
                decorative
                className="bottom-6 left-3 right-3 sm:right-auto sm:bottom-10 sm:left-6 sm:max-w-md"
              >
                <article className="-rotate-1 border-[3px] border-[var(--sk-ink)] bg-[var(--sk-cream)] text-[var(--sk-ink)] shadow-[6px_6px_0_var(--sk-moss)]">
                  <div className="flex items-center justify-between gap-3 bg-[var(--sk-ink)] px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--sk-cream)]">
                    <span>
                      Stop {String(i + 1).padStart(2, '0')} / {String(stations.length).padStart(2, '0')} · {s.kind}
                    </span>
                    {s.award && <span className="text-[var(--sk-sage)]">{s.award}</span>}
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className={`${displayClass} text-2xl leading-[1.05] uppercase sm:text-[1.7rem]`}>
                      {s.title}
                    </p>
                    <p className="mt-1.5 font-mono text-xs text-[var(--sk-bark)]">{s.meta}</p>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed sm:line-clamp-4">{s.body}</p>
                    <p className="mt-4 flex flex-wrap items-baseline gap-x-2 border-t-2 border-dashed border-[var(--sk-ink)] pt-3 font-mono text-[0.7rem] uppercase tracking-[0.14em]">
                      <span className="bg-[var(--sk-moss)] px-1.5 py-0.5 text-[var(--sk-cream)]">{s.trick.family}</span>
                      <span className="font-semibold">{s.trick.name}</span>
                      <span className="text-[var(--sk-bark)]">{s.trick.spot}</span>
                    </p>
                  </div>
                </article>
              </Panel>
            ))}

            {/* Outro */}
            <Panel visible={outro} className="inset-x-0 top-[16%] px-4 text-center">
              <p
                className={`${displayClass} text-[clamp(2.6rem,9vw,6.5rem)] leading-[0.9] uppercase`}
                style={{ textShadow: `0.06em 0.06em 0 ${PALETTE.moss}` }}
              >
                Let&apos;s talk
              </p>
              <p className="mt-3 text-sm">
                {stations.length} stops, {stations.length} tricks. Internships, AI and data roles, or a skate session.
              </p>
              <ul className="mt-5 flex flex-wrap justify-center gap-x-6 font-mono text-xs uppercase tracking-[0.18em]">
                {[
                  { href: `mailto:${email}`, label: 'Email' },
                  { href: linkedin, label: 'LinkedIn' },
                  { href: github, label: 'GitHub' },
                  { href: '/', label: 'Classic site' },
                ].map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={linkClass}
                    >
                      &gt; {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Panel>

            {/* Progress */}
            <div aria-hidden className="fixed inset-x-0 bottom-0 z-20 h-1.5 bg-[color-mix(in_srgb,var(--sk-cream)_12%,transparent)]">
              <div ref={barRef} className="h-full origin-left scale-x-0 bg-[var(--sk-moss)]" />
            </div>

            {/* Scroll length: one screen per stop, plus the intro and outro together. */}
            <div aria-hidden style={{ height: `${(stations.length + 2) * 100}svh` }} />
          </>
        )}
      </main>
    </div>
  )
}

/** A fixed overlay that fades in when its stop is the current one. Hidden ones are inert. */
function Panel({
  visible,
  decorative = false,
  className,
  children,
}: {
  visible: boolean
  /** Stop cards repeat the screen-reader list, so assistive tech skips them. */
  decorative?: boolean
  className: string
  children: React.ReactNode
}) {
  return (
    <div
      aria-hidden={decorative || !visible}
      inert={!visible}
      className={`fixed z-10 transition-opacity duration-500 ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'} ${className}`}
    >
      {children}
    </div>
  )
}
