import { ImageResponse } from 'next/og';
import client from '@/tina/__generated__/client';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: { urlSegments: string[] };
}) {
  const filepath = params.urlSegments.join('/');

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
