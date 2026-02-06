import React from 'react';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { PageBlocksCodeExample } from '@/tina/__generated__/types';
import type { Template } from 'tinacms';

export const CodeExampleBlockCMS = ({ data }: { data: PageBlocksCodeExample }) => {
  return (
    <Section>
      <div className='mb-4'>
        <h2 data-tina-field={tinaField(data, 'title')} className='text-2xl font-semibold'>
          {data.title || 'Code Example'}
        </h2>
      </div>

      <div className='mb-4'>
        <label className='block font-medium'>Language</label>
        <input
          type='text'
          data-tina-field={tinaField(data, 'language')}
          placeholder='javascript'
          className='w-full border p-2 rounded mb-2'
          defaultValue={data.language || 'javascript'}
        />
      </div>

      <div className='mb-4'>
        <label className='block font-medium'>Code</label>
        <textarea
          data-tina-field={tinaField(data, 'code')}
          placeholder='// Your code here'
          className='w-full border p-2 rounded font-mono min-h-[120px]'
          defaultValue={data.code || ''}
        />
      </div>

      <div className='mb-4'>
        <label className='block font-medium'>Input (optional)</label>
        <textarea
          data-tina-field={tinaField(data, 'stdin')}
          placeholder='Optional stdin'
          className='w-full border p-2 rounded font-mono min-h-[60px]'
          defaultValue={data.stdin || ''}
        />
      </div>

      <div>
        <h3 className='font-semibold mb-2'>Preview</h3>
        <SyntaxHighlighter language={data.language || 'javascript'} style={coy}>
          {data.code || ''}
        </SyntaxHighlighter>
      </div>
    </Section>
  );
};

/**
 * TinaCMS Block Schema
 */
export const codeExampleBlockSchema: Template = {
  name: 'codeExample',
  label: 'Code Example',
  ui: {
    previewSrc: '/blocks/code-example.png',
    defaultItem: {
      title: 'Code Example',
      language: 'javascript',
      code: 'console.log("Hello World");',
      stdin: '',
    },
  },
  fields: [
    { type: 'string', label: 'Title', name: 'title' },
    { type: 'string', label: 'Language', name: 'language' },
    { type: 'string', label: 'Code', name: 'code', ui: { component: 'textarea' } },
    { type: 'string', label: 'Input (optional)', name: 'stdin', ui: { component: 'textarea' } },
  ],
};
