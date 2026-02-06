import Head from 'next/head';

export type SEOProps = {
  title: string;
  description?: string;
  image?: string;
  url?: string;
};

export default function SEO({ title, description, image, url }: SEOProps) {
  const metaTitle = title;
  const metaDescription = description ?? '';

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name='description' content={metaDescription} />

      <meta property='og:type' content='article' />
      <meta property='og:title' content={metaTitle} />
      <meta property='og:description' content={metaDescription} />
      {image && <meta property='og:image' content={image} />}
      {url && <meta property='og:url' content={url} />}

      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={metaTitle} />
      <meta name='twitter:description' content={metaDescription} />
      {image && <meta name='twitter:image' content={image} />}
    </Head>
  );
}
