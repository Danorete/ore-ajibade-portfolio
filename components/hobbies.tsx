import {
  Camera,
  Clapperboard,
  Dumbbell,
  Gamepad2,
  Leaf,
  NotebookPen,
  ShoppingBag,
} from 'lucide-react'
import { hobbies, type Hobby } from '@/lib/data'
import { SectionHeading } from './section-heading'
import { SkateboardIcon } from './brand-icons'

const hobbyIcons: Record<Hobby['icon'], React.ComponentType<{ className?: string }>> = {
  gaming: Gamepad2,
  anime: Clapperboard,
  thrifting: ShoppingBag,
  journaling: NotebookPen,
  photography: Camera,
  skateboarding: SkateboardIcon,
  gym: Dumbbell,
  nature: Leaf,
}

export function Hobbies() {
  return (
    <section id="hobbies" className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <SectionHeading
        eyebrow="// beyond the code"
        title="Off the Clock"
        description="The stuff that keeps me curious, balanced, and a little more interesting than my resume."
      />

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {hobbies.map((hobby, i) => {
          const Icon = hobbyIcons[hobby.icon]
          return (
            <div
              key={hobby.name}
              className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card/40 p-5 transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-card"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full bg-primary/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="flex size-11 items-center justify-center rounded-lg border border-border bg-secondary text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                <Icon className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-mono text-sm font-semibold text-foreground">
                  {hobby.name}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {hobby.blurb}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
