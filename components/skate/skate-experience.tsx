'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import 'lenis/dist/lenis.css'
import { PALETTE, type SceneStation, type StationKind, type TrickName } from './tricks'

export type Station = {
  kind: StationKind
  sign: string
  trick: TrickName
  title: string
  meta: string
  body: string
  award?: string
}

type Props = {
  name: string
  tagline: string
  email: string
  linkedin: string
  github: string
  stations: Station[]
}

export function SkateExperience({ name, tagline, email, linkedin, github, stations }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(-1) // -1 intro, stations.length outro
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

    Promise.all([import('./scene'), reduced ? null : import('lenis')]).then(
      ([{ createSkateScene }, lenisModule]) => {
        if (cancelled) return
        const sceneStations: SceneStation[] = stations.map(({ kind, sign, trick }) => ({
          kind,
          sign,
          trick,
        }))
        const scene = createSkateScene(canvas, sceneStations, {
          reducedMotion: reduced,
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
  }, [stations])

  const count = (kind: StationKind) => stations.filter((s) => s.kind === kind).length
  const outro = active >= stations.length

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

      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] sm:px-6">
        <span className="font-semibold">{name}</span>
        <nav aria-label="Skate page" className="flex items-center gap-1">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center px-2 underline-offset-4 hover:text-[var(--sk-sage)] hover:underline"
          >
            Classic site
          </Link>
          <span aria-hidden className="text-[var(--sk-sage)]">/</span>
          <a
            href={`mailto:${email}`}
            className="inline-flex min-h-11 items-center px-2 underline-offset-4 hover:text-[var(--sk-sage)] hover:underline"
          >
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
              Your browser could not start the 3D rink, so here is the same content as a list.
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
            <Panel visible={active < 0} className="inset-x-0 top-[16%] px-4 text-center sm:top-[14%]">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--sk-sage)]">
                Portfolio / 2026
              </p>
              <p className="mt-3 text-[clamp(3rem,11vw,8.5rem)] font-black leading-[0.86] tracking-[-0.04em] uppercase">
                {name}
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed opacity-90 sm:text-base">
                {tagline}
              </p>
              <p className="mt-10 animate-pulse font-mono text-xs uppercase tracking-[0.3em]">
                Scroll to drop in
              </p>
            </Panel>

            {/* One card per station */}
            {stations.map((s, i) => {
              const n = stations.slice(0, i + 1).filter((x) => x.kind === s.kind).length
              return (
                <Panel
                  key={s.title}
                  visible={active === i}
                  decorative
                  className="bottom-8 left-4 right-4 sm:right-auto sm:bottom-12 sm:left-6 sm:max-w-md"
                >
                  <div className="border-l-4 border-[var(--sk-moss)] bg-[color-mix(in_srgb,var(--sk-ink)_82%,transparent)] p-5 backdrop-blur-sm">
                    <p className="flex flex-wrap justify-between gap-x-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--sk-sage)]">
                      <span>
                        {s.kind} {String(n).padStart(2, '0')} / {String(count(s.kind)).padStart(2, '0')}
                      </span>
                      <span>Trick: {s.trick}</span>
                    </p>
                    <p className="mt-3 text-2xl leading-tight font-extrabold tracking-tight sm:text-3xl">
                      {s.title}
                    </p>
                    <p className="mt-1 font-mono text-xs opacity-80">
                      {s.meta}
                      {s.award ? ` · ${s.award}` : ''}
                    </p>
                    <p className="mt-3 line-clamp-4 text-sm leading-relaxed opacity-90">{s.body}</p>
                  </div>
                </Panel>
              )
            })}

            {/* Outro */}
            <Panel visible={outro} className="inset-x-0 top-1/2 -translate-y-1/2 px-4 text-center">
              <p className="text-[clamp(2.4rem,8vw,6rem)] font-black leading-[0.9] tracking-[-0.03em] uppercase">
                Let&apos;s talk
              </p>
              <p className="mt-3 text-sm opacity-90">Internships, AI and data roles, or a skate session.</p>
              <ul className="mt-6 flex flex-wrap justify-center gap-x-6 font-mono text-xs uppercase tracking-[0.18em]">
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
                      className="inline-flex min-h-11 items-center underline-offset-4 hover:text-[var(--sk-sage)] hover:underline"
                    >
                      &gt; {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Panel>

            {/* Progress */}
            <div aria-hidden className="fixed inset-x-0 bottom-0 z-20 h-1 bg-[color-mix(in_srgb,var(--sk-cream)_12%,transparent)]">
              <div ref={barRef} className="h-full origin-left scale-x-0 bg-[var(--sk-moss)]" />
            </div>

            {/* Scroll length: one screen per stop, plus the intro and outro. */}
            <div aria-hidden style={{ height: `${(stations.length + 2) * 100}svh` }} />
          </>
        )}
      </main>
    </div>
  )
}

/** A fixed overlay that fades in when its stop is the nearest one. Hidden ones are inert. */
function Panel({
  visible,
  decorative = false,
  className,
  children,
}: {
  visible: boolean
  /** Station cards repeat the screen-reader list, so assistive tech skips them. */
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
