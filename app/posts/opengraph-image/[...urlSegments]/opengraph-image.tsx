import { ImageResponse } from 'next/og'
import { client } from '@/tina/__generated__/client'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = {
  params: { slug: string[] }
}

export default async function Image({ params }: Props) {
  const relativePath = `${params.slug.join('/')}.mdx`
  const data = await client.queries.post({ relativePath })
  const post = data.data.post

  const title = post.title ?? 'Post'
  const author = post.author?.name ?? ''
  const date = post.date ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: 'linear-gradient(135deg,#0f172a,#020617)',
          color: 'white',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.7 }}>Your Blog</div>

        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>
          {title}
        </div>

        <div style={{ fontSize: 26, opacity: 0.8 }}>
          {author && <span>{author} • </span>}
          {date}
        </div>
      </div>
    ),
    size
  )
}
