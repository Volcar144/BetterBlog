import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import client from '@/tina/__generated__/client';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filepath = searchParams.get('filepath');

    if (!filepath) {
      return new Response('Missing filepath parameter', { status: 400 });
    }

    const data = await client.queries.post({
      relativePath: `${filepath}.mdx`,
    });

    const post = data.data.post;

    return new ImageResponse(
      (
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
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    return new Response('Error generating image', { status: 500 });
  }
}
