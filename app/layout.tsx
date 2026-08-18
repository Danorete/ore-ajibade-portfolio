import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Ore Ajibade — AI & Data Analytics Developer',
  description:
    'Portfolio of Ore Ajibade, an AI & Data Analytics developer in Atlanta, GA. Graph RAG, Neo4j, data engineering, and intelligent AI systems. 1st Place Microsoft AI Hackathon Winner.',
  generator: 'v0.app',
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
  colorScheme: 'dark',
  themeColor: '#0b0d17',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark bg-background ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
