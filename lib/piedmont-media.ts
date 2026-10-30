import { existsSync } from 'node:fs'
import path from 'node:path'

const MEDIA_DIR = path.join(process.cwd(), 'public', 'projects', 'piedmont-ledger')
const PUBLIC_BASE = '/projects/piedmont-ledger'

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'] as const

function publicUrl(filename: string) {
  return `${PUBLIC_BASE}/${filename}`
}

function firstExisting(...filenames: string[]) {
  for (const name of filenames) {
    if (existsSync(path.join(MEDIA_DIR, name))) {
      return publicUrl(name)
    }
  }
  return null
}

function imageWithExts(stem: string) {
  return firstExisting(...IMAGE_EXTS.map((ext) => `${stem}${ext}`))
}

export type DemoClipMedia = {
  id: string
  caption: string
  mp4: string | null
  gif: string | null
  poster: string | null
}

export const DEMO_CLIP_CAPTIONS = {
  hack: 'The stolen key reaches PassPoint. 11,000 people\'s details are copied, then 630 fake tickets are made.',
  timeline:
    'Three nights, 54 visits, four days unnoticed. An alert on the first visit would have capped the loss at 500 details.',
  layers: 'Four layers, run on the real visits. Together they block all 54.',
  alert:
    'An alert Piedmont can act on: cut off the key, stop the fake tickets, then a test on days the rule had never seen.',
  gate: 'Festival morning. Today\'s check lets the fakes in. With Piedmont\'s stamp they are refused and sent to a help desk.',
} as const

export type DemoClipId = keyof typeof DEMO_CLIP_CAPTIONS

export function getDemoClips(): DemoClipMedia[] {
  return (Object.keys(DEMO_CLIP_CAPTIONS) as DemoClipId[]).map((id) => {
    const mp4 = firstExisting(`${id}.mp4`)
    const gif = firstExisting(`${id}.gif`)
    const poster =
      firstExisting(`${id}-poster.jpg`, `${id}-poster.png`, `${id}-poster.webp`) ??
      (id === 'timeline' ? imageWithExts('timeline-boxes') : null) ??
      (id === 'layers' ? imageWithExts('four-layers') : null) ??
      (id === 'gate' ? imageWithExts('festival-gate') : null) ??
      gif

    return {
      id,
      caption: DEMO_CLIP_CAPTIONS[id],
      mp4,
      gif,
      poster,
    }
  })
}

export type ScreenshotMedia = {
  id: string
  src: string
  caption: string
  alt: string
}

export function getScreenshots(): ScreenshotMedia[] {
  const candidates: Omit<ScreenshotMedia, 'src'>[] = [
    {
      id: 'timeline-boxes',
      caption:
        'Timeline with labelled callout boxes separating confirmed facts from our guesses across the three nights of visits.',
      alt: 'Presentation slide showing an incident timeline with labelled callout boxes marking key events across three nights of unauthorized visits.',
    },
    {
      id: 'four-layers',
      caption:
        'Four defense layers scored against the real visits, with each counter at zero remaining attacks when run together.',
      alt: 'Presentation slide showing four security layers with counters at zero, illustrating that together they block all 54 unauthorized visits.',
    },
    {
      id: 'festival-gate',
      caption:
        'Festival gate after option B: stamped tickets pass, and fake tickets are refused and sent to a help desk.',
      alt: 'Festival gate scene after option B, where Piedmont-stamped tickets are accepted and fake tickets are refused and directed to a help desk.',
    },
  ]

  return candidates.flatMap((item) => {
    const src = imageWithExts(item.id)
    return src ? [{ ...item, src }] : []
  })
}

export function getCardThumbnail(): string | null {
  return (
    imageWithExts('timeline-boxes') ??
    firstExisting('timeline-poster.jpg', 'timeline-poster.png', 'gate-poster.jpg') ??
    firstExisting('timeline.gif', 'gate.gif')
  )
}
