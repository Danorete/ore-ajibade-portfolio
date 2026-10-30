'use client'

import { useEffect, useRef, useState } from 'react'

type DemoClipProps = {
  mp4: string | null
  gif: string | null
  poster: string | null
  caption: string
  width?: number
  height?: number
  priority?: boolean
}

export function DemoClip({
  mp4,
  gif,
  poster,
  caption,
  width = 1280,
  height = 720,
  priority = false,
}: DemoClipProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showControls, setShowControls] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !mp4 || reducedMotion) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.45, rootMargin: '0px' },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [mp4, reducedMotion])

  if (!mp4 && !gif && !poster) return null

  return (
    <figure className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl border border-border bg-background/40">
        {mp4 ? (
          <video
            ref={videoRef}
            className="aspect-video h-auto w-full bg-black object-contain"
            width={width}
            height={height}
            muted
            loop
            playsInline
            preload={priority ? 'metadata' : 'metadata'}
            poster={poster ?? undefined}
            controls={showControls || reducedMotion}
            onClick={() => setShowControls(true)}
            aria-label={caption}
          >
            <source src={mp4} type="video/mp4" />
            {gif ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={gif}
                alt={caption}
                width={width}
                height={height}
                loading={priority ? 'eager' : 'lazy'}
              />
            ) : null}
          </video>
        ) : gif ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gif}
            alt={caption}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            className="aspect-video h-auto w-full object-contain"
          />
        ) : poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt={caption}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            className="aspect-video h-auto w-full object-contain"
          />
        ) : null}
      </div>
      <figcaption className="text-sm leading-relaxed text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  )
}
