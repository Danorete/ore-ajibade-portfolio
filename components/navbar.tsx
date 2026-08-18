'use client'

import { useEffect, useState } from 'react'
import { Download, Menu, X } from 'lucide-react'
import { profile } from '@/lib/data'
import { cn } from '@/lib/utils'
import { GithubIcon, LinkedinIcon } from './brand-icons'

const links = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#resume', label: 'Resume' },
  { href: '#contact', label: 'Contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'glass shadow-lg shadow-black/20' : 'border-b border-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-foreground">
            OA
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-sm font-semibold">{profile.name}</span>
            <span className="mt-0.5 w-fit rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide text-primary">
              {profile.role}
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <GithubIcon className="size-4.5" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LinkedinIcon className="size-4.5" />
          </a>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-resume'))}
            className="ml-1 hidden items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110 sm:inline-flex"
          >
            <Download className="size-4" />
            Download Resume
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass border-t border-border lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="px-1 py-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  window.dispatchEvent(new Event('open-resume'))
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                <Download className="size-4" />
                Download Resume
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
