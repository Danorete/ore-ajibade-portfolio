import { ImageResponse } from 'next/og'
import { profile } from '@/lib/data'

export const alt = `${profile.name}, ${profile.role}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: '#0b0d17',
          color: '#e8ebff',
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 700 }}>{profile.name}</div>
        <div style={{ fontSize: 40, marginTop: 24, color: '#9aa4ff' }}>{profile.role}</div>
        <div style={{ fontSize: 30, marginTop: 40, maxWidth: 900, color: '#b8bdd6' }}>
          {profile.headline}
        </div>
        <div style={{ fontSize: 26, marginTop: 56, color: '#7d83a3' }}>
          {profile.location}
        </div>
      </div>
    ),
    { ...size },
  )
}
