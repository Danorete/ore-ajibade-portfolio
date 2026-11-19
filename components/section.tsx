import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionProps = {
  id: string
  index: string
  label: string
  title: string
  intro?: string
  children: ReactNode
  className?: string
}

/**
 * Shared editorial frame: a hairline rule, a left rail with the section index
 * and title (sticky on large screens), and the content in the right 9 columns.
 */
export function Section({
  id,
  index,
  label,
  title,
  intro,
  children,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn('border-t border-border', className)}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:grid lg:grid-cols-12 lg:gap-x-10">
        <header className="lg:col-span-3">
          <div className="lg:sticky lg:top-24">
            <p className="eyebrow numeric">
              {index} / {label}
            </p>
            <h2
              id={`${id}-title`}
              className="mt-3 font-display text-3xl font-medium leading-[1.1] tracking-[-0.015em] sm:text-4xl"
            >
              {title}
            </h2>
            {intro && (
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {intro}
              </p>
            )}
          </div>
        </header>
        <div className="mt-10 lg:col-span-9 lg:mt-0">{children}</div>
      </div>
    </section>
  )
}
