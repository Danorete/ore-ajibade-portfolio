import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ore Ajibade — AI & Data Analytics Developer',
  description:
    'Portfolio of Ore Ajibade, an AI & Data Analytics developer in Atlanta, GA. Graph RAG, Neo4j, data engineering, and intelligent AI systems. 1st Place Microsoft AI Hackathon Winner.',
  keywords: [
    'Ore Ajibade',
    'AI Developer',
    'Data Analytics',
    'Graph RAG',
    'Neo4j',
    'Data Engineering',
    'Atlanta',
  ],
  openGraph: {
    title: 'Ore Ajibade — AI & Data Analytics Developer',
    description:
      'Bridging Data Analytics, Graph RAG & Intelligent AI Systems.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f3ee' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0f11' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`bg-background ${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}
    >
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
        >
          Skip to content
        </a>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
