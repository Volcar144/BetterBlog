import { format } from 'date-fns';
import React from 'react';
import { Components, TinaMarkdown, TinaMarkdownContent } from 'tinacms/dist/rich-text';
import Image from 'next/image';
import { Prism } from 'tinacms/dist/rich-text/prism';
import { Video } from './blocks/video';
import { PageBlocksVideo } from '@/tina/__generated__/types';
import { Mermaid } from './blocks/mermaid';
import { CodeExampleBlockLive } from './blocks/code-example-live'; // <- import the live playground
import { RubiksCubePlayer } from './rubiks-cube-player';
import { NewsletterSignupForm } from './newsletter-signup';
import { AlertCallout } from './blocks/alert-callout';
import { ImageLightbox } from './ui/image-lightbox';

export const components: Components<{
  BlockQuote: {
    children: TinaMarkdownContent;
    authorName: string;
  };
  DateTime: {
    format?: string;
  };
  NewsletterSignup: {
    placeholder?: string;
    buttonText?: string;
    title?: string;
    description?: string;
  };
  Callout: {
    type?: 'info' | 'warning' | 'danger' | 'success';
    title?: string;
    children: TinaMarkdownContent;
  };
  video: PageBlocksVideo;
  CodeExample: {
    code: string;
    language: string;
    stdin?: string;
  };
  codeExample: {
    code: string;
    language: string;
    stdin?: string;
  };
  RubiksCube: {
    title?: string;
    algorithm: string;
    setupAlgorithm?: string;
    autoplay?: boolean;
    stickering?: string;
    showControls?: boolean;
  };
}> = {
  code_block: (props) => {
    if (!props) {
      return <></>;
    }

    if (props.lang === 'mermaid') {
      return <Mermaid value={props.value} />;
    }

    return <Prism lang={props.lang} value={props.value} />;
  },

  CodeExample: (props: { code: string; language: string; stdin?: string }) => {
    return <CodeExampleBlockLive code={props.code} language={props.language} stdin={props.stdin} />;
  },

  codeExample: (props: { code: string; language: string; stdin?: string }) => {
    return <CodeExampleBlockLive code={props.code} language={props.language} stdin={props.stdin} />;
  },

  RubiksCube: (props: {
    title?: string;
    algorithm: string;
    setupAlgorithm?: string;
    autoplay?: boolean;
    stickering?: string;
    showControls?: boolean;
  }) => {
    return (
      <RubiksCubePlayer
        title={props.title}
        algorithm={props.algorithm}
        setupAlgorithm={props.setupAlgorithm}
        autoplay={props.autoplay}
        stickering={(props.stickering as any) || 'none'}
        showControls={props.showControls !== false}
      />
    );
  },

  BlockQuote: (props: { children: TinaMarkdownContent; authorName: string }) => {
    return (
      <div>
        <blockquote>
          <TinaMarkdown content={props.children} />
          {props.authorName}
        </blockquote>
      </div>
    );
  },

  Callout: (props: {
    type?: 'info' | 'warning' | 'danger' | 'success';
    title?: string;
    children: TinaMarkdownContent;
  }) => {
    return <AlertCallout type={props.type || 'info'} title={props.title} children={props.children} />;
  },

  DateTime: (props) => {
    const dt = React.useMemo(() => {
      return new Date();
    }, []);

    switch (props.format) {
      case 'iso':
        return <span>{format(dt, 'yyyy-MM-dd')}</span>;
      case 'utc':
        return <span>{format(dt, 'eee, dd MMM yyyy HH:mm:ss OOOO')}</span>;
      case 'local':
        return <span>{format(dt, 'P')}</span>;
      default:
        return <span>{format(dt, 'P')}</span>;
    }
  },

  NewsletterSignup: (props: {
    placeholder?: string;
    buttonText?: string;
    title?: string;
    description?: string;
  }) => {
    return <NewsletterSignupForm placeholder={props.placeholder} buttonText={props.buttonText} title={props.title} description={props.description} />;
  },

  img: (props) => {
    if (!props) {
      return <></>;
    }
    return (
      <span className='flex items-center justify-center my-8'>
        <ImageLightbox src={props.url} alt={props.alt || ''} width={500} height={500} caption={props.caption} />
      </span>
    );
  },

  mermaid: (props: any) => <Mermaid {...props} />,

  video: (props) => {
    return <Video data={props} />;
  },
};
