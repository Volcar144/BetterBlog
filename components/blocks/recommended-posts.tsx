'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { sectionBlockSchemaField } from '../layout/section';
import { Card, CardContent, CardHeader } from '../ui/card';
import { ArrowRight } from 'lucide-react';

interface RecommendedPost {
  title?: string | null;
  excerpt?: string | null;
  image?: string | null;
  url?: string | null;
  [key: string]: unknown;
}

interface RecommendedPostsBlockData extends Record<string, unknown> {
  title?: string | null;
  description?: string | null;
  posts?: Array<RecommendedPost | null> | null;
  background?: string | null;
}

export const RecommendedPosts = ({ data }: { data: RecommendedPostsBlockData }) => {
  return (
    <Section background={data.background!}>
      <div className='mx-auto max-w-6xl px-6'>
        {data.title && (
          <div className='mb-8 text-center'>
            <h2 data-tina-field={tinaField(data, 'title')} className='text-3xl font-bold'>
              {data.title}
            </h2>
            {data.description && (
              <p data-tina-field={tinaField(data, 'description')} className='mt-4 text-lg text-muted-foreground'>
                {data.description}
              </p>
            )}
          </div>
        )}

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {data.posts &&
            data.posts.map((post, index) => {
              if (!post) return null;
              return <RecommendedPostCard key={index} post={post} index={index} />;
            })}
        </div>
      </div>
    </Section>
  );
};

const RecommendedPostCard = ({ post, index }: { post: RecommendedPost; index: number }) => {
  if (!post.url) return null;

  return (
    <Link href={post.url} className='group'>
      <Card className='h-full overflow-hidden hover:shadow-lg transition-shadow'>
        {post.image && (
          <div className='relative h-48 w-full overflow-hidden'>
            <Image
              data-tina-field={tinaField(post, 'image')}
              src={post.image}
              alt={post.title || ''}
              fill
              className='object-cover group-hover:scale-105 transition-transform duration-300'
            />
          </div>
        )}
        <CardHeader>
          <h3 data-tina-field={tinaField(post, 'title')} className='text-xl font-semibold group-hover:text-primary transition-colors'>
            {post.title || 'Untitled Post'}
          </h3>
        </CardHeader>
        <CardContent>
          {post.excerpt && (
            <p data-tina-field={tinaField(post, 'excerpt')} className='text-muted-foreground line-clamp-3'>
              {post.excerpt}
            </p>
          )}
          <div className='mt-4 flex items-center text-primary font-medium'>
            Read more
            <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const defaultPost: RecommendedPost = {
  title: 'Recommended Post',
  excerpt: 'A brief description of this recommended post.',
  image: '/uploads/placeholder.jpg',
  url: '/posts/example',
};

export const recommendedPostsBlockSchema: Template = {
  name: 'recommendedPosts',
  label: 'Recommended Posts',
  ui: {
    previewSrc: '/blocks/recommended-posts.png',
    defaultItem: {
      title: 'Recommended Reading',
      description: 'Check out these related articles',
      posts: [defaultPost, defaultPost, defaultPost],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: 'string',
      label: 'Title',
      name: 'title',
    },
    {
      type: 'string',
      label: 'Description',
      name: 'description',
    },
    {
      type: 'object',
      label: 'Posts',
      name: 'posts',
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item?.title || 'Recommended Post',
          };
        },
        defaultItem: {
          ...defaultPost,
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Title',
          name: 'title',
        },
        {
          type: 'string',
          label: 'Excerpt',
          name: 'excerpt',
          ui: {
            component: 'textarea',
          },
        },
        {
          type: 'image',
          label: 'Image',
          name: 'image',
        },
        {
          type: 'string',
          label: 'URL',
          name: 'url',
        },
      ],
    },
  ],
};
