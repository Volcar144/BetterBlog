import { ImageResponse } from 'next/og';
import client from '@/tina/__generated__/client';

export const runtime = 'nodejs';

const size = {
  width: 1200,
  height: 630,
};

export async function GET(_request: Request, { params }: { params: Promise<{ urlSegments: string[] }> }) {
  const resolvedParams = await params;
  const filepath = resolvedParams.urlSegments.join('/');

  const data = await client.queries.post({
    relativePath: `${filepath}.mdx`,
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
    { ...size }
  );
}
