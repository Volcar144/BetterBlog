import { ImageResponse } from 'next/og';
import client from '@/tina/__generated__/client';
import { NextRequest } from 'next/server';

// Use Node.js runtime instead of Edge for TinaCMS compatibility
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return new Response('Missing slug parameter', { status: 400 });
    }

    const data = await client.queries.post({
      relativePath: `${slug}.mdx`,
    });

    const post = data.data.post;

    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0f172a',
          color: 'white',
          padding: 80,
          fontSize: 60,
          fontWeight: 700,
          alignItems: 'center',
        }}
      >
        {post.title}
      </div>,
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
