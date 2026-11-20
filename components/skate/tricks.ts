// Shared by the server page and the 3D scene. No three.js import here, so the
// server bundle stays light.

/** Obstacles on the course, modelled on a street plaza: gap, ledge, flat bar, stairs, manual pad, pyramid. */
export type FeatureKind = 'gap' | 'ledge' | 'rail' | 'stairs' | 'manual' | 'pyramid'

/** Trick families, the way skate judges group them. */
export type TrickFamily = 'Flip' | 'Grind' | 'Slide' | 'Manual' | 'Spin'

export type Trick = {
  name: string
  family: TrickFamily
  feature: FeatureKind
  /** Where the trick happens, for the card: "down the 5-stair". */
  spot: string
}

const SPOT: Record<FeatureKind, string> = {
  gap: 'over the gap',
  ledge: 'on the ledge',
  rail: 'on the flat bar',
  stairs: 'down the 5-stair',
  manual: 'across the manual pad',
  pyramid: 'over the pyramid',
}

const t = (name: string, family: TrickFamily, feature: FeatureKind): Trick => ({
  name,
  family,
  feature,
  spot: SPOT[feature],
})

/**
 * The run, one trick per stop, in order. It mixes every family and never
 * repeats an obstacle back to back. Stop 8 is the Agent-A-Thon win, so it
 * gets the 360 flip down the stairs. If there are more stops than tricks,
 * the line starts over.
 */
export const LINE: Trick[] = [
  t('Kickflip', 'Flip', 'gap'),
  t('50-50 Grind', 'Grind', 'ledge'),
  t('Boardslide', 'Slide', 'rail'),
  t('Varial Kickflip', 'Flip', 'stairs'),
  t('Manual', 'Manual', 'manual'),
  t('Frontside 360', 'Spin', 'pyramid'),
  t('Heelflip', 'Flip', 'gap'),
  t('360 Flip', 'Flip', 'stairs'),
  t('5-0 Grind', 'Grind', 'ledge'),
  t('Lipslide', 'Slide', 'rail'),
  t('Nose Manual', 'Manual', 'manual'),
  t('Pop Shove-it', 'Flip', 'pyramid'),
  t('Hardflip', 'Flip', 'gap'),
  t('Crooked Grind', 'Grind', 'ledge'),
  t('Feeble Grind', 'Grind', 'rail'),
  t('Backside 360', 'Spin', 'pyramid'),
]

export type StationKind = 'experience' | 'project'

/** What the 3D scene needs for each stop on the course. */
export type SceneStation = {
  kind: StationKind
  /** Short text painted on the sign beside the obstacle. */
  sign: string
  trick: Trick
}

/** Course layout, in world units (about 0.4 m each). One stop per screen of scroll. */
export const SPACING = 26
export const INTRO = 14 // drop-in ramp before the first stop
export const OUTRO = 12 // roll-out after the last stop

/** Earth tones: black, brown, green, plus a cream for text. */
export const PALETTE = {
  ink: '#050b08',
  soil: '#101e14',
  bark: '#77553b',
  wood: '#93633b',
  concrete: '#515e53',
  moss: '#c3ff72',
  leaf: '#183c2d',
  sage: '#d7f5c0',
  cream: '#f3f5ed',
} as const
