import React from 'react';
import { videoBlockSchema } from '@/components/blocks/video';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Collection } from 'tinacms';
import { codeExampleBlockSchema } from '@/components/blocks/code-example-cms';

const Post: Collection = {
  label: 'Blog Posts',
  name: 'post',
  path: 'content/posts',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      return `/posts/${document._sys.breadcrumbs.join('/')}`;
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Title',
      name: 'title',
      isTitle: true,
      required: true,
    },
    {
      type: 'image',
      name: 'heroImg',
      label: 'Hero Image',
      // @ts-ignore
      uploadDir: () => 'posts',
    },
    {
      type: 'rich-text',
      label: 'Excerpt',
      name: 'excerpt',
      overrides: {
        toolbar: ['bold', 'italic', 'link'],
      },
    },
    {
      type: 'reference',
      label: 'Author',
      name: 'author',
      collections: ['author'],
      ui: {
        //@ts-ignore
        optionComponent: (
          props: {
            name?: string;
            avatar: string;
          },
          _internalSys: { path: string }
        ) => {
          const { name, avatar } = props;
          if (!name) return _internalSys.path;

          return (
            <p className='flex min-h-8 items-center gap-4'>
              <Avatar>
                {avatar && <AvatarImage src={avatar} alt={`${name} Profile`} />}
                <AvatarFallback>
                  {name
                    .split(' ')
                    .map((part) => part[0]?.toUpperCase() || '')
                    .join('')}
                </AvatarFallback>
              </Avatar>
              {name}
            </p>
          );
        },
      },
    },
    {
      type: 'datetime',
      label: 'Posted Date',
      name: 'date',
      ui: {
        dateFormat: 'MMMM DD YYYY',
        timeFormat: 'hh:mm A',
      },
    },
    {
      type: 'boolean',
      label: 'Draft',
      name: 'draft',
      description: 'When enabled, this post will not be visible on the public site',
    },
    {
      type: 'object',
      label: 'Tags',
      name: 'tags',
      list: true,
      fields: [
        {
          type: 'reference',
          label: 'Tag',
          name: 'tag',
          collections: ['tag'],
          ui: {
            optionComponent: (
              props: {
                name?: string;
              },
              _internalSys: { path: string }
            ) => props.name || _internalSys.path,
          },
        },
      ],
      ui: {
        itemProps: (item) => {
          return { label: item?.tag };
        },
      },
    },
    {
      type: 'rich-text',
      label: 'Body',
      name: '_body',
      templates: [
        {
          name: 'BlockQuote',
          label: 'Block Quote',
          fields: [
            {
              name: 'children',
              label: 'Quote',
              type: 'rich-text',
              overrides: {
                toolbar: ['bold', 'italic', 'link'],
              },
            },
            {
              name: 'authorName',
              label: 'Author',
              type: 'string',
            },
          ],
        },
        {
          name: 'DateTime',
          label: 'Date & Time',
          inline: true,
          fields: [
            {
              name: 'format',
              label: 'Format',
              type: 'string',
              options: ['utc', 'iso', 'local'],
            },
          ],
        },
        {
          name: 'NewsletterSignup',
          label: 'Newsletter Sign Up',
          fields: [
            {
              name: 'children',
              label: 'CTA',
              type: 'rich-text',
            },
            {
              name: 'placeholder',
              label: 'Placeholder',
              type: 'string',
            },
            {
              name: 'buttonText',
              label: 'Button Text',
              type: 'string',
            },
            {
              name: 'disclaimer',
              label: 'Disclaimer',
              type: 'rich-text',
              overrides: {
                toolbar: ['bold', 'italic', 'link'],
              },
            },
          ],
          ui: {
            defaultItem: {
              placeholder: 'Enter your email',
              buttonText: 'Notify Me',
            },
          },
        },
        {
          name: 'RubiksCube',
          label: "Rubik's Cube",
          fields: [
            {
              name: 'title',
              label: 'Title',
              type: 'string',
            },
            {
              name: 'algorithm',
              label: 'Algorithm',
              type: 'string',
              ui: {
                component: 'textarea',
              },
            },
            {
              name: 'setupAlgorithm',
              label: 'Setup / Scramble',
              type: 'string',
              ui: {
                component: 'textarea',
              },
            },
            {
              name: 'autoplay',
              label: 'Autoplay',
              type: 'boolean',
            },
            {
              name: 'stickering',
              label: 'Default Highlighting',
              type: 'string',
              options: [
                { label: 'None', value: 'none' },
                { label: 'OLL (Last Layer)', value: 'OLL' },
                { label: 'PLL (Permutation)', value: 'PLL' },
                { label: 'Cross (Yellow)', value: 'Cross' },
                { label: 'CMLL (Roux)', value: 'CMLL' },
                { label: 'LSE (Roux)', value: 'LSE' },
              ],
            },
            {
              name: 'showControls',
              label: 'Show Playback Controls',
              type: 'boolean',
            },
          ],
          ui: {
            defaultItem: {
              title: "Rubik's Cube",
              algorithm: "R U R' U'",
              setupAlgorithm: '',
              autoplay: true,
              stickering: 'none',
              showControls: true,
            },
          },
        },
        {
          name: 'Callout',
          label: 'Callout',
          fields: [
            {
              name: 'type',
              label: 'Type',
              type: 'string',
              options: [
                { label: 'Info', value: 'info' },
                { label: 'Warning', value: 'warning' },
                { label: 'Danger', value: 'danger' },
                { label: 'Success', value: 'success' },
              ],
            },
            {
              name: 'title',
              label: 'Title',
              type: 'string',
            },
            {
              name: 'children',
              label: 'Content',
              type: 'rich-text',
              overrides: {
                toolbar: ['bold', 'italic', 'link', 'ul', 'ol'],
              },
            },
          ],
          ui: {
            defaultItem: {
              type: 'info',
              title: 'Important Note',
            },
          },
        },
        videoBlockSchema,
        codeExampleBlockSchema,
      ],
      isBody: true,
    },
  ],
};

export default Post;
