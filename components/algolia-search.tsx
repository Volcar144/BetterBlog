'use client';

import Search from '@/components/search';

export default function AlgoliaSearch() {
  return (
    <Search
      applicationId='V3QMCF4Y7F'
      apiKey='fabe89147997827f4fa6d7b79c196364'
      indexName='blog_archiem_top_v3qmcf4y7f_pages'
      attributes={{
        primaryText: 'title',
        secondaryText: 'headers.0',
        tertiaryText: undefined,
        url: 'url',
        image: undefined,
      }}
      placeholder='Search blog posts...'
      buttonText='Search'
    />
  );
}
