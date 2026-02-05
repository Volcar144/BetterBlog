import React from 'react';
import client from '@/tina/__generated__/client';
import Layout from '@/components/layout/layout';
import PostClientPage from './client-page';
import type { Metadata } from 'next';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ urlSegments: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const filepath = resolvedParams.urlSegments.join('/');

  const data = await client.queries.post({
    relativePath: `${filepath}.mdx`,
  });

  const post = data.data.post;

  const title = post.title ?? 'Post';
  const description =
    post.description ??
    post.excerpt ??
    post._body?.children?.[0]?.children?.[0]?.text ??
    '';

  const ogImage = `/${filepath}/opengraph-image`;

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ urlSegments: string[] }>;
}) {
  const resolvedParams = await params;
  const filepath = resolvedParams.urlSegments.join('/');

  const data = await client.queries.post({
    relativePath: `${filepath}.mdx`,
  });

  return (
    <Layout rawPageData={data}>
      <PostClientPage {...data} />
    </Layout>
  );
}

export async function generateStaticParams() {
  let posts = await client.queries.postConnection();
  const allPosts = posts;

  if (!allPosts.data.postConnection.edges) {
    return [];
  }

  while (posts.data?.postConnection.pageInfo.hasNextPage) {
    posts = await client.queries.postConnection({
      after: posts.data.postConnection.pageInfo.endCursor,
    });

    if (!posts.data.postConnection.edges) break;

    allPosts.data.postConnection.edges.push(...posts.data.postConnection.edges);
  }

  return (
    allPosts.data?.postConnection.edges.map((edge) => ({
      urlSegments: edge?.node?._sys.breadcrumbs,
    })) || []
  );
}
