import { hobbies } from '@/lib/data'
import { Section } from './section'

export function Hobbies() {
  return (
    <Section
      id="hobbies"
      index="05"
      label="Off the clock"
      title="Off the clock"
      intro="What keeps me curious and balanced outside of work."
    >
      <dl className="grid gap-x-10 border-t border-border sm:grid-cols-2">
        {hobbies.map((h) => (
          <div key={h.name} className="border-b border-border py-4">
            <dt className="font-medium">{h.name}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {h.blurb}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
