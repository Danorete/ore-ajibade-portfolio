'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

type YouTubeClipProps = {
  id: string
  title: string
  poster: string
}

// Shows a local poster with a play button. The YouTube player only loads
// (from the privacy-enhanced domain) after the visitor clicks play, so the
// page makes no third-party requests until then.
export function YouTubeClip({ id, title, poster }: YouTubeClipProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="overflow-hidden">
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poster}
              alt=""
              width={1280}
              height={720}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 grid place-items-center bg-black/25 transition-colors group-hover:bg-black/15">
              <span className="grid size-14 place-items-center bg-foreground text-background">
                <Play className="ml-0.5 size-6 fill-current" />
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
