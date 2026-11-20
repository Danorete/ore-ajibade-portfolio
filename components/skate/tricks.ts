// Shared by the server page and the 3D scene. No three.js import here, so the
// server bundle stays light.

export const TRICKS = [
  'Ollie',
  'Kickflip',
  'Pop Shove-it',
  'Heelflip',
  '360 Flip',
  'Varial Kickflip',
  'Frontside 180',
] as const

export type TrickName = (typeof TRICKS)[number]

export type StationKind = 'experience' | 'project'

/** What the 3D scene needs for each stop on the rink. */
export type SceneStation = {
  kind: StationKind
  /** Short text painted on the sign beside the obstacle. */
  sign: string
  trick: TrickName
}

/** World units between two stations. One station per screen of scroll. */
export const SPACING = 16

/** Earth tones: black, brown, green, plus a cream for text. */
export const PALETTE = {
  ink: '#0d0b08',
  soil: '#1a140e',
  bark: '#4a3423',
  wood: '#8a5a36',
  plank: '#6f4728',
  moss: '#5d7b3a',
  sage: '#a9bf86',
  cream: '#efe7d6',
} as const
