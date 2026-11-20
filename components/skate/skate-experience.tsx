'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import 'lenis/dist/lenis.css'
import { INTRO, OUTRO, SPACING, PALETTE, type SceneStation, type StationKind, type Trick } from './tricks'

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
  displayClass: string
  displayFamily: string
}

export function SkateExperience({
  name, initials, tagline, email, linkedin, github,
  stations, displayClass, displayFamily,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(-1)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const firstProject = stations.findIndex((item) => item.kind === 'project')
  const total = INTRO + stations.length * SPACING + OUTRO
  const outro = active >= stations.length

  const jumpTo = useCallback((index: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const distance = index < 0 ? 0 : index >= stations.length ? total : INTRO + (index + 0.5) * SPACING
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: Math.round((distance / total) * maxScroll), behavior: reduced ? 'instant' : 'smooth' })
  }, [stations.length, total])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false
    let cleanup = () => {}
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const getProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    const fontReady = document.fonts.load(`64px ${displayFamily}`).catch(() => null)
    Promise.all([import('./scene'), reduced ? null : import('lenis'), fontReady]).then(
      ([{ createSkateScene }, lenisModule]) => {
        if (cancelled) return
        const sceneStations: SceneStation[] = stations.map(({ kind, sign, trick }) => ({ kind, sign, trick }))
        const scene = createSkateScene(canvas, sceneStations, {
          reducedMotion: reduced,
          displayFont: displayFamily,
          initials,
          getProgress,
          onStation: setActive,
          onProgress: (progress) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
          },
        })
        if (!scene) { setFailed(true); return }
        const lenis = lenisModule ? new lenisModule.default({ autoRaf: true }) : null
        setReady(true)
        cleanup = () => { lenis?.destroy(); scene.dispose() }
      },
      () => !cancelled && setFailed(true),
    )
    return () => { cancelled = true; cleanup() }
  }, [stations, displayFamily, initials])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (event.target instanceof HTMLElement &&
        ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(event.target.tagName)) return
      if (event.key === 'ArrowRight') { event.preventDefault(); jumpTo(Math.min(stations.length, active < 0 ? 0 : active + 1)) }
      if (event.key === 'ArrowLeft') { event.preventDefault(); jumpTo(Math.max(-1, active - 1)) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, jumpTo, stations.length])

  const pill = 'inline-flex min-h-11 items-center justify-center rounded-full border border-[#bcf779]/40 bg-[#09140f]/80 px-4 font-mono text-[0.67rem] font-bold uppercase tracking-[0.15em] text-[#ebf7e8] backdrop-blur-md transition hover:border-[#c3ff72] hover:bg-[#254d27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c3ff72]'

  return (
    <div
      className="relative text-[#f1f5e9] selection:bg-[#bafb68] selection:text-[#0a130c]"
      style={{
        '--sk-ink': PALETTE.ink, '--sk-bark': PALETTE.bark,
        '--sk-moss': PALETTE.moss, '--sk-sage': PALETTE.sage,
        '--sk-cream': PALETTE.cream,
        background: PALETTE.ink,
      } as React.CSSProperties}
    >
      <canvas ref={canvasRef} aria-hidden className={`pointer-events-none fixed inset-0 h-full w-full transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`} />
      {/* Editorial grain and edge vignette stay above the park but below the UI. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_55%_54%,transparent_26%,rgba(2,8,5,.42)_100%)]" />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] opacity-[0.12] [background-image:radial-gradient(#cdfd9d_0.65px,transparent_0.65px)] [background-size:8px_8px]" />

      {!ready && !failed && <p role="status" className="fixed inset-x-0 top-1/2 z-10 text-center font-mono text-xs uppercase tracking-[0.3em] text-[#c3ff72]">Lighting the park…</p>}

      <header className="fixed inset-x-0 top-0 z-30 flex min-h-[80px] items-center justify-between gap-4 border-b border-white/10 bg-gradient-to-b from-[#050a08]/95 to-[#050a08]/10 px-4 py-3 md:px-10">
        <div className="flex items-center gap-3">
          <span className={`${displayClass} text-2xl tracking-[-.05em] text-[#c3ff72]`}>{initials}</span>
          <span className="hidden border-l border-[#c3ff72]/40 pl-3 font-mono text-[.62rem] uppercase leading-relaxed tracking-[.18em] text-[#d8ebd1] sm:block">After Hours<br />Atlanta / GA</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-4 hidden items-center gap-2 font-mono text-[.65rem] uppercase tracking-[.15em] text-[#cde9bb] lg:inline-flex"><span className="h-2 w-2 animate-pulse rounded-full bg-[#c3ff72] motion-reduce:animate-none" /> Live session · 16-trick run</span>
          <Link href="/" className={pill}>Classic portfolio <span aria-hidden className="ml-2">↗</span></Link>
        </div>
      </header>

      <main id="main">
        <h1 className="sr-only">{name}: AI, data and creative development, told through a night skatepark</h1>
        <div className={failed ? 'relative z-10 mx-auto max-w-3xl px-5 pt-28 pb-20' : 'sr-only'}>
          {failed && <p className="mb-6 text-[#c3ff72]">3D couldn&apos;t start in this browser. Here&apos;s the complete project and experience list.</p>}
          <ol className="space-y-6">
            {stations.map((s, i) => (
              <li key={`${s.title}-${i}`}>
                <p className="font-mono text-xs uppercase tracking-widest text-[#c3ff72]">{s.kind}{s.award ? ` · ${s.award}` : ''}</p>
                <h2 className="mt-1 text-lg font-semibold">{s.title}</h2>
                <p className="text-sm text-[#d8e9d2]">{s.meta}</p>
                <p className="mt-1 text-sm leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        {!failed && <>
          <Panel visible={active === -1} className="left-4 right-4 top-[17%] sm:left-[6%] sm:right-auto sm:top-[22%] sm:max-w-[560px]">
            <p className="font-mono text-[.65rem] font-bold uppercase tracking-[.3em] text-[#c3ff72]">001 / A portfolio in motion / Atlanta</p>
            <p className={`${displayClass} mt-5 max-w-[12ch] text-[clamp(3.4rem,9vw,8rem)] uppercase leading-[.82] tracking-[-.065em]`}>
              {name.split(' ')[0]}<br /><span className="text-[#c3ff72]">AFTER</span><br />HOURS<span className="text-[#c3ff72]">.</span>
            </p>
            <p className="mt-6 max-w-sm border-l-2 border-[#c3ff72] pl-4 text-sm leading-relaxed text-[#e5efe0] sm:text-base">{tagline}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" className={`${pill} border-[#c3ff72] bg-[#c3ff72] text-[#08120a]! hover:bg-[#dcffac]`} onClick={() => jumpTo(0)}>Drop in <span aria-hidden className="ml-3">↓</span></button>
              {firstProject >= 0 && <button type="button" className={pill} onClick={() => jumpTo(firstProject)}>Jump to projects</button>}
            </div>
            <p className="mt-5 font-mono text-[.63rem] uppercase tracking-[.18em] text-[#d3e8d0]">Scroll or swipe to ride · Tap a stop to jump</p>
          </Panel>

          {stations.map((s, i) => (
            <Panel key={`${s.title}-${i}`} visible={active === i} decorative className="bottom-[5.5rem] left-4 right-4 sm:bottom-10 sm:left-8 sm:right-auto sm:w-[min(440px,46vw)]">
              <article className="overflow-hidden rounded-2xl border border-[#c3ff72]/50 bg-[#07130fee] shadow-[0_24px_100px_rgba(0,0,0,.55),0_0_0_1px_rgba(255,255,255,.05)] backdrop-blur-xl">
                <div className="flex items-center justify-between gap-2 border-b border-[#c3ff72]/25 px-4 py-3 font-mono text-[.65rem] uppercase tracking-[.16em] text-[#c3ff72]">
                  <span>{String(i + 1).padStart(2, '0')} / {String(stations.length).padStart(2, '0')} — {s.kind === 'project' ? 'Selected work' : 'Experience'}</span>
                  {s.award && <span className="max-w-[45%] text-right text-[#f2efce]">★ {s.award}</span>}
                </div>
                <div className="px-5 py-5 sm:px-6 sm:py-6">
                  <p className={`${displayClass} text-[clamp(1.45rem,3vw,2.3rem)] uppercase leading-[1.03] tracking-[-.035em]`}>{s.title}</p>
                  <p className="mt-3 font-mono text-[.67rem] uppercase tracking-[.11em] text-[#c3ff72]">{s.meta}</p>
                  <p className="mt-4 line-clamp-3 text-sm leading-[1.65] text-[#e3ede0] sm:line-clamp-4">{s.body}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#c3ff72]/20 bg-[#102117] px-5 py-3 font-mono text-[.65rem] uppercase tracking-[.1em] sm:px-6">
                  <span className="rounded bg-[#c3ff72] px-2 py-1 font-bold text-[#09140c]">{s.trick.family}</span>
                  <span className="font-bold text-[#e9f3e1]">{s.trick.name}</span>
                  <span className="text-[#c1d7b8]">{s.trick.spot}</span>
                </div>
              </article>
            </Panel>
          ))}

          <Panel visible={outro} className="left-5 right-5 top-[22%] text-center">
            <p className="font-mono text-[.66rem] uppercase tracking-[.35em] text-[#c3ff72]">Session complete / {stations.length} stops</p>
            <p className={`${displayClass} mt-4 text-[clamp(3rem,9vw,7rem)] uppercase leading-[.84] tracking-[-.055em]`}>WHAT&apos;S<br /><span className="text-[#c3ff72]">NEXT?</span></p>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[#e7f1e1]">AI, data, creative engineering. Reach out to build something worth riding for.</p>
            <div className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-3">
              <a className={pill} href={`mailto:${email}`}>Email ↗</a>
              <a className={pill} href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              <a className={pill} href={github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
              <button type="button" className={pill} onClick={() => jumpTo(-1)}>Ride again ↑</button>
            </div>
          </Panel>

          {/* Fixed station selector: interactive and keyboard accessible, not just decorative dots. */}
          <nav aria-label="Skate session stops" className="fixed right-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-0.5 lg:flex">
            {stations.map((s, i) => (
              <button key={`${s.title}-${i}`} type="button" onClick={() => jumpTo(i)}
                className="group flex min-h-[29px] items-center gap-2 rounded-full px-2 text-right focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c3ff72]"
                aria-label={`Go to stop ${i + 1}: ${s.title}`} aria-current={active === i ? 'step' : undefined}>
                <span className={`max-w-0 overflow-hidden whitespace-nowrap rounded bg-[#07130f]/95 px-0 font-mono text-[.58rem] uppercase tracking-[.06em] text-[#e2f1d6] transition-all group-hover:max-w-[240px] group-hover:px-2 group-focus-visible:max-w-[240px] group-focus-visible:px-2 ${active === i ? '!max-w-[240px] !px-2' : ''}`}>{s.sign}</span>
                <span aria-hidden className={`h-2.5 w-2.5 rounded-full border transition-all ${active === i ? 'scale-125 border-[#c3ff72] bg-[#c3ff72] shadow-[0_0_12px_#c3ff72]' : 'border-[#b7d7a7]/65 bg-[#10251b] group-hover:border-[#c3ff72]'}`} />
              </button>
            ))}
          </nav>
          <div className="fixed bottom-0 inset-x-0 z-30 h-1.5 bg-[#142218]" aria-hidden><div ref={barRef} className="h-full origin-left scale-x-0 bg-[#c3ff72]" /></div>
          <div aria-hidden className="pointer-events-none fixed bottom-4 right-4 z-10 hidden font-mono text-[.65rem] uppercase tracking-[.16em] text-[#d0e3c9] sm:block">{active < 0 ? 'Drop in' : outro ? 'Line complete' : `${String(active + 1).padStart(2, '0')} / ${String(stations.length).padStart(2, '0')}`} ·  ATL / 303</div>
          <div aria-hidden style={{ height: `${(stations.length + 2) * 100}svh` }} />
        </>}
      </main>
    </div>
  )
}

function Panel({ visible, decorative = false, className, children }: { visible: boolean, decorative?: boolean, className: string, children: React.ReactNode }) {
  return <div aria-hidden={decorative || !visible} inert={!visible}
    className={`fixed z-10 transition-opacity duration-500 motion-reduce:transition-none ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'} ${className}`}>{children}</div>
}
