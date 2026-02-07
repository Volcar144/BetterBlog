'use client';
import React, { useState } from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { Section } from '../layout/section';
import { sectionBlockSchemaField } from '../layout/section';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';

interface AccordionBlockData extends Record<string, unknown> {
  title?: string | null;
  description?: string | null;
  items?: Array<{
    title?: string | null;
    content?: string | null;
    [key: string]: unknown;
  } | null> | null;
  background?: string | null;
}

export const Accordion = ({ data }: { data: AccordionBlockData }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section background={data.background!}>
      <div className='mx-auto max-w-3xl px-6'>
        {data.title && (
          <div className='mb-8 text-center'>
            <h2 data-tina-field={tinaField(data, 'title')} className='text-4xl font-semibold'>
              {data.title}
            </h2>
            {data.description && (
              <p data-tina-field={tinaField(data, 'description')} className='mt-4 text-lg text-gray-600 dark:text-gray-300'>
                {data.description}
              </p>
            )}
          </div>
        )}

        <div className='space-y-2'>
          {data.items &&
            data.items.map((item, index) => (
              <AccordionItemComponent
                key={index}
                item={item}
                index={index}
                isOpen={openIndex === index}
                onOpenChange={(open) => setOpenIndex(open ? index : null)}
                itemPath={`items.${index}`}
              />
            ))}
        </div>
      </div>
    </Section>
  );
};

interface AccordionItemComponentProps {
  item:
    | {
        title?: string | null;
        content?: string | null;
        [key: string]: unknown;
      }
    | null
    | undefined;
  index: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  itemPath: string;
}

const AccordionItemComponent: React.FC<AccordionItemComponentProps> = ({ item, index, isOpen, onOpenChange, itemPath }) => {
  if (!item) return null;

  const title = (item.title as string | null | undefined) || `Item ${index + 1}`;
  const content = item.content;

  return (
    <Collapsible.Root open={isOpen} onOpenChange={onOpenChange} className='border border-gray-200 rounded-lg overflow-hidden dark:border-gray-800'>
      <Collapsible.Trigger asChild>
        <button className='w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors'>
          <h3 data-tina-field={tinaField(item, 'title')} className='font-semibold text-left text-lg'>
            {title}
          </h3>
          <ChevronDown className={`transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} size={20} />
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content className='px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30'>
        <div data-tina-field={tinaField(item, 'content')} className='prose dark:prose-invert max-w-none'>
          {content && <TinaMarkdown content={content as any} />}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

const defaultItem = {
  title: 'Accordion Item',
  content: 'This is the content for this accordion item.',
};

export const accordionBlockSchema: Template = {
  name: 'accordion',
  label: 'Accordion',
  ui: {
    previewSrc: '/blocks/accordion.png',
    defaultItem: {
      title: 'Frequently Asked Questions',
      description: 'Find answers to common questions',
      items: [defaultItem, defaultItem, defaultItem],
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
      label: 'Accordion Items',
      name: 'items',
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item?.title || 'Accordion Item',
          };
        },
        defaultItem: {
          ...defaultItem,
        },
      },
      fields: [
        {
          type: 'string',
          label: 'Title',
          name: 'title',
        },
        {
          type: 'rich-text',
          label: 'Content',
          name: 'content',
        },
      ],
    },
  ],
};
