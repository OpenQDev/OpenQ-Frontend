import React, { useEffect } from 'react';
import { SliceZone } from '@prismicio/react';
import { components } from '../../slices';
import { createClient } from '../../prismicio';
export default function Home({ page }) {
  useEffect(() => {
    console.log(page, 'this');
  }, [page]);
  return (
    <div className='flex flex-col items-center content-center'>
      {' '}
      {page?.data && <SliceZone slices={page.data.slices} components={components} />}
    </div>
  );
}

export async function getStaticProps() {
  // Client used to fetch CMS content.
  const client = createClient();

  // Page document for our homepage from the CMS.
  const page = await client.getByUID('blog_post', 'first-post');

  // Pass the homepage as prop to our page.
  return {
    props: { page },
  };
}

export function getStaticPaths() {
  return {
    paths: [{ params: { slug: 'first-post' } }],
    fallback: true,
  };
}
