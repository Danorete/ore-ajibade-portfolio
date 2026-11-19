import { skillCategories } from '@/lib/data'
import { Section } from './section'

// "Microsoft Certified: Azure Fundamentals (AZ-900)" -> name + exam code
function splitCredential(text: string) {
  const match = text.match(/^(.*?)\s*\(([A-Z]{2,3}-\d{3})\)$/)
  return match ? { name: match[1], code: match[2] } : { name: text, code: null }
}

export function Skills() {
  return (
    <Section
      id="skills"
      index="03"
      label="Skills"
      title="Tools, methods & credentials"
      intro="Grouped by the kind of work they support, with credentials listed separately."
    >
      <dl className="border-b border-border">
        {skillCategories.map((c) => {
          const isCerts = c.name === 'Certifications'
          return (
            <div
              key={c.name}
              className="grid gap-3 border-t border-border py-6 first:border-t-foreground md:grid-cols-[11rem_1fr] md:gap-8"
            >
              <dt>
                <span className="eyebrow block !text-foreground">{c.name}</span>
                <span className="numeric mt-1 block font-mono text-xs text-muted-foreground">
                  {String(c.skills.length).padStart(2, '0')} items
                </span>
              </dt>
              <dd>
                {isCerts ? (
                  <ul className="space-y-2">
                    {c.skills.map((s) => {
                      const { name, code } = splitCredential(s)
                      return (
                        <li
                          key={s}
                          className="flex flex-wrap items-baseline gap-x-3 text-[0.95rem]"
                        >
                          <span>{name}</span>
                          {code && (
                            <span className="numeric font-mono text-xs font-medium text-primary">
                              {code}
                            </span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <ul className="gap-x-6 text-[0.95rem] leading-snug sm:columns-2 xl:columns-3">
                    {c.skills.map((s) => (
                      <li key={s} className="break-inside-avoid py-1">
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          )
        })}
      </dl>
    </Section>
  )
}
