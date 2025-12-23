import { ImageResponse } from 'next/og'

export const alt = 'AI Brand Track - Monitor Your Brand Visibility Across AI Platforms'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 20 }}>
          AI Brand Track
        </div>
        <div style={{ fontSize: 36, color: '#e0f2fe', textAlign: 'center', maxWidth: '1000px' }}>
          Monitor Your Brand Visibility Across AI Platforms
        </div>
        <div style={{ fontSize: 24, color: '#bae6fd', marginTop: 20 }}>
          ChatGPT • Claude • Perplexity • Gemini
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

