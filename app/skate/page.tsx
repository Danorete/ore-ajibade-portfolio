import type { Metadata, Viewport } from 'next'
import { Bowlby_One } from 'next/font/google'
import { experiences, profile, projects } from '@/lib/data'
import { SkateExperience, type Station } from '@/components/skate/skate-experience'
import { LINE, PALETTE } from '@/components/skate/tricks'

const display = Bowlby_One({ weight: '400', subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Ore Ajibade · Drop In',
  description:
    'Ore Ajibade’s portfolio as a night session at a skatepark: one trick for every role and project.',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: PALETTE.ink,
}

/** Short label for a sign: "Name: subtitle" keeps the name, "X (Y)" keeps Y. */
function signText(title: string) {
  const paren = title.match(/\(([^)]+)\)/)
  if (paren) return paren[1]
  return title.split(':')[0]
}

export default function SkatePage() {
  const roles: Omit<Station, 'trick'>[] = experiences.map((e) => ({
    kind: 'experience',
    sign: e.company,
    title: e.role,
    meta: `${e.company} · ${e.period}`,
    body: e.points[0] ?? '',
  }))

  const work: Omit<Station, 'trick'>[] = projects.map((p) => ({
    kind: 'project',
    sign: signText(p.title),
    title: p.title,
    meta: p.tags.slice(0, 3).join(' · '),
    body: p.blurb,
    award: p.award,
  }))

  const stations: Station[] = [...roles, ...work].map((s, i) => ({
    ...s,
    trick: LINE[i % LINE.length],
  }))

  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <SkateExperience
      name={profile.name}
      initials={initials}
      tagline="AI and data builder from Atlanta. Every stop in this park is a role or a project, and every one gets its own trick."
      email={profile.email}
      linkedin={profile.linkedin}
      github={profile.github}
      stations={stations}
      displayClass={display.className}
      displayFamily={display.style.fontFamily}
    />
  )
}
